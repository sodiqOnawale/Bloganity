import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { act } from 'react-dom/test-utils';

const TestComponent: React.FC = () => {
  const { user, login, register, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.username : 'null'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <button
        onClick={() => login('test@example.com', 'password123')}
        data-testid="login-btn"
      >
        Login
      </button>
      <button
        onClick={() => register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        })}
        data-testid="register-btn"
      >
        Register
      </button>
      <button
        onClick={() => register({
          username: 'phoneuser',
          phone: '5551234567',
          password: 'password123',
        })}
        data-testid="register-phone-btn"
      >
        Register Phone
      </button>
      <button
        onClick={() => login('5551234567', 'password123')}
        data-testid="login-phone-btn"
      >
        Login Phone
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide default values', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('should register a new user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('register-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });

  it('should login an existing user', async () => {
    // First register
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('register-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Then logout
    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    // Then login
    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });

  it('should logout user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('register-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });

  it('should register and login with phone number', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('register-phone-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('phoneuser');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });

    await act(async () => {
      screen.getByTestId('login-phone-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('phoneuser');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });

  it('should not login with invalid credentials', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });
});

