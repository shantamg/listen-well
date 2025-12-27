import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

// Types for our auth context
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthContextValue {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
  signIn: (email: string) => Promise<{ prepareVerification: () => Promise<void> }>;
  verifyCode: (code: string) => Promise<void>;
  signUp: (email: string) => Promise<{ prepareVerification: () => Promise<void> }>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Check if we have a real Clerk key
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const USE_MOCK_AUTH = !CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY === '';

/**
 * Mock Auth Provider for development.
 * When Clerk is properly configured, this can be replaced with ClerkProvider.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Load stored auth state on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        const userJson = await SecureStore.getItemAsync(USER_KEY);

        if (token && userJson) {
          const storedUser = JSON.parse(userJson) as User;
          setUser(storedUser);
          setIsSignedIn(true);
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadAuthState();
  }, []);

  const signIn = useCallback(async (email: string) => {
    setPendingEmail(email);

    return {
      prepareVerification: async () => {
        // In a real implementation, this would send a verification code
        // For mock, we accept any 6-digit code
        console.log(`[Mock Auth] Verification code sent to ${email}`);
      }
    };
  }, []);

  const signUp = useCallback(async (email: string) => {
    setPendingEmail(email);

    return {
      prepareVerification: async () => {
        // In a real implementation, this would send a verification code
        console.log(`[Mock Auth] Signup verification code sent to ${email}`);
      }
    };
  }, []);

  const verifyCode = useCallback(async (code: string) => {
    if (!pendingEmail) {
      throw new Error('No pending email verification');
    }

    // Mock verification - accept any 6-digit code in dev
    if (USE_MOCK_AUTH && code.length === 6) {
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: pendingEmail,
        firstName: 'Test',
        lastName: 'User',
      };

      const mockToken = `mock_token_${Date.now()}`;

      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));

      setUser(mockUser);
      setIsSignedIn(true);
      setPendingEmail(null);
      return;
    }

    // In production, this would verify with Clerk
    throw new Error('Invalid verification code');
  }, [pendingEmail]);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setUser(null);
    setIsSignedIn(false);
  }, []);

  const getToken = useCallback(async () => {
    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  }, []);

  const value: AuthContextValue = {
    isLoaded,
    isSignedIn,
    user,
    signIn,
    signUp,
    verifyCode,
    signOut,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export { USE_MOCK_AUTH };
