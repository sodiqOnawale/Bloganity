import { BlogPost, Comment } from '../types';
import { DEFAULT_POSTS } from '../data/defaultPosts';

export const isSeedPost = (id: string): boolean => id.startsWith('seed-');

export const isSeedComment = (id: string): boolean => id.startsWith('seed-');

export const stripSeedPosts = (posts: BlogPost[]): BlogPost[] =>
  posts.filter((post) => !isSeedPost(post.id));

export const stripSeedComments = (comments: Comment[]): Comment[] =>
  comments.filter((comment) => !isSeedComment(comment.id));

export const getPublishedUserPosts = (userPosts: BlogPost[]): BlogPost[] =>
  userPosts.filter((post) => post.published);

export const buildCommunityPosts = (userPosts: BlogPost[]): BlogPost[] => {
  const userPostIds = new Set(userPosts.map((post) => post.id));
  const seedPosts = DEFAULT_POSTS.filter(
    (post) => post.published && !userPostIds.has(post.id)
  );

  return [...getPublishedUserPosts(userPosts), ...seedPosts];
};

export const findSeedPost = (id: string): BlogPost | undefined =>
  DEFAULT_POSTS.find((post) => post.id === id);
