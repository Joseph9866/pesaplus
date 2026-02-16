import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/api/services/auth';
import { tokenManager } from '../lib/api/client';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we're using mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data implementation
  const fetchUserProfileMock = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    const authUser = await supabase.auth.getUser();
    return {
      ...data,
      email: authUser.data.user?.email || '',
    };
  };

  // Real API implementation
  const fetchUserProfileReal = async (): Promise<User | null> => {
    try {
      const userData = await authService.getCurrentUser();
      return {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        phone_number: userData.phone_number || null,
        kyc_status: 'pending', // Default values - will be fetched from KYC endpoint later
        total_balance: 0,
        total_saved: 0,
        lottery_entries: 0,
        referral_code: '',
        referred_by: null,
        kyc_document_url: null,
        kyc_id_number: null,
        kyc_address: null,
        created_at: userData.date_joined,
        updated_at: userData.date_joined,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    if (USE_MOCK_DATA) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const profile = await fetchUserProfileMock(authUser.id);
        setUser(profile);
      }
    } else {
      const token = tokenManager.getAccessToken();
      if (token) {
        const profile = await fetchUserProfileReal();
        setUser(profile);
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (USE_MOCK_DATA) {
        // Mock data initialization
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchUserProfileMock(session.user.id);
          setUser(profile);
        }
        setLoading(false);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
          (async () => {
            if (session?.user) {
              const profile = await fetchUserProfileMock(session.user.id);
              setUser(profile);
            } else {
              setUser(null);
            }
            setLoading(false);
          })();
        });

        return () => {
          subscription.unsubscribe();
        };
      } else {
        // Real API initialization
        const token = tokenManager.getAccessToken();
        if (token) {
          const profile = await fetchUserProfileReal();
          setUser(profile);
        }
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    if (USE_MOCK_DATA) {
      // Mock implementation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user && referralCode) {
        const { data: referrer } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('referral_code', referralCode)
          .maybeSingle();

        if (referrer) {
          await supabase
            .from('user_profiles')
            .update({ referred_by: referrer.id })
            .eq('id', data.user.id);

          await supabase
            .from('referrals')
            .insert({
              referrer_id: referrer.id,
              referred_id: data.user.id,
            });
        }
      }
    } else {
      // Real API implementation
      await authService.register({
        email,
        password1: password, // Backend expects password1
        password2: password, // Password confirmation
        full_name: fullName,
        role: 'customer', // Default role for new users
      });

      // Fetch and set user profile
      const profile = await fetchUserProfileReal();
      setUser(profile);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (USE_MOCK_DATA) {
      // Mock implementation
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } else {
      // Real API implementation
      await authService.login({ email, password });

      // Fetch and set user profile
      const profile = await fetchUserProfileReal();
      setUser(profile);
    }
  };

  const signOut = async () => {
    if (USE_MOCK_DATA) {
      // Mock implementation
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      // Real API implementation
      await authService.logout();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
