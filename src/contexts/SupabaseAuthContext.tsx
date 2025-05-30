import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  signUp: (email: string, password: string, username: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('SupabaseAuthProvider - Current state:', { user: !!user, profile: !!profile, session: !!session, loading });

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, { session: !!session, user: !!session?.user });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User found, fetching profile...');
          try {
            const userProfile = await fetchProfile(session.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error('Failed to fetch profile:', error);
            setProfile(null);
          }
        } else {
          console.log('No user, clearing profile...');
          setProfile(null);
        }
        
        console.log('Setting loading to false...');
        setLoading(false);
      }
    );

    // Check for existing session
    console.log('Checking for existing session...');
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      console.log('Initial session check:', { session: !!session });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('Initial user found, fetching profile...');
        try {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          setProfile(null);
        }
      } else {
        console.log('No initial user found...');
        setProfile(null);
      }
      
      console.log('Initial check complete, setting loading to false...');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    console.log('Signing up user:', { email, username });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (error) {
      console.error('Sign up error:', error);
    } else {
      console.log('Sign up successful:', data);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Signing in user:', { email });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
    } else {
      console.log('Sign in successful:', data);
    }

    return { error };
  };

  const signOut = async () => {
    console.log('Signing out user...');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    console.log('User signed out successfully');
  };

  const value = {
    isAuthenticated: !!user,
    user,
    profile,
    session,
    signUp,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
