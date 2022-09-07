import React, { useContext, useEffect, useRef, useState } from 'react';

type SettingsContextValues = {
  isDoubleDownAllowed: boolean;
  isDoubleDownAfterSplitAllowed: boolean;
  isSurrenderAllowed: boolean;
  toggleIsDoubleDownAllowed: () => void;
  toggleIsDoubleDownAfterSplitAllowed: () => void;
  toggleIsSurrenderAllowed: () => void;
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
  const [settings, setSettings] = useState({
    isDoubleDownAllowed: true,
    isDoubleDownAfterSplitAllowed: false,
    isSurrenderAllowed: true,
  });
  const initialRender = useRef(true);

  useEffect(() => {
    const blackjackSettings = localStorage.getItem('blackjack-settings');
    if (blackjackSettings !== null) {
      setSettings(JSON.parse(blackjackSettings));
    }
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    localStorage.setItem('blackjack-settings', JSON.stringify(settings));
  }, [settings]);

  const toggleIsDoubleDownAllowed = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      isDoubleDownAllowed: !prevSettings.isDoubleDownAllowed,
      isDoubleDownAfterSplitAllowed:
        prevSettings.isDoubleDownAfterSplitAllowed &&
        !prevSettings.isDoubleDownAllowed,
    }));
  };

  const toggleIsDoubleDownAfterSplitAllowed = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      isDoubleDownAfterSplitAllowed:
        !prevSettings.isDoubleDownAfterSplitAllowed,
    }));
  };

  const toggleIsSurrenderAllowed = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      isSurrenderAllowed: !prevSettings.isSurrenderAllowed,
    }));
  };

  const value = {
    ...settings,
    toggleIsDoubleDownAllowed,
    toggleIsDoubleDownAfterSplitAllowed,
    toggleIsSurrenderAllowed,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export { useSettings, SettingsProvider };
