import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Rocket, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="relative bg-bg-primary/80 backdrop-blur-xl border-b border-border-primary">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-accent-primary/5"></div>
      
      <div className="relative container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 text-2xl font-black text-text-primary hover:scale-105 transition-transform group"
          >
            <div className="relative">
              <Rocket className="h-8 w-8 text-accent-primary drop-shadow-lg group-hover:animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 text-accent-primary opacity-20 blur-sm group-hover:opacity-40 transition-opacity"></div>
            </div>
            <span className="tracking-tight">
              Deploy<span className="text-gradient">Easy</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-sm font-medium text-text-secondary">
              Welcome back, <span className="font-semibold text-accent-primary">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="btn-ghost flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-bg-secondary border border-border-primary text-text-primary hover:border-accent-primary/50 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-bg-secondary/95 backdrop-blur-xl border-b border-border-primary animate-slide-up">
            <div className="px-6 py-4 space-y-4">
              <div className="text-sm font-medium text-text-secondary">
                Welcome back, <span className="font-semibold text-accent-primary">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full btn-ghost flex items-center justify-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;