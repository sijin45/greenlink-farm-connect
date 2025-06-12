
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

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating basic profile...');
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const newProfile = {
              id: userId,
              username: userData.user.email?.split('@')[0] || 'User',
              email: userData.user.email || '',
              role: 'customer'
            };
            
            const { data: insertedProfile, error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();
              
            if (!insertError && insertedProfile) {
              console.log('Basic profile created successfully');
              return insertedProfile;
            } else {
              console.error('Failed to create profile:', insertError);
              // Return a default profile if database insert fails
              return newProfile;
            }
          }
        }
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
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Initial session check:', { session: !!session });
        
        // Only update if we don't already have a session (to avoid double setting)
        if (!loading || !session) {
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
        }
        
        console.log('Initial check complete, setting loading to false...');
        setLoading(false);
      } catch (error) {
        console.error('Error during auth initialization:', error);
        setLoading(false);
      }
    };

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached, setting loading to false');
      setLoading(false);
    }, 5000); // Reduced to 5 seconds

    initializeAuth().finally(() => {
      clearTimeout(loadingTimeout);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
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
