// import { supabase, Article, ArticleWithWriter } from './supabase';

import { apolloClient } from "./apllo";
import { GET_ARTICLE_BY_ID, GET_ARTICLES, GET_PUBLISHED_BY_WRITER } from "./operations";
import { Article } from "./types";

export const articleService = {
  async getPublishedArticles(status: string): Promise<Article[]> {
    const result  = await apolloClient.query<
    {articles: Article[]},
    {status: string}
    >({
      query: GET_ARTICLES,
      variables: {status: status},
      fetchPolicy: "network-only",
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data?.articles ?? [];
  },

  async getArticleById(id: string): Promise<Article | null> {
    const result = await apolloClient.query<
    {articleById: Article},
    {id: string}
    >({
      query: GET_ARTICLE_BY_ID,
      variables: {id:id},
      fetchPolicy: "network-only"
    });

    if(result.error){
      throw new Error(result.error.message);
    }

    return result.data?.articleById ?? null;
  },

  async getArticlesByWriter(writerId: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('writer_id', writerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDraftsByWriter(writerId: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('writer_id', writerId)
      .eq('status', 'DRAFT')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPublishedByWriter(writerId: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('writer_id', writerId)
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createArticle(article: {
    writer_id: string;
    title: string;
    content: string;
    excerpt?: string;
    cover_image?: string;
    tags?: string[];
    read_time?: number;
  }): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async publishArticle(id: string): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .update({
        status: 'PUBLISHED',
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteArticle(id: string): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).filter(Boolean).length;
    return Math.ceil(words / wordsPerMinute) || 1;
  },

  generateExcerpt(content: string, maxLength: number = 200): string {
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength).trim() + '...';
  },
};
