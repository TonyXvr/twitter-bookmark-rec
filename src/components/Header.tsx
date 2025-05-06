import React from 'react';
import { Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-deep-blue-600 dark:text-deep-blue-400" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              AI Tool Recommender
            </h1>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
