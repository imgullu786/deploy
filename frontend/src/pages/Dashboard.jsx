import React, { useState, useEffect } from 'react';
import { Plus, Rocket, Zap, Globe, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { projectService } from '../services/projectService';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-primary/20 border-t-accent-primary"></div>
          <div className="absolute inset-0 rounded-full bg-accent-primary/10 blur-xl"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: Rocket,
      color: 'text-accent-primary',
    },
    {
      label: 'Active Deployments',
      value: projects.filter(p => p.status === 'running').length,
      icon: Globe,
      color: 'text-green-400',
    },
    {
      label: 'In Progress',
      value: projects.filter(p => p.status === 'deploying').length,
      icon: Zap,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="heading-primary text-text-primary">
            Your <span className="text-gradient">Deployment</span> Hub
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Manage and deploy your applications with lightning speed and enterprise-grade reliability
          </p>
        </div>

        <Link
          to="/create-project"
          className="inline-flex btn-primary items-center space-x-3"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Project</span>
          <Zap className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.label} className="card p-6 text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div className={`absolute inset-0 h-8 w-8 ${stat.color} opacity-20 blur-sm`}></div>
              </div>
            </div>
            <div className="text-3xl font-black text-text-primary mb-2">{stat.value}</div>
            <div className="text-sm font-medium text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center animate-slide-up">
          {error}
        </div>
      )}

      {/* Projects */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">Recent Projects</h2>
          {projects.length > 0 && (
            <div className="flex items-center space-x-2 text-text-secondary text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>{projects.length} total</span>
            </div>
          )}
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={project._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-slide-up">
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full opacity-20 blur-xl"></div>
                <div className="relative bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 rounded-full p-6 border border-accent-primary/20">
                  <Rocket className="h-12 w-12 text-accent-primary mx-auto" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-text-primary">Ready to Deploy?</h3>
                <p className="text-text-secondary">
                  Create your first project and experience the future of deployment automation.
                </p>
              </div>
              
              <Link
                to="/create-project"
                className="inline-flex btn-primary items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Project</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;