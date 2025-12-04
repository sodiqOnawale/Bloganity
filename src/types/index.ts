export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  category: string;
  tags: string[];
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  likedBy?: string[]; // Array of user IDs who liked the post
  readingTime?: number; // Estimated reading time in minutes
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface BlogContextType {
  posts: BlogPost[];
  allPosts: BlogPost[]; // Includes unpublished posts for authors
  addPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => BlogPost | undefined;
  getPostsByAuthor: (authorId: string) => BlogPost[];
  searchPosts: (query: string) => BlogPost[];
  getPostsByCategory: (category: string) => BlogPost[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
  getComments: (postId: string) => Comment[];
  likePost: (postId: string, userId: string) => void;
  unlikePost: (postId: string, userId: string) => void;
  incrementViews: (postId: string) => void;
  bookmarkPost: (postId: string, userId: string) => void;
  unbookmarkPost: (postId: string, userId: string) => void;
  isBookmarked: (postId: string, userId: string) => boolean;
  getBookmarkedPosts: (userId: string) => BlogPost[];
  likeComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
}

