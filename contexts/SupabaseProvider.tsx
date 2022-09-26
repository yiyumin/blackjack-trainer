import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthChangeEvent, Provider, Session } from '@supabase/supabase-js';
import { compressToEncodedURIComponent } from 'lz-string';

import { Stats } from '../lib/types';
import { supabaseClient } from '../lib/supabaseClient';

type SupabaseContextValues = {
  userId: string | null;
  isPasswordRecoveryMode: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithPassword: (
    email: string,
    password: string,
    onSuccessCallback: () => void
  ) => Promise<void>;
  signInWithOtp: (email: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  saveStats: (userId: string, stats: Stats) => Promise<void>;
  getCompressedStats: (
    userId: string
  ) => Promise<{ error: string | undefined; compressedStats: any }>;
  isNewUser: (
    userId: string
  ) => Promise<{ error: string | undefined; isNew: boolean }>;
};

const SupabaseContext = React.createContext<SupabaseContextValues | undefined>(
  undefined
);

const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }

  return context;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};
const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event == 'PASSWORD_RECOVERY') setIsPasswordRecoveryMode(true);
        setUserId(session?.user.id ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    supabaseClient.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUserId(session?.user.id ?? null);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabaseClient.auth.signUp({ email, password });

      if (error) throw error;
      alert('Email sent! Check your inbox to verify your email.');
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error thrown:', error.message);
        alert(error.message);
      }
    }
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string, onSuccessCallback: () => void) => {
      try {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccessCallback();
        alert('Logged in!');
      } catch (error) {
        if (error instanceof Error) {
          console.log('Error thrown:', error.message);
          alert(error.message);
        }
      }
    },
    []
  );

  const signInWithOtp = useCallback(async (email: string) => {
    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
      });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error thrown:', error.message);
        alert(error.message);
      }
    }
  }, []);

  const signInWithProvider = useCallback(async (provider: Provider) => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error thrown:', error.message);
        alert(error.message);
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.log('Error logging out:', error.message);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
      if (error) throw error;
      alert('Check your email for the password recovery link!');
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error thrown:', error.message);
        alert(error.message);
      }
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { data, error } = await supabaseClient.auth.updateUser({
      password,
    });
    if (data) alert('Password updated successfully!');
    if (error) alert('There was an error updating your password.');
    setIsPasswordRecoveryMode(false);
  }, []);

  const saveStats = useCallback(async (userId: string, stats: Stats) => {
    const updates = {
      id: userId,
      stats: compressToEncodedURIComponent(JSON.stringify(stats)),
      updated_at: new Date(),
    };

    const { error } = await supabaseClient
      .from('blackjack_stats')
      .upsert(updates);

    if (error) {
      alert(error.message);
    }
  }, []);

  const getCompressedStats = useCallback(async (userId: string) => {
    const { data, error } = await supabaseClient
      .from('blackjack_stats')
      .select('stats')
      .eq('id', userId)
      .single();

    return {
      error: error?.message,
      compressedStats: data?.stats,
    };
  }, []);

  const isNewUser = useCallback(async (userId: string) => {
    const { error, count } = await supabaseClient
      .from('blackjack_stats')
      .select('id', { count: 'estimated', head: true })
      .eq('id', userId);

    return {
      error: error && error.message,
      isNew: count == 0,
    };
  }, []);

  const value = {
    userId,
    isPasswordRecoveryMode,
    signUp,
    signInWithPassword,
    signInWithOtp,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    saveStats,
    getCompressedStats,
    isNewUser,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export { useSupabase, SupabaseProvider };
