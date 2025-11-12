import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface DraftCardProps {
  id: string;
  title: string;
  excerpt: string;
  lastEdited: string;
  status: 'DRAFT' | 'PUBLISHED' | 'REVIEW';
  tags: string[];
  onDelete: (id: string) => void;
}

export const DraftCard: React.FC<DraftCardProps> = ({
  id,
  title,
  excerpt,
  lastEdited,
  status,
  tags,
  onDelete,
}) => {
  const navigate = useNavigate();

  const statusVariants = {
    DRAFT: 'default',
    PUBLISHED: 'success',
    REVIEW: 'warning',
  } as const;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title || 'Untitled Draft'}</h3>
          <p className="text-gray-600 line-clamp-2 mb-3">{excerpt || 'Start writing your article...'}</p>
        </div>
        <Badge variant={statusVariants[status]}>{status}</Badge>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} />
          <span>Last edited {new Date(lastEdited).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            <Trash2 size={16} />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/editor/${id}`)}
          >
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};
