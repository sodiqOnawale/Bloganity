import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BlogPost, Comment, BlogContextType, Bookmark } from '../types';

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const POSTS_STORAGE_KEY = 'bloganity_posts';
const COMMENTS_STORAGE_KEY = 'bloganity_comments';
const BOOKMARKS_STORAGE_KEY = 'bloganity_bookmarks';

// Helper function to calculate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage synchronously to ensure data is available immediately
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
      if (storedPosts) {
        return JSON.parse(storedPosts);
      }
    } catch (error) {
      console.error('Error parsing stored posts:', error);
    }
    return [];
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (storedComments) {
        return JSON.parse(storedComments);
      }
    } catch (error) {
      console.error('Error parsing stored comments:', error);
    }
    return [];
  });

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

  // This useEffect is no longer needed since we initialize state synchronously
  // But keeping it commented for reference
  // useEffect(() => {
  //   // State is now initialized synchronously, so this is not needed
  // }, []);

  useEffect(() => {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

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
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (id: string, postData: Partial<BlogPost>) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        const updated = { ...post, ...postData, updatedAt: new Date().toISOString() };
        // Recalculate reading time if content changed
        if (postData.content && postData.content !== post.content) {
          updated.readingTime = calculateReadingTime(postData.content);
        }
        return updated;
      }
      return post;
    }));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    setComments(prev => prev.filter(comment => comment.postId !== id));
  };

  const getPost = (id: string): BlogPost | undefined => {
    // First check in current state
    let post = posts.find(post => post.id === id);
    
    // If not found, check localStorage as fallback (in case state hasn't loaded yet)
    if (!post) {
      try {
        const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
        if (storedPosts) {
          const allPosts = JSON.parse(storedPosts);
          post = allPosts.find((p: BlogPost) => p.id === id);
          // If found in localStorage but not in state, update state
          if (post && !posts.find(p => p.id === id)) {
            setPosts(allPosts);
          }
        }
      } catch (error) {
        console.error('Error reading post from localStorage:', error);
      }
    }
    
    return post;
  };

  const getPostsByAuthor = (authorId: string): BlogPost[] => {
    return posts.filter(post => post.author.id === authorId);
  };

  const searchPosts = (query: string): BlogPost[] => {
    const lowerQuery = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const getPostsByCategory = (category: string): BlogPost[] => {
    return posts.filter(post => post.category === category);
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments(prev => [...prev, newComment]);
  };

  const getComments = (postId: string): Comment[] => {
    return comments.filter(comment => comment.postId === postId);
  };

  const likePost = (postId: string, userId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId && !post.likedBy?.includes(userId)) {
        return {
          ...post,
          likes: post.likes + 1,
          likedBy: [...(post.likedBy || []), userId]
        };
      }
      return post;
    }));
  };

  const unlikePost = (postId: string, userId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId && post.likedBy?.includes(userId)) {
        return {
          ...post,
          likes: Math.max(0, post.likes - 1),
          likedBy: post.likedBy.filter(id => id !== userId)
        };
      }
      return post;
    }));
  };

  const incrementViews = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, views: post.views + 1 } : post
    ));
  };

  const bookmarkPost = (postId: string, userId: string) => {
    const existingBookmark = bookmarks.find(
      b => b.postId === postId && b.userId === userId
    );
    if (!existingBookmark) {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        userId,
        postId,
        createdAt: new Date().toISOString(),
      };
      setBookmarks(prev => [...prev, newBookmark]);
    }
  };

  const unbookmarkPost = (postId: string, userId: string) => {
    setBookmarks(prev => prev.filter(
      b => !(b.postId === postId && b.userId === userId)
    ));
  };

  const isBookmarked = (postId: string, userId: string): boolean => {
    return bookmarks.some(b => b.postId === postId && b.userId === userId);
  };

  const getBookmarkedPosts = (userId: string): BlogPost[] => {
    const bookmarkedPostIds = bookmarks
      .filter(b => b.userId === userId)
      .map(b => b.postId);
    return posts.filter(post => bookmarkedPostIds.includes(post.id));
  };

  const likeComment = (commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
    ));
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return (
    <BlogContext.Provider value={{
      posts: posts.filter(p => p.published),
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

