import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, RefreshCw, Archive, Grid, List, Filter, Search, Brain, Sparkles } from 'lucide-react';
import { memoryService, Memory } from '../services/memoryService';
import SearchBar from '../components/SearchBar';
import MemoryCard from '../components/MemoryCard';
import AddMemoryModal from '../components/AddMemoryModal';
import SearchResults from '../components/SearchResults';
import EmptyState from '../components/EmptyState';

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showStoredMemories, setShowStoredMemories] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: memories = [], refetch, isLoading, isFetching } = useQuery({
    queryKey: ['memories'],
    queryFn: () => memoryService.getMemories(),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query.trim());
    setIsSearching(!!query.trim());
    if (query.trim()) {
      setShowStoredMemories(false); // Hide stored memories when searching
    }
  };

  const handleMemoryAdded = async () => {
    await refetch();
    setShowAddModal(false);
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleToggleStoredMemories = () => {
    setShowStoredMemories(!showStoredMemories);
    if (!showStoredMemories) {
      setIsSearching(false); // Close search when showing memories
      setSearchQuery('');
    }
  };

  const filteredMemories = memories.filter(memory =>
    searchQuery === '' || 
    memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Second Brain
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {memories.length} memories stored
                </p>
                {isFetching && (
                  <div className="flex items-center text-sm text-gray-500">
                    <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                    Syncing...
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleStoredMemories}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showStoredMemories
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Archive className="h-5 w-5 mr-2" />
                {showStoredMemories ? 'Hide' : 'View'} Stored Memories
                {memories.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                    {memories.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Memory
              </button>
            </div>
          </div>

          {/* Integrated Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Search Results */}
          {isSearching && searchQuery && (
            <SearchResults query={searchQuery} onClose={handleCloseSearch} />
          )}

          {/* Stored Memories Section */}
          {showStoredMemories && !isSearching && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Memories Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <Archive className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Stored Memories
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                        Your personal knowledge collection
                      </p>
                    </div>
                  </div>
                  
                  {memories.length > 0 && (
                    <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-l-lg transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-r-lg transition-colors ${
                          viewMode === 'list'
                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Memories Content */}
              <div className="p-6">
                {filteredMemories.length === 0 ? (
                  <EmptyState onAddMemory={() => setShowAddModal(true)} />
                ) : (
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredMemories.map((memory) => (
                      <div key={memory.id}>
                        <MemoryCard
                          memory={memory}
                          viewMode={viewMode}
                          onUpdate={refetch}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Welcome State - Show when no search and no stored memories view */}
          {!isSearching && !showStoredMemories && (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <Brain className="h-32 w-32 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <div className="w-40 h-40 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl"></div>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Your Second Brain
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Use the search bar above to ask questions about your stored knowledge, or view your memories to browse your collection.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Search className="h-5 w-5 mr-2" />
                  <span>Search your memories with natural language</span>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Sparkles className="h-5 w-5 mr-2" />
                  <span>Get AI-powered insights from your knowledge</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Memory Modal */}
        <AddMemoryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onMemoryAdded={handleMemoryAdded}
        />
      </div>
    </div>
  );
}