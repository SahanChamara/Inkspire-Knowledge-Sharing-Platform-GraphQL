import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { RichTextEditor } from '../components/editor/RichTextEditor';
import { Save, Eye, Send, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { articleService } from '../lib/articles';

export const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImageUrl, setCoverImage] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      const article = await articleService.getArticleById(articleId);
      if (article && article.writerId === profile?.id) {
        setTitle(article.title);
        setContent(article.content);
        setTags(article.tags);
        setCoverImage(article.coverImageUrl || '');
        setArticleId(article.id);
        setStatus(article.status);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        handleAutoSave();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [title, content]);

  const handleAutoSave = async () => {
    if (!profile || !title.trim() || !articleId) return;

    setSaving(true);
    try {
      const readTime = articleService.calculateReadTime(content);
      const excerpt = articleService.generateExcerpt(content);

      // Only update existing articles, don't create new ones on auto-save
      await articleService.updateArticle(articleId, {
        title,
        content,
        excerpt,
        coverImageUrl,
        tags,
        status: status || 'DRAFT',
        readTime: readTime,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setSaving(false);
    }
  };

  console.log("cover image", coverImageUrl);
  

  const handleSaveDraft = async () => {
    if (!profile || !title.trim()) {
      alert('Please enter a title for your article');
      return;
    }

    setSaving(true);
    try {
      const readTime = articleService.calculateReadTime(content);
      const excerpt = articleService.generateExcerpt(content);

      if (articleId) {
        await articleService.updateArticle(articleId, {
          writerId: profile.id,
          title,
          content,
          excerpt,
          coverImageUrl,
          status: "DRAFT",
          tags,
          readTime: readTime,
        });
      } else {
        const newArticle = await articleService.createArticle({
          writerId: profile.id,
          title,
          content,
          excerpt,
          coverImageUrl,
          status: "DRAFT",
          tags,
          readTime: readTime,
        });
        setArticleId(newArticle.id);
        setStatus(newArticle.status || 'DRAFT');
      }
      setLastSaved(new Date());
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter a title and content for your article');
      return;
    }
    setPublishModalOpen(true);
  };

  const confirmPublish = async () => {
    if (!profile) return;

    setPublishing(true);
    try {
      const readTime = articleService.calculateReadTime(content);
      const excerpt = articleService.generateExcerpt(content);

      if (articleId) {
        // Update existing article to DRAFT first to save latest changes
        await articleService.updateArticle(articleId, {
          writerId: profile.id,
          title,
          content,
          excerpt,
          coverImageUrl,
          tags,
          status: "DRAFT",
          readTime: readTime,
        });
        // Then publish it
        await articleService.publishArticle(articleId);
      } else {
        // Create article as DRAFT first
        const newArticle = await articleService.createArticle({
          writerId: profile.id,
          title,
          content,
          excerpt,
          coverImageUrl,
          tags,
          status: "DRAFT",
          readTime: readTime,
        });
        // Then publish the article
        await articleService.publishArticle(newArticle.id);
        setStatus('PUBLISHED');
      }

      // Note: Followers notification is already handled in the backend's publishArticle method
      setPublishModalOpen(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Failed to publish article');
    } finally {
      setPublishing(false);
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <PageLayout maxWidth="lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Edit Article' : 'New Article'}
            </h1>
            {lastSaved && (
              <span className="text-sm text-gray-500">
                {saving ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString()}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
              <Eye size={18} className="mr-2" />
              Preview
            </Button>
            <Button variant="ghost" onClick={handleSaveDraft} disabled={saving}>
              <Save size={18} className="mr-2" />
              Save Draft
            </Button>
            <Button onClick={handlePublish} disabled={publishing}>
              <Send size={18} className="mr-2" />
              {publishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Input
            label="Article Title"
            placeholder="Enter a compelling title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon size={16} className="inline mr-2" />
                  Cover Image URL
                </label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
                {coverImageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img src={coverImageUrl} alt="Cover preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-teal-900">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Word Count:</span>
                    <span className="font-medium">{content.split(/\s+/).filter(Boolean).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Read Time:</span>
                    <span className="font-medium">
                      {Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Article Preview"
      >
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{title || 'Untitled Article'}</h1>
          {coverImageUrl && (
            <img src={coverImageUrl} alt="Cover" className="w-full h-64 object-cover rounded-lg" />
          )}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title="Publish Article"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPublishModalOpen(false)} disabled={publishing}>
              Cancel
            </Button>
            <Button onClick={confirmPublish} disabled={publishing}>
              {publishing ? 'Publishing...' : 'Publish Now'}
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Your article will be published immediately and your followers will be notified.
        </p>
      </Modal>
    </PageLayout>
  );
};
