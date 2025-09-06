import React, { useEffect, useRef } from 'react';
import { Terminal, Activity, AlertCircle } from 'lucide-react';

const LogsPanel = ({ logs, isLoading }) => {
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogIcon = (level) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-400 flex-shrink-0" />;
      case 'warn':
        return <AlertCircle className="h-3 w-3 text-yellow-400 flex-shrink-0" />;
      case 'success':
        return <Activity className="h-3 w-3 text-green-400 flex-shrink-0" />;
      default:
        return <Activity className="h-3 w-3 text-accent-primary flex-shrink-0" />;
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Terminal className="h-6 w-6 text-accent-primary" />
            {isLoading && (
              <div className="absolute inset-0 h-6 w-6 text-accent-primary opacity-50 blur-sm animate-pulse"></div>
            )}
          </div>
          <h3 className="text-xl font-bold text-text-primary">Deployment Logs</h3>
        </div>
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-accent-primary">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent-primary/20 border-t-accent-primary"></div>
            <span className="font-medium">Live</span>
          </div>
        )}
      </div>

      {/* Terminal */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-accent-primary/5 rounded-xl"></div>
        <div className="relative bg-bg-primary rounded-xl border border-border-primary overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border-primary">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs font-mono text-text-muted">deployment-logs</div>
          </div>

          {/* Terminal Body */}
          <div className="h-96 overflow-y-auto p-4 font-mono text-sm space-y-2">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 group hover:bg-bg-secondary/30 px-2 py-1 rounded transition-colors">
                  <span className="text-text-muted text-xs mt-0.5 flex-shrink-0 w-20">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {getLogIcon(log.level)}
                  <span className={`${getLogColor(log.level)} flex-1 leading-relaxed`}>
                    {log.message}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="relative">
                  <Terminal className="h-12 w-12 text-text-muted opacity-50" />
                  <div className="absolute inset-0 h-12 w-12 text-accent-primary/20 blur-lg"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-text-muted font-medium">No logs available</p>
                  <p className="text-text-muted text-xs">Deploy your project to see real-time logs here</p>
                </div>
              </div>
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPanel;