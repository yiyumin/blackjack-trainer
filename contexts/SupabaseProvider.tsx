import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthChangeEvent, Provider, Session } from '@supabase/supabase-js';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import { toast } from 'react-toastify';

import { Settings, Stats } from '../lib/types';
import { supabaseClient } from '../lib/supabaseClient';
import {
  defaultSettings,
  defaultStats,
  validateSettings,
  validateStats,
} from '../lib/blackjack';

type SupabaseContextValues = {
  userId: string | null;
  userRecord: {
    stats: Stats;
    settings: Settings;
    saveFrequency: number;
  } | null;
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
  saveSettings: (userId: string, settings: Settings) => Promise<void>;
  saveSaveFrequency: (userId: string, saveFrequency: number) => Promise<void>;
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
  const [userRecord, setUserRecord] = useState<{
    stats: Stats;
    settings: Settings;
    saveFrequency: number;
  } | null>(null);
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
        toast.error(error);
      });
  }, []);

  useEffect(() => {
    if (!userId) {
      setUserRecord(null);
      return;
    }

    const fetchData = async () => {
      try {
        const { data } = await supabaseClient
          .from('blackjack_trainer')
          .select('stats,settings,save_freq')
          .eq('id', userId)
          .single();

        // returning user - pull record from db
        if (data) {
          if (typeof data.stats !== 'string')
            throw new Error('Returned compressed stats is not of type string');
          if (typeof data.settings !== 'string')
            throw new Error(
              'Returned compressed settings is not of type string'
            );
          if (typeof data.save_freq !== 'number')
            throw new Error('Returned save frequency is not of type number');

          const [statsIsValid, validStats] = validateStats(
            JSON.parse(decompressFromEncodedURIComponent(data.stats) || '{}')
          );
          if (!statsIsValid) throw new Error('Uncompressed stats is not valid');

          const [settingsIsValid, validSettings] = validateSettings(
            JSON.parse(decompressFromEncodedURIComponent(data.settings) || '{}')
          );
          if (!settingsIsValid)
            throw new Error('Uncompressed settings is not valid');

          console.log(validStats, validSettings, data.save_freq);

          setUserRecord({
            stats: validStats,
            settings: validSettings,
            saveFrequency: data.save_freq,
          });
        } else {
          // first time user - upload record from localstorage then reset localstorage
          const stats = localStorage.getItem('blackjack-stats');
          const settings = localStorage.getItem('blackjack-settings');

          if (stats && settings) {
            const { error } = await supabaseClient
              .from('blackjack_trainer')
              .insert([
                {
                  id: userId,
                  stats: compressToEncodedURIComponent(stats),
                  settings: compressToEncodedURIComponent(settings),
                  save_freq: 50,
                },
              ]);

            if (error) throw new Error(error.message);
            localStorage.setItem(
              'blackjack-stats',
              JSON.stringify(defaultStats)
            );
            localStorage.setItem(
              'blackjack-settings',
              JSON.stringify(defaultSettings)
            );

            setUserRecord({
              stats: JSON.parse(stats),
              settings: JSON.parse(settings),
              saveFrequency: 50,
            });
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };

    fetchData();
  }, [userId]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabaseClient.auth.signUp({ email, password });

      if (error) throw error;
      toast.success('Email sent! Check your inbox to verify your email.');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error logging up: ${error.message}`);
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
        toast.success('Logged in!');
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error logging in: ${error.message}`);
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
      toast.success('Check your email for the login link!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error generating login link: ${error.message}`);
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
        toast.error(`Error logging in with provider: ${error.message}`);
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) toast.error(`Error logging out: ${error.message}`);
    else toast.success('Logged out!');
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Check your email for the password recovery link!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error resetting password: ${error.message}`);
      }
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { data, error } = await supabaseClient.auth.updateUser({
      password,
    });

    if (data) toast.success('Password updated successfully!');
    if (error) toast.error('There was an error updating your password');

    setIsPasswordRecoveryMode(false);
  }, []);

  const saveStats = useCallback(async (userId: string, stats: Stats) => {
    const updates = {
      stats: compressToEncodedURIComponent(JSON.stringify(stats)),
      updated_at: new Date(),
    };

    const toastId = toast.loading('Saving stats...');
    const { error } = await supabaseClient
      .from('blackjack_trainer')
      .update(updates)
      .eq('id', userId);

    if (error) {
      toast.update(toastId, {
        render: `Error saving stats: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 2500,
      });
    } else {
      toast.update(toastId, {
        render: 'Stats saved!',
        type: 'success',
        isLoading: false,
        autoClose: 2500,
      });
    }
  }, []);

  const saveSettings = useCallback(
    async (userId: string, settings: Settings) => {
      const updates = {
        settings: compressToEncodedURIComponent(JSON.stringify(settings)),
        updated_at: new Date(),
      };

      const toastId = toast.loading('Saving settings...');
      const { error } = await supabaseClient
        .from('blackjack_trainer')
        .update(updates)
        .eq('id', userId);

      if (error) {
        toast.update(toastId, {
          render: `Error saving settings: ${error.message}`,
          type: 'error',
          isLoading: false,
          autoClose: 2500,
        });
      } else {
        toast.update(toastId, {
          render: 'Settings saved!',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
        });
      }
    },
    []
  );

  const saveSaveFrequency = useCallback(
    async (userId: string, saveFrequency: number) => {
      const updates = {
        save_freq: saveFrequency,
        updated_at: new Date(),
      };

      const toastId = toast.loading('Saving save frequency...');
      const { error } = await supabaseClient
        .from('blackjack_trainer')
        .update(updates)
        .eq('id', userId);

      if (error) {
        toast.update(toastId, {
          render: `Error saving save frequency: ${error.message}`,
          type: 'error',
          isLoading: false,
          autoClose: 2500,
        });
      } else {
        toast.update(toastId, {
          render: 'Save frequency saved!',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
        });
      }
    },
    []
  );

  const value = {
    userId,
    userRecord,
    isPasswordRecoveryMode,
    signUp,
    signInWithPassword,
    signInWithOtp,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    saveStats,
    saveSettings,
    saveSaveFrequency,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export { useSupabase, SupabaseProvider };
