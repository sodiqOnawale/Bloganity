import React from 'react';
import { render, screen } from '@testing-library/react';
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
});

