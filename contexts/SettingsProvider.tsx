import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { defaultSettings } from '../lib/blackjack';
import { Settings } from '../lib/types';
import { useSupabase } from './SupabaseProvider';

type SettingsContextValues = {
  isDoubleDownAllowed: boolean;
  isDoubleDownAfterSplitAllowed: boolean;
  isSurrenderAllowed: boolean;
  isDarkModeEnabled: boolean;
  toggleIsDoubleDownAllowed: () => void;
  toggleIsDoubleDownAfterSplitAllowed: () => void;
  toggleIsSurrenderAllowed: () => void;
  toggleIsDarkModeEnabled: () => void;
};

const SettingsContext = React.createContext<SettingsContextValues | undefined>(
  undefined
);

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};

type SettingsProviderProps = {
  children: React.ReactNode;
};

const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { userId, userRecord, saveSettings } = useSupabase();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const initialRender = useRef(true);
  const initialSupabaseRender = useRef(true);

  useEffect(() => {
    const getDefaultSettings = () => ({
      ...defaultSettings,
      isDarkModeEnabled:
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches,
    });
    initialRender.current = true;

    if (userId) {
      initialSupabaseRender.current = true;
      setSettings(userRecord?.settings ?? getDefaultSettings());
    } else {
      const blackjackSettings = localStorage.getItem('blackjack-settings');
      if (blackjackSettings !== null) {
        setSettings(JSON.parse(blackjackSettings));
      } else {
        setSettings(getDefaultSettings());
      }
    }
  }, [userId, userRecord]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (userId) {
      if (initialSupabaseRender.current) {
        initialSupabaseRender.current = false;
        return;
      }
      saveSettings(userId, settings);
    } else {
      localStorage.setItem('blackjack-settings', JSON.stringify(settings));
    }
  }, [userId, settings, saveSettings]);

  const toggleIsDoubleDownAllowed = useCallback(() => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      isDoubleDownAllowed: !prevSettings.isDoubleDownAllowed,
      isDoubleDownAfterSplitAllowed:
        prevSettings.isDoubleDownAfterSplitAllowed &&
        !prevSettings.isDoubleDownAllowed,
    }));
  }, []);

  const toggleIsDoubleDownAfterSplitAllowed = useCallback(() => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      isDoubleDownAfterSplitAllowed:
        !prevSettings.isDoubleDownAfterSplitAllowed,
    }));
  }, []);

  const toggleIsSurrenderAllowed = useCallback(() => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      isSurrenderAllowed: !prevSettings.isSurrenderAllowed,
    }));
  }, []);

  const toggleIsDarkModeEnabled = useCallback(() => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      isDarkModeEnabled: !prevSettings.isDarkModeEnabled,
    }));
  }, []);

  const value = {
    ...settings,
    toggleIsDoubleDownAllowed,
    toggleIsDoubleDownAfterSplitAllowed,
    toggleIsSurrenderAllowed,
    toggleIsDarkModeEnabled,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export { useSettings, SettingsProvider };
