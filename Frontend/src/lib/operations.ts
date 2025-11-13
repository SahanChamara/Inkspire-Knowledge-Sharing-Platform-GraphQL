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
    query Get_writer($id : ID!, $meId: ID){
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
`

