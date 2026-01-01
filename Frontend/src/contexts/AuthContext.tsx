import React, { createContext, useContext, useEffect, useState } from 'react';
// import { User } from '@supabase/supabase-js';
import { authService } from '../lib/auth';
// import { Profile } from '../lib/supabase';
import { Writer } from '../lib/types';

interface AuthContextType {
  user: Writer | null;
  profile: Writer | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, bio: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Writer | null>(null);
  const [profile, setProfile] = useState<Writer | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (currentUser: Writer | null) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    try {      
      const userProfile = await authService.getProfileById(currentUser.id.toString());
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const currentUser = profile?.id
          ? await authService.getProfileById(profile.id.toString())
          : null;
        setUser(currentUser);
        await loadProfile(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const unsubscribe = authService.onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      if(currentUser){
        try{
          const fresh = await authService.getProfileById(currentUser.id.toString());
          if(!mounted) return
          setUser(fresh ?? currentUser);
        }catch(err){
          console.error("Error loading fresh profile", err);          
        }finally {
          if(mounted) setLoading(false);
        }
      }
    }); 

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, bio: string) => {
    const { user: newUser, profile: newProfile } = await authService.logInOrSignUpWriter({email, password, name, bio});
    setUser(newUser);
    setProfile(newProfile);
  };

  const signIn = async (email: string, password: string) => {
    const { user: newUser, profile: newProfile } = await authService.logInOrSignUpWriter({email, password, name: '', bio: ''});
    setUser(newUser);
    setProfile(newProfile);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
