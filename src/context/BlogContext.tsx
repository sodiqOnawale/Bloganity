import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { BlogPost, Comment, BlogContextType, Bookmark } from '../types';
import { DEFAULT_COMMENTS } from '../data/defaultComments';
import {
  buildCommunityPosts,
  findSeedPost,
  getPublishedUserPosts,
  isSeedComment,
  isSeedPost,
  stripSeedComments,
  stripSeedPosts,
} from '../utils/seedPosts';

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const POSTS_STORAGE_KEY = 'bloganity_posts';
const COMMENTS_STORAGE_KEY = 'bloganity_comments';
const BOOKMARKS_STORAGE_KEY = 'bloganity_bookmarks';

const loadUserPosts = (): BlogPost[] => {
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
      return stripSeedPosts(JSON.parse(storedPosts) as BlogPost[]);
    }
  } catch (error) {
    console.error('Error parsing stored posts:', error);
  }
  return [];
};

const loadUserComments = (): Comment[] => {
  try {
    const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (storedComments) {
      return stripSeedComments(JSON.parse(storedComments) as Comment[]);
    }
  } catch (error) {
    console.error('Error parsing stored comments:', error);
  }
  return [];
};

// Helper function to calculate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>(loadUserPosts);
  const [comments, setComments] = useState<Comment[]>(loadUserComments);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) {
        return JSON.parse(storedBookmarks);
      }
    } catch (error) {
      console.error('Error parsing stored bookmarks:', error);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const userPosts = useMemo(() => getPublishedUserPosts(posts), [posts]);
  const communityPosts = useMemo(() => buildCommunityPosts(posts), [posts]);

  const addPost = (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'likedBy' | 'readingTime'>) => {
    const now = new Date().toISOString();
    const readingTime = calculateReadingTime(postData.content);
    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 0,
      likedBy: [],
      readingTime,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const updatePost = (id: string, postData: Partial<BlogPost>) => {
    if (isSeedPost(id)) return;

    setPosts((prev) => prev.map((post) => {
      if (post.id === id) {
        const updated = { ...post, ...postData, updatedAt: new Date().toISOString() };
        if (postData.content && postData.content !== post.content) {
          updated.readingTime = calculateReadingTime(postData.content);
        }
        return updated;
      }
      return post;
    }));
  };

  const deletePost = (id: string) => {
    if (isSeedPost(id)) return;

    setPosts((prev) => prev.filter((post) => post.id !== id));
    setComments((prev) => prev.filter((comment) => comment.postId !== id));
  };

  const getPost = (id: string): BlogPost | undefined => {
    return posts.find((post) => post.id === id) ?? findSeedPost(id);
  };

  const getPostsByAuthor = (authorId: string): BlogPost[] => {
    return posts.filter((post) => post.author.id === authorId);
  };

  const searchPosts = (query: string): BlogPost[] => {
    const lowerQuery = query.toLowerCase();
    return communityPosts.filter((post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const getPostsByCategory = (category: string): BlogPost[] => {
    return communityPosts.filter((post) => post.category === category);
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments((prev) => [...prev, newComment]);
  };

  const getComments = (postId: string): Comment[] => {
    const userComments = comments.filter((comment) => comment.postId === postId);

    if (isSeedPost(postId)) {
      const seedComments = DEFAULT_COMMENTS.filter((comment) => comment.postId === postId);
      return [...seedComments, ...userComments];
    }

    return userComments;
  };

  const likePost = (postId: string, userId: string) => {
    if (isSeedPost(postId)) return;

    setPosts((prev) => prev.map((post) => {
      if (post.id === postId && !post.likedBy?.includes(userId)) {
        return {
          ...post,
          likes: post.likes + 1,
          likedBy: [...(post.likedBy || []), userId],
        };
      }
      return post;
    }));
  };

  const unlikePost = (postId: string, userId: string) => {
    if (isSeedPost(postId)) return;

    setPosts((prev) => prev.map((post) => {
      if (post.id === postId && post.likedBy?.includes(userId)) {
        return {
          ...post,
          likes: Math.max(0, post.likes - 1),
          likedBy: post.likedBy.filter((id) => id !== userId),
        };
      }
      return post;
    }));
  };

  const incrementViews = (postId: string) => {
    if (isSeedPost(postId)) return;

    setPosts((prev) => prev.map((post) =>
      post.id === postId ? { ...post, views: post.views + 1 } : post
    ));
  };

  const bookmarkPost = (postId: string, userId: string) => {
    const existingBookmark = bookmarks.find(
      (bookmark) => bookmark.postId === postId && bookmark.userId === userId
    );
    if (!existingBookmark) {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        userId,
        postId,
        createdAt: new Date().toISOString(),
      };
      setBookmarks((prev) => [...prev, newBookmark]);
    }
  };

  const unbookmarkPost = (postId: string, userId: string) => {
    setBookmarks((prev) => prev.filter(
      (bookmark) => !(bookmark.postId === postId && bookmark.userId === userId)
    ));
  };

  const isBookmarked = (postId: string, userId: string): boolean => {
    return bookmarks.some((bookmark) => bookmark.postId === postId && bookmark.userId === userId);
  };

  const getBookmarkedPosts = (userId: string): BlogPost[] => {
    const bookmarkedPostIds = bookmarks
      .filter((bookmark) => bookmark.userId === userId)
      .map((bookmark) => bookmark.postId);

    return bookmarkedPostIds
      .map((postId) => getPost(postId))
      .filter((post): post is BlogPost => Boolean(post));
  };

  const likeComment = (commentId: string) => {
    if (isSeedComment(commentId)) return;

    setComments((prev) => prev.map((comment) =>
      comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
    ));
  };

  const deleteComment = (commentId: string) => {
    if (isSeedComment(commentId)) return;

    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  return (
    <BlogContext.Provider value={{
      posts: communityPosts,
      userPosts,
      communityPosts,
      allPosts: posts,
      addPost,
      updatePost,
      deletePost,
      getPost,
      getPostsByAuthor,
      searchPosts,
      getPostsByCategory,
      addComment,
      getComments,
      likePost,
      unlikePost,
      incrementViews,
      bookmarkPost,
      unbookmarkPost,
      isBookmarked,
      getBookmarkedPosts,
      likeComment,
      deleteComment,
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
