import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Tabs } from '../components/layout/Tabs';
import { DraftCard } from '../components/dashboard/DraftCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FileText, CheckCircle, User, BarChart3, PenSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { articleService } from '../lib/articles';
import { Article } from '../lib/types';
// import { Article } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('drafts');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [published, setPublished] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      loadArticles();
    }
  }, [profile]);

  const loadArticles = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const [draftsData, publishedData] = await Promise.all([
        articleService.getDraftsByWriter(profile.id),
        articleService.getPublishedByWriter(profile.id),
      ]);
      setDrafts(draftsData);
      setPublished(publishedData);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };


  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'drafts', label: 'Drafts', icon: <FileText size={18} />, count: drafts.length },
    { id: 'published', label: 'Published', icon: <CheckCircle size={18} />, count: published.length },
    { id: 'stats', label: 'Stats', icon: <BarChart3 size={18} /> },
  ];

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await articleService.deleteArticle(deleteId);
      await loadArticles();
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your articles and track your progress</p>
        </div>
        <Button onClick={() => navigate('/editor')}>
          <PenSquare size={18} className="mr-2" />
          New Article
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === 'profile' && profile && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User size={48} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                      <p className="text-gray-600 mb-4">{profile.bio}</p>
                      <Button size="sm" onClick={() => navigate(`/profile/${profile.id}`)}>View Public Profile</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{profile.articleCount}</p>
                      <p className="text-gray-600 mt-1">Articles</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{profile.followersCount}</p>
                      <p className="text-gray-600 mt-1">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{drafts.length}</p>
                      <p className="text-gray-600 mt-1">Drafts</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'drafts' && (
              <div className="space-y-4">
                {drafts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No drafts yet</h3>
                    <p className="text-gray-600 mb-4">Start writing your first article</p>
                    <Button onClick={() => navigate('/editor')}>Create Article</Button>
                  </div>
                ) : (
                  drafts.map((draft) => (
                    <DraftCard
                      key={draft.id}
                      id={draft.id}
                      title={draft.title}
                      excerpt={draft.excerpt || articleService.generateExcerpt(draft.content)}
                      lastEdited={draft.updatedAt}
                      status="DRAFT"
                      tags={draft.tags}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'published' && (
              <div className="space-y-4">
                {published.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No published articles</h3>
                    <p className="text-gray-600">Your published articles will appear here</p>
                  </div>
                ) : (
                  published.map((article) => (
                    <DraftCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      excerpt={article.excerpt || articleService.generateExcerpt(article.content)}
                      lastEdited={article.updatedAt}
                      status="PUBLISHED"
                      tags={article.tags}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Views</h3>
              <p className="text-3xl font-bold text-gray-900">12,345</p>
              <p className="text-sm text-green-600 mt-2">+12% this month</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Followers</h3>
              <p className="text-3xl font-bold text-gray-900">1,234</p>
              <p className="text-sm text-green-600 mt-2">+8% this month</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Articles</h3>
              <p className="text-3xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-500 mt-2">3 published this month</p>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Article"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete this article? This action cannot be undone.
        </p>
      </Modal>
    </PageLayout>
  );
};
