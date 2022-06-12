import { gql } from '@apollo/client';

export const GET_ALL_VOTES_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getVotesByPostId(post_id: $post_id) {
      id
      post_id
      upvote
      username
      created_at
    }
  }
`
export const GET_SUBREDDITS_WITH_LIMIT = gql`
  query MyQuery($limit: Int!) {
    getSubredditListWithLimit(limit: $limit) {
      id
      topic
      created_at
    }
  }
`

export const GET_SUBREDDITS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`

export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      created_at
      id
      image
      title
      username
      comments {
        created_at
        id
        post_id
        text
        username
      }
      subreddit_id
      subreddit {
        created_at
        id
        topic
      }
      votes {
        created_at
        id
        upvote
        username
        post_id
      }
    }
  }
`

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      comments {
        created_at
        id
        text
        post_id
        username
      }
      created_at
      image
      id
      subreddit {
        created_at
        id
        topic
      }
      subreddit_id
      title
      username
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`

export const GET_POST_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getPostListByPostId(post_id: $post_id) {
      body
      comments {
        created_at
        id
        text
        post_id
        username
      }
      created_at
      image
      id
      subreddit {
        created_at
        id
        topic
      }
      subreddit_id
      title
      username
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`