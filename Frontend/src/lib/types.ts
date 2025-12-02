export type Article = {
    id: string;
    title: string;
    content: string;
    status: string;
    writerId: string;
    publishedAt: string;
    excerpt: string;
    coverImageUrl: string;
    tags: string[];
    readTime: number;
}


export type Writer = {
    id: string;
    name: string;
    bio: string;
    email: string;
    password: string;
    avatarUrl: string | null;
    followersCount: number;
    articleCount: number;
    isFollowedByMe: boolean;
    articles: Article[];   
}

export type Follow = {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: string;
}

export type Notification = {
    id: string;
    recipientId: string;
    actorId: string | null;
    articleId: string | null;
    type: string;
    payload: string;
    readFlag: boolean;
    createdAt: string;
}

export type AricleNotificationPayload = {
    articleId: string;
    title: string;
    writerId: string;
    publishedAt: string
}