import Docker from 'dockerode';
import { promises as fs } from 'fs';
import path from 'path';

class DockerService {
  constructor() {
    this.docker = new Docker();
    this.portCounter = 3001; // Start from 3001 to avoid conflicts
  }

  async buildAndDeploy(projectPath, projectId, envVars = {}) {
    try {
      // Create Dockerfile if it doesn't exist
      await this.ensureDockerfile(projectPath);

      // Build Docker image
      const imageName = `project-${projectId}:latest`;
      await this.buildImage(projectPath, imageName, projectId);

      // Run container with environment variables
      const containerInfo = await this.runContainer(imageName, projectId, envVars);

      return containerInfo;
    } catch (error) {
      throw new Error(`Docker deployment failed: ${error.message}`);
    }
  }

  async ensureDockerfile(projectPath) {
    const dockerfilePath = path.join(projectPath, 'Dockerfile');
    
    try {
      await fs.access(dockerfilePath);
    } catch {
      // Create default Dockerfile for Node.js apps
      const dockerfile = `
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
      `.trim();

      await fs.writeFile(dockerfilePath, dockerfile);
    }
  }

  async buildImage(projectPath, imageName, projectId) {
    return new Promise((resolve, reject) => {
      const buildOptions = {
        t: imageName,
      };

      this.docker.buildImage({
        context: projectPath,
        src: ['.'],
      }, buildOptions, (err, stream) => {
        if (err) return reject(err);

        let buildOutput = '';
        
        stream.on('data', (chunk) => {
          const data = chunk.toString();
          buildOutput += data;
          
          // Parse Docker build output and emit logs
          try {
            const lines = data.split('\n').filter(line => line.trim());
            lines.forEach(line => {
              if (line.trim()) {
                try {
                  const parsed = JSON.parse(line);
                  if (parsed.stream) {
                    this.emitBuildLog(projectId, parsed.stream.trim());
                  }
                } catch {
                  // Not JSON, emit as is
                  this.emitBuildLog(projectId, line.trim());
                }
              }
            });
          } catch (parseError) {
            console.error('Error parsing build output:', parseError);
          }
        });

        stream.on('end', () => {
          resolve(buildOutput);
        });
        
        stream.on('error', (error) => {
          reject(error);
        });
      });
    });
  }

  async runContainer(imageName, projectId, envVars = {}) {
    // Get next available port
    const hostPort = await this.getNextAvailablePort();
    
    // Prepare environment variables
    const envArray = Object.entries(envVars).map(([key, value]) => `${key}=${value}`);
    
    // Add default PORT environment variable
    envArray.push(`PORT=3000`);

    const containerConfig = {
      Image: imageName,
      name: `project-${projectId}`,
      Env: envArray,
      ExposedPorts: { '3000/tcp': {} },
      HostConfig: {
        PortBindings: {
          '3000/tcp': [{ HostPort: hostPort.toString() }]
        },
        RestartPolicy: {
          Name: 'unless-stopped',
        },
        Memory: 512 * 1024 * 1024, // 512MB limit
        CpuShares: 512, // CPU limit
      },
      Labels: {
        'deployflow.project.id': projectId,
        'deployflow.port': hostPort.toString(),
      },
    };

    const container = await this.docker.createContainer(containerConfig);
    await container.start();

    // Wait a moment for container to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if container is running
    const containerInfo = await container.inspect();
    if (!containerInfo.State.Running) {
      throw new Error('Container failed to start');
    }

    return {
      containerId: container.id,
      port: hostPort,
      deployUrl: `http://localhost:${hostPort}`, // In production, this would be your domain
    };
  }

  async getNextAvailablePort() {
    const port = this.portCounter++;
    
    // Check if port is actually available
    try {
      const containers = await this.docker.listContainers();
      const usedPorts = containers
        .filter(container => container.Labels && container.Labels['deployflow.port'])
        .map(container => parseInt(container.Labels['deployflow.port']));
      
      while (usedPorts.includes(this.portCounter)) {
        this.portCounter++;
      }
      
      return this.portCounter++;
    } catch (error) {
      console.error('Error checking ports:', error);
      return port;
    }
  }

  async stopContainer(containerId) {
    try {
      const container = this.docker.getContainer(containerId);
      await container.stop({ t: 10 }); // 10 second timeout
      await container.remove();
    } catch (error) {
      console.error('Failed to stop container:', error);
    }
  }

  async getContainerLogs(containerId) {
    try {
      const container = this.docker.getContainer(containerId);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        timestamps: true,
        tail: 100, // Last 100 lines
      });
      return logs.toString();
    } catch (error) {
      console.error('Failed to get container logs:', error);
      return '';
    }
  }

  async getContainerStatus(containerId) {
    try {
      const container = this.docker.getContainer(containerId);
      const info = await container.inspect();
      return {
        running: info.State.Running,
        status: info.State.Status,
        startedAt: info.State.StartedAt,
      };
    } catch (error) {
      console.error('Failed to get container status:', error);
      return { running: false, status: 'unknown' };
    }
  }

  emitBuildLog(projectId, message) {
    // This will be called from deploymentService
    if (global.deploymentService) {
      global.deploymentService.emitLog(projectId, 'info', message);
    }
  }
}

export const dockerService = new DockerService();