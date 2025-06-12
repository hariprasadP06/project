import React from 'react';
import { Brain } from 'lucide-react';

interface EmptyStateProps {
  onAddMemory: () => void;
}

export default function EmptyState({ onAddMemory }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="relative mb-8">
        <Brain className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-2xl"></div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Your Second Brain is Empty
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Start building your personal knowledge base by adding your first memory. 
        Store ideas, notes, links, and insights that matter to you.
      </p>
    </div>
  );
}