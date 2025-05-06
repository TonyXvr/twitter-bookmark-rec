import { Bookmark } from '../types';

export const parseBookmarksFile = (file: File): Promise<Bookmark[]> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const bookmarks = JSON.parse(event.target?.result as string);
          resolve(normalizeBookmarks(bookmarks));
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    } else {
      reject(new Error('Unsupported file format. Please upload JSON.'));
    }
  });
};

// Normalize different bookmark formats to our standard format
const normalizeBookmarks = (data: any): Bookmark[] => {
  // Handle different possible formats from various export tools
  if (Array.isArray(data)) {
    return data.map(item => {
      // Twitter bookmarks format
      if (item.tweet_url || item.tweetUrl) {
        return {
          url: item.tweet_url || item.tweetUrl,
          title: item.text || item.content || 'Twitter Bookmark',
          description: item.text || item.content,
          dateAdded: item.date || item.created_at || new Date().toISOString()
        };
      }
      
      // Generic bookmark format
      return {
        url: item.url || item.link || item.href || '',
        title: item.title || item.name || 'Bookmark',
        description: item.description || item.desc || item.content || '',
        tags: item.tags || item.categories || [],
        dateAdded: item.date || item.dateAdded || item.created_at || new Date().toISOString()
      };
    }).filter(bookmark => bookmark.url);
  }
  
  // Handle nested formats
  if (data.bookmarks || data.items) {
    return normalizeBookmarks(data.bookmarks || data.items);
  }
  
  return [];
};
