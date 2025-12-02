import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { ArticleCard } from '../components/article/ArticleCard';
import { FeedFilter } from '../components/article/FeedFilter';
import { ArticleCardSkeleton } from '../components/ui/Skeleton';
import { Sparkles } from 'lucide-react';
import { articleService } from '../lib/articles';
// import { ArticleWithWriter } from '../lib/supabase';
import { Article, Writer } from '../lib/types';
import { authService } from '../lib/auth';

export const Home: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'trending'>('newest');
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [writer, setWriter] = useState<Writer>();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await articleService.getPublishedArticles("PUBLISHED");
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWriterById = async (id: string) => {
    try {
      const data = await authService.getProfileById(id);
      setWriter(data);
    } catch (error) {
      console.error("Error fetching Writer", error);
    }
  }

  const allTags = Array.from(new Set(articles.flatMap((article) => article.tags)));

  const filteredArticles = selectedTag
    ? articles.filter((article) => article.tags.includes(selectedTag))
    : articles;

  return (
    <PageLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-teal-600" size={32} />
          <h1 className="text-4xl font-bold text-gray-900">Discover Stories</h1>
        </div>
        <p className="text-lg text-gray-600">
          Explore insights from writers around the world
        </p>
      </div>

      <FeedFilter
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        sortBy={sortBy}
        onSortChange={setSortBy}
        tags={allTags}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <>
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </>
        ) : filteredArticles.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Sparkles size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600">Check back soon for amazing stories from writers</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              excerpt={article.excerpt || articleService.generateExcerpt(article.content)}
              author={{ id: article.profile.id, name: article.profiles.name }}
              publishedAt={article.publishedAt!}
              readTime={article.readTime}
              tags={article.tags}
              coverImage={article.coverImageUrl || undefined}
            />
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <button className="px-6 py-3 text-teal-600 hover:text-teal-700 font-medium">
          Load More Articles
        </button>
      </div>
    </PageLayout>
  );
};
