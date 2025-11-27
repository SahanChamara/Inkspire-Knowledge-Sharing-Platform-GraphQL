import { apolloClient } from "./apllo";
import { ADD_ARTICLE, DELETE_ARTICLE, GET_ARTICLE_BY_ID, GET_ARTICLES, GET_ARTICLES_BY_WRITER, GET_DRAFT_BY_WRITER, GET_PUBLISHED_BY_WRITER, PUBLISHED_ARTICLE, UPDATEARTICLE } from "./operations";
import { Article } from "./types";

export const articleService = {
  async getPublishedArticles(status: string | null): Promise<Article[]> {
    const result  = await apolloClient.query<
    {articles: Article[]},
    {status: string | null}
    >({
      query: GET_ARTICLES,
      variables: {status},
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
    const result = await apolloClient.query<
    {articlesByWriter: Article[]},
    {writerId: string}
    >({
      query: GET_ARTICLES_BY_WRITER, 
      variables: {writerId: writerId},
      fetchPolicy: "network-only"
    });

    if(result.error){
      throw new Error(result.error.message);
    }

    return result.data?.articlesByWriter ?? []
  },

  async getDraftsByWriter(writerId: string): Promise<Article[]> {
    const result = await apolloClient.query<
    {draftsByWriter: Article[]},
    {writerId: string}
    >({
      query: GET_DRAFT_BY_WRITER,
      variables: {writerId: writerId},
      fetchPolicy: "network-only"
    });

    if(result.error){
      throw new Error(result.error.message);
    }

    return result.data?.draftsByWriter ?? [];
  },

  async getPublishedByWriter(writerId: string): Promise<Article[]> {
    const result = await apolloClient.query<
    {publishedByWriter: Article[]},
    {writerId: string}
    >({
      query: GET_PUBLISHED_BY_WRITER,
      variables: {writerId: writerId},
      fetchPolicy: "network-only"
    })

    if(result.error){
      throw new Error(result.error.message);
    }

    return result.data?.publishedByWriter ?? [];
  },

  async createArticle(input: {
    writerId: string,
    title: string,
    content: string,
    excerpt: string,
    coverImageUrl: string,
    tags: string[],
    status: string,
    readTime: number,
  }): Promise<Article> {
    const result = await apolloClient.mutate<
    {addArticle: Article},
    {input: {writerId: string; title: string; content: string; excerpt: string; coverImageUrl: string; tags: string[]; status: string; readTime: number}}
    >({
      mutation: ADD_ARTICLE,
      variables: {input}
    });

    if(result.error){
      throw new Error(result.error.message);
    }

    const article: Article | undefined = result.data?.addArticle;
    if(!article){
      throw new Error("Failed to Add Article");
    }

    return article;
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    const result = await apolloClient.mutate<
    {updateArticle: Article},
    {id: string; updates: Partial<Article>}
    >({
      mutation: UPDATEARTICLE,
      variables: {id, updates}
    });

    if(result.error){
      throw new Error(result.error.message)
    }

    const article: Article | undefined = result.data?.updateArticle;
    if(!article){
      throw new Error("Error Updating Article");
    }

    return article;
  },

  async publishArticle(id: string): Promise<Article> {
    const result = await apolloClient.mutate<
    {publishArticle: Article},
    {id: string}
    >({
      mutation: PUBLISHED_ARTICLE,
      variables: {id}
    });

    if(result.error){
      throw new Error(result.error.message);
    }

    const article: Article | undefined = result.data?.publishArticle;
    if(!article){
      throw new Error("Error Updating Article");
    }
    
    return article;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const result = await apolloClient.mutate<
    {deleteArticle: boolean},
    {id: string}
    >({
      mutation: DELETE_ARTICLE,
      variables: {id}
    });

    if(result.error){
      throw new Error(result.error.message);
    }

    return result.data?.deleteArticle ?? false;
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
