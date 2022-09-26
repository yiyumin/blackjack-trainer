import { useCallback, useEffect, useRef, useState } from 'react';

import { Stats } from '../lib/types';
import { defaultStats } from '../lib/blackjack';
import { useSupabase } from '../contexts/SupabaseProvider';

const useStats = () => {
  const { userId, userRecord, saveStats, saveSaveFrequency } = useSupabase();
  const [stats, setStats] = useState<Stats>(defaultStats);

  const initialRender = useRef(true);
  const initialSupabaseRender = useRef(true);

  const saveFrequency = useRef(50);
  const handCount = useRef(0);

  useEffect(() => {
    initialRender.current = true;
    if (userId) {
      initialSupabaseRender.current = true;
      setStats(userRecord?.stats ?? defaultStats);
      saveFrequency.current = userRecord?.saveFrequency || 50;
    } else {
      const blackjackStats = localStorage.getItem('blackjack-stats');
      if (blackjackStats !== null) {
        setStats(JSON.parse(blackjackStats));
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
      handCount.current += 1;
      if (handCount.current === saveFrequency.current) {
        handCount.current = 0;
        saveStats(userId, stats);
      }
    } else {
      localStorage.setItem('blackjack-stats', JSON.stringify(stats));
    }
  }, [userId, stats, saveStats]);

  const setSaveFrequency = useCallback(
    (frequency: number) => {
      if (!userId) return;

      saveFrequency.current = frequency;
      handCount.current = 0;
      saveSaveFrequency(userId, frequency);
    },
    [userId, saveSaveFrequency]
  );

  return {
    stats,
    setStats,
    saveFrequency,
    setSaveFrequency,
  };
};

export { useStats };
