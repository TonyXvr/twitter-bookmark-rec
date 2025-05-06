import React from 'react';
import { AIModel } from '../types';
import { Sparkles, Brain } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  onModelChange,
  disabled = false
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="text-center mb-2">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Select AI Model
        </h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={() => onModelChange('openai')}
          disabled={disabled}
          className={`flex items-center p-4 rounded-lg border-2 transition-all ${
            selectedModel === 'openai'
              ? 'border-deep-blue-500 bg-deep-blue-50 dark:bg-deep-blue-900/30'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-deep-blue-300 dark:hover:border-deep-blue-700'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="flex-shrink-0 mr-3">
            <Sparkles size={24} className={`${
              selectedModel === 'openai' 
                ? 'text-deep-blue-600 dark:text-deep-blue-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`} />
          </div>
          <div className="text-left">
            <div className={`font-medium ${
              selectedModel === 'openai'
                ? 'text-deep-blue-700 dark:text-deep-blue-300'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              OpenAI GPT-4o
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Powerful multimodal model with deep analysis capabilities
            </div>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => onModelChange('perplexity')}
          disabled={disabled}
          className={`flex items-center p-4 rounded-lg border-2 transition-all ${
            selectedModel === 'perplexity'
              ? 'border-deep-blue-500 bg-deep-blue-50 dark:bg-deep-blue-900/30'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-deep-blue-300 dark:hover:border-deep-blue-700'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="flex-shrink-0 mr-3">
            <Brain size={24} className={`${
              selectedModel === 'perplexity' 
                ? 'text-deep-blue-600 dark:text-deep-blue-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`} />
          </div>
          <div className="text-left">
            <div className={`font-medium ${
              selectedModel === 'perplexity'
                ? 'text-deep-blue-700 dark:text-deep-blue-300'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              Perplexity Sonar
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Advanced model with up-to-date knowledge and web search capabilities
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ModelSelector;
