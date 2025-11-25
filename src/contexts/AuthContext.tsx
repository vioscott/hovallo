import React, { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '../utils/supabase';
// User type is defined below

// Define a type that matches our app's needs, extending or wrapping Supabase user
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'tenant' | 'landlord' | 'agent' | 'admin';
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signup: (email: string, password: string, name: string, role?: 'tenant' | 'landlord' | 'agent') => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email!);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      // Fetch user role/details from public.users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Fallback if user record doesn't exist yet (e.g. just signed up)
        // In a real app, we might want to wait or retry
      }

      setUser({
        id: userId,
        email: email,
        name: data?.name || email.split('@')[0],
        role: data?.role || 'tenant',
        isAdmin: data?.role === 'admin' // Simple check for now
      });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to login'
      };
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'tenant' | 'landlord' | 'agent' = 'tenant') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in public.users table
        // Note: This might be handled by a Supabase Trigger ideally, but we'll do it client-side for MVP if no trigger exists
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              name: name,
              role: role,
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Continue anyway as auth account is created
        }
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to sign up'
      };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  return <AuthContext.Provider value={{
    user,
    login,
    signup,
    logout,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    loading
  }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}