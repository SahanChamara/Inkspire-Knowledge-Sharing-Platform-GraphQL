import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { User, Calendar, Users, FileText, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../lib/auth';
import { articleService } from '../lib/articles';
import { followService } from '../lib/follows';
import { Profile as ProfileType, Article } from '../lib/supabase';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile: currentProfile, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');

  const isOwnProfile = currentProfile?.id === id;

  useEffect(() => {
    loadProfile();
  }, [id, currentProfile]);

  const loadProfile = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const profileData = await authService.getProfileById(id, currentProfile?.id);
      setProfile(profileData);

      if (profileData) {
        const articlesData = await articleService.getPublishedByWriter(id);
        setArticles(articlesData);

        // Use the isFollowedBy field from the profile data
        if (currentProfile && !isOwnProfile && profileData.isFollowedByMe !== undefined) {
          setIsFollowing(profileData.isFollowedByMe);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentProfile || !id) return;

    try {
      if (isFollowing) {
        await followService.unfollowWriter(currentProfile.id, id);
        setIsFollowing(false);
      } else {
        await followService.followWriter(currentProfile.id, id);
        setIsFollowing(true);
      }
      await loadProfile();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleEditProfile = () => {
    if (profile) {
      setEditName(profile.name);
      setEditBio(profile.bio);
      setEditModalOpen(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentProfile) return;

    try {
      await authService.updateProfile(currentProfile.id, {
        name: editName,
        bio: editBio,
      });
      await refreshProfile();
      await loadProfile();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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

  if (!profile) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="lg">
      <div className="mb-8">
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={48} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                  <p className="text-gray-600 mb-4">{profile.bio}</p>
                </div>
                {isOwnProfile ? (
                  <Button variant="secondary" size="sm" onClick={handleEditProfile}>
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : currentProfile ? (
                  <Button onClick={handleFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />
                  <span className="font-semibold text-gray-900">{profile.articleCount || 0}</span>
                  <span className="text-gray-600">Articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="font-semibold text-gray-900">{profile.followersCount || 0}</span>
                  <span className="text-gray-600">Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-gray-600">
                    Joined {new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Published Articles</h2>
      </div>

      {articles.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No published articles yet</h3>
          <p className="text-gray-600">
            {isOwnProfile ? 'Start writing and share your stories with the world' : 'This writer hasn\'t published any articles yet'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/article/${article.id}`)}
            >
              <div className="flex gap-4">
                {article.cover_image && (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt || articleService.generateExcerpt(article.content)}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>{new Date(article.published_at!).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{article.read_time} min read</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};
