import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: number;
  tags?: string[] | null;
  coverImage?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  author,
  publishedAt,
  readTime,
  tags,
  coverImage,
}) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/article/${id}`)} className="overflow-hidden">
      {coverImage && (
        <div className="h-48 w-full overflow-hidden">
          <img src={coverImage} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>

        <div className="flex items-center gap-3 mb-4">
          {author.avatar ? (
            <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-gray-900">{author.name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
