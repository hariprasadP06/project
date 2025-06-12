import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { memoryService } from '../services/memoryService';

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export default function SearchResults({ query, onClose }: SearchResultsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => memoryService.searchMemories(query),
    enabled: !!query,
    staleTime: 30000,
  });

  return (
    <div className="mb-8">
      <div className="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-600 dark:border-gray-600 overflow-hidden">
        {/* Compact Header */}
        <div className="px-6 py-4 border-b border-gray-600 dark:border-gray-600 bg-gray-700 dark:bg-gray-750">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white dark:text-white">
                Search Results
              </h3>
              <p className="text-sm text-gray-300 dark:text-gray-300">
                Query: "{query}"
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-600 dark:hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Close search results"
            >
              <X className="h-5 w-5 text-gray-300 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-300 dark:text-gray-300 font-medium">
                  Searching your memories...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="p-6 bg-red-900/30 dark:bg-red-900/20 rounded-xl border border-red-700 dark:border-red-800">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-red-300 dark:text-red-300 mb-2">
                  Search Error
                </h4>
                <p className="text-red-400 dark:text-red-400">
                  Unable to search memories. Please try again.
                </p>
              </div>
            </div>
          ) : data ? (
            <div className="bg-gray-700 dark:bg-gray-700 rounded-xl p-6 border border-gray-600 dark:border-gray-600">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {data.answer.split('\n').map((line, index) => {
                  if (!line.trim()) return <br key={index} />;
                  
                  // Handle different line types based on content
                  if (line.startsWith('✅') || line.startsWith('❌')) {
                    return (
                      <div key={index} className="flex items-start space-x-3 mb-4">
                        <span className="text-2xl flex-shrink-0 mt-1">
                          {line.charAt(0)}
                        </span>
                        <div>
                          <h4 className="text-lg font-semibold text-white dark:text-white mb-2">
                            {line.substring(2).trim()}
                          </h4>
                        </div>
                      </div>
                    );
                  }
                  
                  if (line.startsWith('📝') || line.startsWith('📚') || line.startsWith('💡')) {
                    return (
                      <div key={index} className="flex items-start space-x-3 mb-3">
                        <span className="text-xl flex-shrink-0 mt-1">
                          {line.substring(0, 2)}
                        </span>
                        <p className="text-gray-200 dark:text-gray-200 leading-relaxed">
                          {line.substring(2).trim()}
                        </p>
                      </div>
                    );
                  }
                  
                  // Regular text lines
                  return (
                    <p key={index} className="text-gray-200 dark:text-gray-200 leading-relaxed mb-3">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}