export type Article = {
    id: string;
    title: string;
    content: string;
    status: string;
    writerId: string;
    publishedAt: string;
}


export type Writer = {
    id: number;
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