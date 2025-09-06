import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-bg-primary grid-pattern">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none"></div>
      
      <Navbar />
      
      <main className="relative container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;