import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import { BlogProvider } from '../context/BlogContext';
import { ThemeProvider } from '../context/ThemeContext';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('should render login form', () => {
    render(
      <Wrapper>
        <Login />
      </Wrapper>
    );

    expect(screen.getAllByText(/Sign In/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should switch to sign up tab', () => {
    render(
      <Wrapper>
        <Login />
      </Wrapper>
    );

    const signUpTab = screen.getByText(/Sign Up/i);
    fireEvent.click(signUpTab);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  });

  it('should register a new user', async () => {
    render(
      <Wrapper>
        <Login />
      </Wrapper>
    );

    // Switch to sign up
    const signUpTab = screen.getByText(/Sign Up/i);
    fireEvent.click(signUpTab);

    // Fill form
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    // Submit
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});

