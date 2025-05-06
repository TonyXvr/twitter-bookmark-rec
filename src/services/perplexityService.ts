import { Bookmark, AIToolRecommendation } from '../types';

const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

export const analyzeBookmarks = async (bookmarks: Bookmark[]): Promise<{
  fromBookmarks: AIToolRecommendation[];
  fromInternet: AIToolRecommendation[];
}> => {
  try {
    // Prepare the bookmarks data for the API
    const bookmarksData = bookmarks.map(b => ({
      url: b.url,
      title: b.title,
      description: b.description || '',
      tags: b.tags || [],
      dateAdded: b.dateAdded || ''
    }));

    // Increase the number of bookmarks analyzed (up to 100)
    const limitedBookmarks = bookmarksData.slice(0, 100);
    
    // Extract domains for better analysis
    const domains = extractDomains(limitedBookmarks);
    const topDomains = getTopDomains(domains, 10);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: `You are an AI tool recommendation expert with deep knowledge of the latest AI tools, platforms, and services across various domains. Your task is to analyze the user's bookmarks in depth and provide highly personalized AI tool recommendations.

            First, analyze the bookmarks to understand:
            1. The user's interests, professional domains, and technical sophistication
            2. The types of content they engage with (technical, creative, business, etc.)
            3. Any patterns in their browsing behavior
            4. Their likely use cases for AI tools
            5. IMPORTANT: Identify any AI tools that are directly mentioned within the bookmark titles or descriptions
            
            Then provide two comprehensive sets of recommendations:
            
            1. FROM BOOKMARKS: 
               - Tools that appear in their bookmarks or from the same companies/platforms they already use
               - Tools that are explicitly mentioned within the content of their bookmarks
               - These should be tools they might already know but could benefit from using more effectively
            
            2. FROM INTERNET: New, cutting-edge AI tools they likely don't know about but would find extremely valuable based on their interests and needs. Focus on high-quality, specific tools rather than generic platforms.
            
            For each recommendation, provide:
            - name: The name of the tool
            - description: A clear, concise description of what it does (2-3 sentences)
            - url: The direct URL to the tool
            - category: A specific category (e.g., "Text-to-Image Generation", "Code Assistance", "Content Creation")
            - matchReason: A personalized explanation of why this specific tool matches their needs and interests (3-4 sentences). If the tool was mentioned in their bookmarks, explicitly state this.
            
            Format your response as a JSON object with two arrays: "fromBookmarks" and "fromInternet".
            Each array should contain 6-10 high-quality recommendations.
            
            Top domains in their bookmarks: ${JSON.stringify(topDomains)}`
          },
          {
            role: 'user',
            content: `Here are my bookmarks: ${JSON.stringify(limitedBookmarks)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Perplexity API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    let recommendations;
    
    try {
      // First try to parse directly if it's already a JSON object
      if (typeof data.choices[0].message.content === 'object') {
        recommendations = data.choices[0].message.content;
      } else {
        // Otherwise parse it as a JSON string
        recommendations = JSON.parse(data.choices[0].message.content);
      }
    } catch (parseError) {
      console.error('Error parsing Perplexity response:', parseError);
      console.log('Raw response content:', data.choices[0].message.content);
      
      // Attempt to extract JSON from the response if it contains text
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          recommendations = JSON.parse(jsonMatch[0]);
        } catch (e) {
          throw new Error('Failed to parse JSON from Perplexity response');
        }
      } else {
        throw new Error('Invalid response format from Perplexity API');
      }
    }
    
    return {
      fromBookmarks: recommendations.fromBookmarks || [],
      fromInternet: recommendations.fromInternet || []
    };
  } catch (error) {
    console.error('Error analyzing bookmarks with Perplexity:', error);
    throw error;
  }
};

// Helper function to extract domains from URLs
const extractDomains = (bookmarks: any[]): string[] => {
  return bookmarks
    .map(bookmark => {
      try {
        if (!bookmark.url) return null;
        const url = new URL(bookmark.url);
        return url.hostname.replace('www.', '');
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean) as string[];
};

// Helper function to get the most frequent domains
const getTopDomains = (domains: string[], count: number): {domain: string, count: number}[] => {
  const domainCounts: Record<string, number> = {};
  
  domains.forEach(domain => {
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
  });
  
  return Object.entries(domainCounts)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, count);
};
