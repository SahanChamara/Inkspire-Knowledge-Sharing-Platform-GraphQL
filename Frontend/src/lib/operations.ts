import { gql } from "@apollo/client";


export const ARTICLE_FRAGMENT = gql`
    fragment ArticleFields on Article {
        id
        title
        content
        status
        writerId
        publishedAt
        excerpt
        coverImageUrl
        tags
        readTime
    }
`;

export const WRITER_FRAGMENT = gql`
    fragment WriterFields on Writer {
        id
        name
        bio
        email
        password
        followersCount
        avatarUrl
        articleCount
        isFollowedBy(meId: $ME_ID)
        articles {...ArticleFields}
    }
    ${ARTICLE_FRAGMENT}
`;

/* This is Queries */
export const GET_WRITERS = gql`
    query GetWriters($meId: ID){
        getWriters {
            id
            name
            bio
            followersCount
            articles {
                ...ArticleFields
            }
        }
    }
    ${ARTICLE_FRAGMENT}
`;

export const GET_WRITER = gql`
    query Getwriter($id : ID!, $meId: ID){
        getWriterById(id: $id){
            id
            name
            bio
            followersCount
            articles {
                ...ArticleFields
            }
        }
    }
    ${ARTICLE_FRAGMENT}
`;

export const GET_ARTICLES = gql`
    query GetArticles($status: String){
        articles(status: $status){
            ...ArticleFields
        }
    }
    ${ARTICLE_FRAGMENT}
`;

export const GET_ARTICLE_BY_ID = gql`
    query GetArticleById($id: ID!){
        articleById(id: $id){
            id
            title
            content
            status
            writerId
            publishAt
            excerpt
            coverImageUrl
            tags
            readTime
        }
    }
`

export const GET_ARTICLES_BY_WRITER = gql`
    query GetArticlesByWriter($writerId: ID!){
        articlesByWriter(writerId: $writerId){
            ...ArticleFields
        }
    }
    ${ARTICLE_FRAGMENT}
`

export const GET_DRAFT_BY_WRITER = gql`
    query GetDraftByWriter($writerId: ID!){
        draftsByWriter(writerId: $writerId){
            ...ArticleFields
        }
    }
    ${ARTICLE_FRAGMENT}
`

export const GET_PUBLISHED_BY_WRITER = gql`
    query GetPublishedByWriter($writerId: ID!){
        publishedByWriter(writerId: $writerId){
            ...ArticleFields
        }
    }
    ${ARTICLE_FRAGMENT}
`

export const GET_NOTIFICATIONS = gql`
    query Notifications($recipientId: ID!){
        notifications(recipientId: $recipientId){
            id
            recipientId 
            actorId 
            articleId
            type 
            payload 
            readFlag 
            createdAt
        }
    }
`;

export const GET_UNREAD_NOTIFICATION_COUNT = gql`
    query GetUnreadNotificationCount($recipientId: ID!){
        unreadNotificationCount(recipientId: $recipientId)
    }
`;

/* This is Mutations */
export const LOGINORSIGNUP = gql`
    mutation LogInOrSignUp($input: WriterInput!){
        logInOrSignUpWriter(input: $input){
            id
            email
            password
            name
            bio
        }
    }
`;

export const ADD_ARTICLE = gql`
    mutation AddArticle($input: ArticleInput!){
        addArticle(input: $input){
            ...ArticleFields
        }
    }
    ${ARTICLE_FRAGMENT}
`;

export const UPDATEWRITER = gql`
    mutation UpdateWriter($id: ID!, $input: WriterInput!){
        updateWriter(id: $id, input: $input){
            ...WriterFields
        }
    }
    ${WRITER_FRAGMENT}
`

export const UPDATEARTICLE = gql`
    mutation UpdateArticle($id: ID!, $input: ArticleInput!){
        updateArticle(id: $id, input: $input){
            ...ArticleFields
        }
    }
    ${ARTICLE_FRAGMENT}
`

export const PUBLISHED_ARTICLE = gql`
    mutation PublishedArticle($id: ID!){
        publishArticle(id: $id){
            ...ArticleFields
        }
    }
    ${ARTICLE_FRAGMENT}
`;

export const FOLLOW_WRITER = gql`
    mutation FollowWriter($targetId: ID!, $followerId: ID!){
        followWriter(targetId: $targetId, followerId: $followerId)
    }
`;

export const UNFOLLOW_WRITER = gql`
    mutation UnFollowWriter($targetId: ID!, $followerId: ID!){
        unfollowWriter(targetId: $targetId, followerId: $followerId)
    }
`;

export const MARK_NOTIFICATION_READ = gql`
    mutation MarkNotificationRead($notificationId: ID!){
        markNotificationRead(notificationId: $notificationId)
    }
`;

/* This is Subscriptions */
export const ARTICLE_PUBLISHED_SUB = gql`
    subscription ArticlePublished {
        articlePublished {
            ...ArticleFields
        }
    }
    ${ARTICLE_FRAGMENT}
`;

export const NOTIFICATION_ADDEDD_SUB = gql`
    subscription NotificationAdded($recipientId : ID!){
        notificationAdded(recipientId: $recipientId){
            id
            recipientId
            actorId
            articleId
            type
            payload
            readFlag
            createdAt
        }
    }
`;
