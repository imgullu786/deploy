import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Globe, Activity, XCircle, Server, Zap, Calendar } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'running':
        return {
          className: 'status-running',
          icon: <Activity className="h-4 w-4" />,
          label: 'Live',
        };
      case 'deploying':
        return {
          className: 'status-deploying',
          icon: <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-400 border-t-transparent" />,
          label: 'Deploying',
        };
      case 'failed':
        return {
          className: 'status-failed',
          icon: <XCircle className="h-4 w-4" />,
          label: 'Failed',
        };
      default:
        return {
          className: 'status-idle',
          icon: <Activity className="h-4 w-4 opacity-50" />,
          label: 'Idle',
        };
    }
  };

  const status = getStatusConfig(project.status);

  return (
    <div className="card p-6 group hover:border-accent-primary/50 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors truncate">
              {project.name}
            </h3>
            <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.className}`}>
              {status.icon}
              <span>{status.label}</span>
            </div>
          </div>
          
          {project.description && (
            <p className="text-sm text-text-secondary line-clamp-2">{project.description}</p>
          )}
        </div>
        
        <Link
          to={`/project/${project._id}`}
          className="ml-4 p-2 rounded-lg bg-bg-secondary border border-border-primary text-text-secondary hover:text-accent-primary hover:border-accent-primary/50 transition-all group-hover:scale-110"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* Project Details */}
      <div className="space-y-4 mb-6">
        {project.githubRepo && (
          <div className="flex items-center space-x-3 text-sm">
            <Github className="h-4 w-4 text-text-muted flex-shrink-0" />
            <span className="text-text-secondary truncate font-mono text-xs">
              {project.githubRepo.replace('https://github.com/', '')}
            </span>
          </div>
        )}
        
        {project.subDomain && (
          <div className="flex items-center space-x-3 text-sm">
            <Globe className="h-4 w-4 text-text-muted flex-shrink-0" />
            <span className="text-text-secondary truncate">
              {project.subDomain}.gulamgaush.in
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-3 text-sm">
          {project.buildType === 'static' ? (
            <Globe className="h-4 w-4 text-text-muted flex-shrink-0" />
          ) : (
            <Server className="h-4 w-4 text-text-muted flex-shrink-0" />
          )}
          <div className="flex items-center space-x-2">
            <span className="code-text text-xs">
              {project.buildType || 'static'}
            </span>
            {project.buildConfig && (
              <span className="text-text-muted text-xs">
                • {project.buildConfig.rootDirectory !== '.' ? `${project.buildConfig.rootDirectory}/` : ''}
                {project.buildType === 'static' ? project.buildConfig.publishDirectory : 'server'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border-primary">
        <div className="flex items-center space-x-2 text-xs text-text-muted">
          <Calendar className="h-3 w-3" />
          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        
        {project.deployUrl && project.status === 'running' && (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs font-medium text-accent-primary hover:text-accent-secondary transition-colors"
          >
            <Zap className="h-3 w-3" />
            <span>Visit</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;