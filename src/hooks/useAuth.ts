import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentProfile } from '../lib/supabase';
import { User as AppUser } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (!supabase) {
          // Demo mode - check localStorage for demo user
          const demoUser = localStorage.getItem('demo-user');
          if (demoUser && mounted) {
            const user = JSON.parse(demoUser);
            setUser(user);
            await loadProfile(user.id);
          } else if (mounted) {
            setLoading(false);
          }
          return;
        }

        // Real Supabase mode
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (mounted) {
              setUser(session?.user ?? null);
              if (session?.user) {
                await loadProfile(session.user.id);
              } else {
                setProfile(null);
                setLoading(false);
              }
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError('Failed to initialize authentication');
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      setError(null);
      const profileData = await getCurrentProfile();
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Demo mode login function
  const demoLogin = (email: string, password: string) => {
    const demoUser = {
      id: email === 'admin@etailor.com' ? 'demo-admin-id' : 'demo-user-id',
      email: email,
      user_metadata: { 
        full_name: email === 'admin@etailor.com' ? 'Admin User' : 'Demo User' 
      }
    };
    
    localStorage.setItem('demo-user', JSON.stringify(demoUser));
    setUser(demoUser as any);
    loadProfile(demoUser.id);
  };

  // Demo mode logout function
  const demoLogout = () => {
    localStorage.removeItem('demo-user');
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    demoLogin,
    demoLogout
  };
};