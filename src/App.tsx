import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ModelSelector from './components/ModelSelector';
import RecommendationResults from './components/RecommendationResults';
import { parseBookmarksFile } from './services/fileParser';
import { analyzeBookmarks as analyzeWithOpenAI } from './services/openaiService';
import { analyzeBookmarks as analyzeWithPerplexity } from './services/perplexityService';
import { AIToolRecommendation, Bookmark, AIModel } from './types';
import { AlertCircle } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<{
    fromBookmarks: AIToolRecommendation[];
    fromInternet: AIToolRecommendation[];
  }>({
    fromBookmarks: [],
    fromInternet: []
  });
  const [hasResults, setHasResults] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('openai');

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Parse the uploaded file
      const bookmarks: Bookmark[] = await parseBookmarksFile(file);
      
      if (bookmarks.length === 0) {
        throw new Error('No valid bookmarks found in the file');
      }
      
      // Analyze bookmarks with selected model
      let results;
      try {
        if (selectedModel === 'openai') {
          results = await analyzeWithOpenAI(bookmarks);
        } else {
          results = await analyzeWithPerplexity(bookmarks);
        }
      } catch (apiError) {
        console.error(`Error with ${selectedModel} API:`, apiError);
        throw new Error(`${selectedModel === 'openai' ? 'OpenAI' : 'Perplexity'} API error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`);
      }
      
      setRecommendations(results);
      setHasResults(true);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Discover AI Tools Based on Your Bookmarks
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Upload your bookmarks file and we'll analyze it to recommend AI tools tailored to your interests.
              Get personalized recommendations from tools you might already know and discover new ones.
            </p>
          </div>
          
          {!hasResults && (
            <section className="mb-12">
              <div className="flex flex-col items-center">
                <ModelSelector 
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={isLoading}
                />
                
                <FileUpload onFileUploaded={handleFileUpload} isLoading={isLoading} />
              </div>
            </section>
          )}
          
          {error && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center text-red-700 dark:text-red-400">
                <AlertCircle size={20} className="mr-2" />
                <span className="font-medium">Error: {error}</span>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="max-w-md mx-auto text-center p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-deep-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Analyzing your bookmarks with {selectedModel === 'openai' ? 'OpenAI GPT-4o' : 'Perplexity Sonar'}...
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                This may take a minute as we're performing a deep analysis of your bookmarks and the tools mentioned within them
              </p>
            </div>
          )}
          
          {hasResults && (
            <section className="mb-8">
              <RecommendationResults 
                fromBookmarks={recommendations.fromBookmarks} 
                fromInternet={recommendations.fromInternet} 
              />
              
              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    setHasResults(false);
                    setRecommendations({ fromBookmarks: [], fromInternet: [] });
                  }}
                  className="px-6 py-2 bg-deep-blue-600 dark:bg-deep-blue-700 text-white rounded-md hover:bg-deep-blue-700 dark:hover:bg-deep-blue-800 transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            </section>
          )}
        </main>
        
        <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>AI Tool Recommender &copy; {new Date().getFullYear()}</p>
            <p className="text-sm text-gray-400 mt-2">
              Powered by {selectedModel === 'openai' ? 'OpenAI GPT-4o' : 'Perplexity Sonar'} with Enhanced Deep Analysis
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
