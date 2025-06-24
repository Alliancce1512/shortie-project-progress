
import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const TopNav = () => {
  return (
    <nav className="w-full bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-foreground">
          <span className="text-accent">Shortie</span>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default TopNav;
