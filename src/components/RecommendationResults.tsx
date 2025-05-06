import React, { useState } from 'react';
import { AIToolRecommendation } from '../types';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface RecommendationResultsProps {
  fromBookmarks: AIToolRecommendation[];
  fromInternet: AIToolRecommendation[];
}

const RecommendationResults: React.FC<RecommendationResultsProps> = ({ 
  fromBookmarks, 
  fromInternet 
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderRecommendation = (recommendation: AIToolRecommendation, index: number, source: string) => {
    const id = `${source}-${index}`;
    const isExpanded = expandedItems[id] || false;
    
    return (
      <div 
        key={id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                {recommendation.name}
              </h3>
              <div className="inline-block bg-deep-blue-100 dark:bg-deep-blue-900/40 text-deep-blue-800 dark:text-deep-blue-300 text-xs px-2 py-1 rounded-full mb-3">
                {recommendation.category}
              </div>
            </div>
            <a 
              href={recommendation.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-deep-blue-600 dark:text-deep-blue-400 hover:text-deep-blue-800 dark:hover:text-deep-blue-300 transition-colors"
              aria-label={`Visit ${recommendation.name} website`}
            >
              <ExternalLink size={20} />
            </a>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            {recommendation.description}
          </p>
          
          <button
            onClick={() => toggleExpand(id)}
            className="flex items-center text-deep-blue-600 dark:text-deep-blue-400 text-sm hover:text-deep-blue-800 dark:hover:text-deep-blue-300 transition-colors"
          >
            <span>Why this matches you</span>
            {isExpanded ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
              {recommendation.matchReason}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Your AI Tool Recommendations
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Based on your bookmarks, we've found these AI tools that match your interests
        </p>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <span className="bg-deep-blue-100 dark:bg-deep-blue-900/40 text-deep-blue-800 dark:text-deep-blue-300 w-8 h-8 rounded-full flex items-center justify-center mr-2">
            1
          </span>
          Tools You Might Already Know
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          These AI tools appear in your bookmarks or are from companies you've shown interest in
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fromBookmarks.map((recommendation, index) => 
            renderRecommendation(recommendation, index, 'bookmarks')
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <span className="bg-deep-blue-100 dark:bg-deep-blue-900/40 text-deep-blue-800 dark:text-deep-blue-300 w-8 h-8 rounded-full flex items-center justify-center mr-2">
            2
          </span>
          New Tools You Should Try
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Based on your interests, we think you'll love these AI tools you might not know about yet
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fromInternet.map((recommendation, index) => 
            renderRecommendation(recommendation, index, 'internet')
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationResults;
