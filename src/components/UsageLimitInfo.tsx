import React from 'react';
import { useUsageLimit } from '../services/usageLimitService';
import { AlertCircle, Clock } from 'lucide-react';

interface UsageLimitInfoProps {
  className?: string;
}

const UsageLimitInfo: React.FC<UsageLimitInfoProps> = ({ className = '' }) => {
  const { remainingUsage, resetDate, usageLimit } = useUsageLimit();
  
  // Format the reset time
  const formatResetTime = () => {
    const hours = resetDate.getHours().toString().padStart(2, '0');
    const minutes = resetDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // Format the reset date
  const formatResetDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (resetDate.getDate() === today.getDate() && 
        resetDate.getMonth() === today.getMonth() && 
        resetDate.getFullYear() === today.getFullYear()) {
      return 'today';
    } else if (resetDate.getDate() === tomorrow.getDate() && 
               resetDate.getMonth() === tomorrow.getMonth() && 
               resetDate.getFullYear() === tomorrow.getFullYear()) {
      return 'tomorrow';
    } else {
      return resetDate.toLocaleDateString();
    }
  };
  
  return (
    <div className={`text-sm ${className}`}>
      <div className="flex items-center">
        <Clock size={16} className="mr-1 text-deep-blue-500 dark:text-deep-blue-400" />
        <span className="text-gray-600 dark:text-gray-300">
          {remainingUsage === 0 ? (
            <span className="text-red-600 dark:text-red-400 font-medium flex items-center">
              <AlertCircle size={16} className="mr-1" />
              Daily limit reached
            </span>
          ) : (
            <span>
              <span className="font-medium">{remainingUsage}</span> of <span className="font-medium">{usageLimit}</span> analyses remaining today
            </span>
          )}
        </span>
      </div>
      
      {remainingUsage === 0 && (
        <div className="mt-1 text-gray-500 dark:text-gray-400">
          Resets at midnight {formatResetDate()}
        </div>
      )}
    </div>
  );
};

export default UsageLimitInfo;
