import React from 'react';
import { Filter, TrendingUp, Clock } from 'lucide-react';

interface FeedFilterProps {
  selectedTag: string;
  onTagChange: (tag: string) => void;
  sortBy: 'newest' | 'trending';
  onSortChange: (sort: 'newest' | 'trending') => void;
  tags: string[];
}

export const FeedFilter: React.FC<FeedFilterProps> = ({
  selectedTag,
  onTagChange,
  sortBy,
  onSortChange,
  tags,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Filter size={16} />
            Filter by Tag
          </label>
          <select
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <div className="flex gap-2">
            <button
              onClick={() => onSortChange('newest')}
              className={`flex-1 px-4 py-2 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                sortBy === 'newest'
                  ? 'bg-teal-50 border-teal-600 text-teal-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clock size={16} />
              Newest
            </button>
            <button
              onClick={() => onSortChange('trending')}
              className={`flex-1 px-4 py-2 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                sortBy === 'trending'
                  ? 'bg-teal-50 border-teal-600 text-teal-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TrendingUp size={16} />
              Trending
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
