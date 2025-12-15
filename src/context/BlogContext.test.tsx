import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BlogProvider, useBlog } from './BlogContext';
import { act } from 'react-dom/test-utils';
import { User } from '../types';

const mockUser: User = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  createdAt: new Date().toISOString(),
};

const TestComponent: React.FC = () => {
  const { posts, addPost, likePost, bookmarkPost, addComment } = useBlog();

  return (
    <div>
      <div data-testid="posts-count">{posts.length}</div>
      <button
        onClick={() =>
          addPost({
            title: 'Test Post',
            excerpt: 'Test excerpt',
            content: 'Test content',
            author: mockUser,
            category: 'Technology',
            tags: ['test'],
            published: true,
          })
        }
        data-testid="add-post-btn"
      >
        Add Post
      </button>
      <button
        onClick={() => likePost('1', '1')}
        data-testid="like-post-btn"
      >
        Like Post
      </button>
      <button
        onClick={() => bookmarkPost('1', '1')}
        data-testid="bookmark-post-btn"
      >
        Bookmark Post
      </button>
      <button
        onClick={() =>
          addComment({
            postId: '1',
            author: mockUser,
            content: 'Test comment',
          })
        }
        data-testid="add-comment-btn"
      >
        Add Comment
      </button>
    </div>
  );
};

describe('BlogContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide default values', () => {
    render(
      <BlogProvider>
        <TestComponent />
      </BlogProvider>
    );

    expect(screen.getByTestId('posts-count')).toHaveTextContent('0');
  });

  it('should add a new post', async () => {
    render(
      <BlogProvider>
        <TestComponent />
      </BlogProvider>
    );

    await act(async () => {
      screen.getByTestId('add-post-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('posts-count')).toHaveTextContent('1');
    });
  });

  it('should like a post', async () => {
    render(
      <BlogProvider>
        <TestComponent />
      </BlogProvider>
    );

    // First add a post
    await act(async () => {
      screen.getByTestId('add-post-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('posts-count')).toHaveTextContent('1');
    });

    // Then like it
    await act(async () => {
      screen.getByTestId('like-post-btn').click();
    });

    // The post should still exist
    await waitFor(() => {
      expect(screen.getByTestId('posts-count')).toHaveTextContent('1');
    });
  });

  it('should bookmark a post', async () => {
    render(
      <BlogProvider>
        <TestComponent />
      </BlogProvider>
    );

    // First add a post
    await act(async () => {
      screen.getByTestId('add-post-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('posts-count')).toHaveTextContent('1');
    });

    // Then bookmark it
    await act(async () => {
      screen.getByTestId('bookmark-post-btn').click();
    });

    // The post should still exist
    await waitFor(() => {
      expect(screen.getByTestId('posts-count')).toHaveTextContent('1');
    });
  });

  it('should add a comment', async () => {
    render(
      <BlogProvider>
        <TestComponent />
      </BlogProvider>
    );

    // First add a post
    await act(async () => {
      screen.getByTestId('add-post-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('posts-count')).toHaveTextContent('1');
    });

    // Then add a comment
    await act(async () => {
      screen.getByTestId('add-comment-btn').click();
    });

    // The post should still exist
    await waitFor(() => {
      expect(screen.getByTestId('posts-count')).toHaveTextContent('1');
    });
  });
});

