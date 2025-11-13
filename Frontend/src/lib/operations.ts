import { gql } from "@apollo/client";


export const ARTICLE_FRAGMENT = gql`
    fragment ArticleFields on Article {
        id
        title
        content
        status
        writerId
        publishAt
    }
`;

export const WRITER_FRAGMENT = gql`
    fragment WriterFields on Writer {
        id
        name
        bio
        followersCount
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

export const GET_NOTIFICATIONS = gql`
    query notifications($recipientId: ID!){
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
    query getUnreadNotificationCount($recipientId: ID!){
        unreadNotificationCount(recipientId: $recipientId)
    }
`;

/* This is Mutations */
export const LOGINORSIGNUP = gql`
    mutation LogInOnSignUp($input: WriterInput!){
        logInOrSignUpWriter(input: $input){
            id
            name
            bio
            email
        }
    }
`