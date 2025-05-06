import { useState, useEffect } from 'react';

interface UsageData {
  count: number;
  resetDate: string; // ISO string of when the count resets
}

const USAGE_LIMIT = 2; // 2 times per day
const STORAGE_KEY = 'bookmark_analysis_usage';

// Get the current usage data from localStorage
export const getUsageData = (): UsageData => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  
  if (!storedData) {
    // Initialize with zero count if no data exists
    return {
      count: 0,
      resetDate: getNextResetDate()
    };
  }
  
  try {
    const parsedData: UsageData = JSON.parse(storedData);
    
    // Check if we need to reset based on date
    if (new Date() >= new Date(parsedData.resetDate)) {
      // It's a new day, reset the count
      const newData = {
        count: 0,
        resetDate: getNextResetDate()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing usage data:', error);
    // Return fresh data if there was an error
    return {
      count: 0,
      resetDate: getNextResetDate()
    };
  }
};

// Increment usage count and return if the operation was successful
export const incrementUsage = (): boolean => {
  const currentData = getUsageData();
  
  // Check if limit is already reached
  if (currentData.count >= USAGE_LIMIT) {
    return false;
  }
  
  // Increment count
  const newData = {
    ...currentData,
    count: currentData.count + 1
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  return true;
};

// Check if user can make another request
export const canMakeRequest = (): boolean => {
  const { count } = getUsageData();
  return count < USAGE_LIMIT;
};

// Get remaining usage count
export const getRemainingUsage = (): number => {
  const { count } = getUsageData();
  return Math.max(0, USAGE_LIMIT - count);
};

// Calculate next reset date (midnight tonight)
const getNextResetDate = (): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
};

// Hook for components to use the usage data
export const useUsageLimit = () => {
  const [usageData, setUsageData] = useState<UsageData>(getUsageData());
  
  // Update state when component mounts
  useEffect(() => {
    setUsageData(getUsageData());
    
    // Set up interval to check for reset
    const intervalId = setInterval(() => {
      const freshData = getUsageData();
      setUsageData(freshData);
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  return {
    usageCount: usageData.count,
    remainingUsage: USAGE_LIMIT - usageData.count,
    resetDate: new Date(usageData.resetDate),
    canMakeRequest: usageData.count < USAGE_LIMIT,
    usageLimit: USAGE_LIMIT
  };
};
