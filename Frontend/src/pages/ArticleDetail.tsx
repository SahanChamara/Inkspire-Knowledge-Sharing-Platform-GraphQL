import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { User, Calendar, Clock, Bookmark, Share2, ThumbsUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { articleService } from '../lib/articles';
import { followService } from '../lib/follows';
import { ArticleWithWriter } from '../lib/supabase';
import { Article } from '../lib/types';
import { authService } from '../lib/auth';

export const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadArticle();
    }
  }, [id, profile]);

  const loadArticle = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const articleData = await articleService.getArticleById(id);
      if (!articleData || articleData.status !== 'PUBLISHED') {
        setArticle(null);
        return;
      }

      setArticle(articleData);

      // Check if writer has isFollowedBy information (requires fetching writer separately with meId)
      if (profile && articleData.writerId && articleData.writerId !== profile.id) {
        const writerData = await authService.getProfileById(articleData.writerId, profile.id);
        if (writerData?.isFollowedByMe !== undefined) {
          setIsFollowing(writerData.isFollowedByMe);
        }
        // Update article with full writer data including follower counts
        if (writerData) {
          setArticle({ ...articleData, writer: writerData });
        }
      }

      const allArticles = await articleService.getPublishedArticles("PUBLISHED");
      const related = allArticles
        .filter((a) => a.id !== id && a.tags && articleData.tags && a.tags.some((tag) => articleData.tags?.includes(tag)))
        .slice(0, 2);
      setRelatedArticles(related);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile || !article) return;

    try {
      if (isFollowing) {
        await followService.unfollowWriter(profile.id, article.writerId);
        setIsFollowing(false);
      } else {
        await followService.followWriter(profile.id, article.writerId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
        </div>
      </PageLayout>
    );
  }

  if (!article) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </PageLayout>
    );
  }

  const isOwnArticle = profile?.id === article.writerId;

  return (
    <PageLayout maxWidth="lg">
      <article className="mb-12">
        {article.coverImageUrl && (
          <div className="w-full h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags && article.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-6">{article.title}</h1>

        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
          <div
            className="flex items-center gap-4 cursor-pointer hover:opacity-80"
            onClick={() => navigate(`/profile/${article.writerId}`)}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{article.writer?.name}</p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(article.publishedAt!).toLocaleDateString()}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark size={18} className={bookmarked ? 'fill-teal-600 text-teal-600' : ''} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 size={18} />
            </Button>
          </div>
        </div>

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
        </div>
      </article>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="p-6 lg:col-span-1">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
          <div className="flex flex-col items-center text-center">
            <div
              className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:opacity-80"
              onClick={() => navigate(`/profile/${article.writerId}`)}
            >
              <User size={32} className="text-white" />
            </div>
            <h4
              className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-teal-600"
              onClick={() => navigate(`/profile/${article.writerId}`)}
            >
              {article.writer?.name || 'Unknown'}
            </h4>
            <p className="text-sm text-gray-600 mb-4">{article.writer?.bio || 'No bio available'}</p>
            <div className="flex gap-6 mb-4 text-sm">
              <div className="text-center">
                <p className="font-bold text-gray-900">{article.writer?.followersCount}</p>
                <p className="text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">{article.writer?.articleCount}</p>
                <p className="text-gray-600">Articles</p>
              </div>
            </div>
            {!isOwnArticle && profile && (
              <Button size="sm" className="w-full" onClick={handleFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
            {!profile && (
              <Button size="sm" className="w-full" onClick={() => navigate('/login')}>
                Follow
              </Button>
            )}
          </div>
        </Card>

        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          {relatedArticles.length === 0 ? (
            <p className="text-gray-600">No related articles found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} onClick={() => navigate(`/article/${relatedArticle.id}`)}>
                  {relatedArticle.coverImageUrl && (
                    <img
                      src={relatedArticle.coverImageUrl}
                      alt={relatedArticle.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{relatedArticle.writer.name}</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{relatedArticle.readTime} min</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
