import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Memory, memoryService } from '../services/memoryService';
import EditMemoryModal from './EditMemoryModal';
import { toast } from './ui/Toaster';

interface MemoryCardProps {
  memory: Memory;
  viewMode: 'grid' | 'list';
  onUpdate: () => void;
}

export default function MemoryCard({ memory, viewMode, onUpdate }: MemoryCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    
    setIsDeleting(true);
    try {
      await memoryService.deleteMemory(memory.id);
      toast.success('Memory deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete memory');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditComplete = () => {
    setShowEditModal(false);
    onUpdate();
  };

  if (viewMode === 'list') {
    return (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                {memory.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {memory.content}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDistanceToNow(memory.createdAt, { addSuffix: true })}
                </div>
                
                {memory.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <div className="flex gap-1">
                      {memory.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {memory.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{memory.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <EditMemoryModal
          memory={memory}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={handleEditComplete}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {memory.title}
          </h3>
          
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={handleEdit}
              className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {memory.content}
        </p>
        
        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {memory.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-md"
              >
                {tag}
              </span>
            ))}
            {memory.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{memory.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDistanceToNow(memory.createdAt, { addSuffix: true })}
        </div>
      </div>
      
      <EditMemoryModal
        memory={memory}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdated={handleEditComplete}
      />
    </>
  );
}