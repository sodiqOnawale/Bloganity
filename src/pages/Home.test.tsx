import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { AuthProvider } from '../context/AuthContext';
import { BlogProvider } from '../context/BlogContext';
import { ThemeProvider } from '../context/ThemeContext';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <BlogProvider>
          {children}
        </BlogProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render home page', () => {
    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );

    expect(screen.getByText(/Welcome to Bloganity/i)).toBeInTheDocument();
  });

  it('should show get started button when not authenticated', () => {
    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );

    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });

  it('should show default seed posts for first-time visitors', () => {
    localStorage.clear();

    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );

    expect(screen.getByText(/Why Every Developer Should Write/i)).toBeInTheDocument();
    expect(screen.getByText(/48 Hours in Lisbon/i)).toBeInTheDocument();
  });

  it('should show empty member posts tab with link to all blogs', () => {
    localStorage.clear();

    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );

    fireEvent.click(screen.getByRole('tab', { name: /Member Posts/i }));

    expect(screen.getByText(/No member posts yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All Blogs/i })).toBeInTheDocument();
  });
});

