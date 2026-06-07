import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterParams } from '../types';
import { isValidPhone, normalizePhone, phonesMatch } from '../utils/phone';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'bloganity_auth';

type StoredUser = User & { password: string };

const findUserByIdentifier = (users: StoredUser[], identifier: string): StoredUser | undefined => {
  const trimmed = identifier.trim().toLowerCase();

  if (trimmed.includes('@')) {
    return users.find((u) => u.email?.toLowerCase() === trimmed);
  }

  if (isValidPhone(identifier)) {
    return users.find((u) => u.phone && phonesMatch(u.phone, identifier));
  }

  return undefined;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
    }
    return null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser && !user) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, [user]);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem('bloganity_users') || '[]');
    const foundUser = findUserByIdentifier(users, identifier);

    if (foundUser && foundUser.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async ({ username, password, email, phone }: RegisterParams): Promise<boolean> => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem('bloganity_users') || '[]');
    const trimmedUsername = username.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const normalizedPhone = phone ? normalizePhone(phone) : undefined;

    if (!trimmedUsername) {
      return false;
    }

    if (!trimmedEmail && !normalizedPhone) {
      return false;
    }

    if (trimmedEmail && users.some((u) => u.email?.toLowerCase() === trimmedEmail)) {
      return false;
    }

    if (normalizedPhone && users.some((u) => u.phone && phonesMatch(u.phone, normalizedPhone))) {
      return false;
    }

    if (users.some((u) => u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
      return false;
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      username: trimmedUsername,
      password,
      createdAt: new Date().toISOString(),
      ...(trimmedEmail ? { email: trimmedEmail } : {}),
      ...(normalizedPhone ? { phone: normalizedPhone } : {}),
    };

    users.push(newUser);
    localStorage.setItem('bloganity_users', JSON.stringify(users));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    const users: StoredUser[] = JSON.parse(localStorage.getItem('bloganity_users') || '[]');
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('bloganity_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
