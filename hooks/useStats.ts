import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { decompressFromEncodedURIComponent } from 'lz-string';

import { Stats } from '../lib/types';
import useLocalStorage from './useLocalStorage';
import { validateStats } from '../lib/blackjack';

const defaultStats: Stats = { pairs: [], softHands: [], hardHands: [] };

const useStats = (
  saveStats: (userId: string, stats: Stats) => Promise<void>,
  isNewUser: (userId: string) => Promise<{ error?: string; isNew: boolean }>,
  getCompressedStats: (
    userId: string
  ) => Promise<{ error?: string; compressedStats: any }>,
  userId: string | null
) => {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [localStats, setLocalStats] = useLocalStorage(
    'blackjack-stats',
    (): Stats => defaultStats
  );

  const renderCount = useRef(0);
  const saveFrequency = useRef(50);
  const handCount = useRef(0);

  useEffect(() => {
    const fetchData = async (userId: string) => {
      try {
        const { error: isNewUserError, isNew } = await isNewUser(userId);

        if (isNewUserError) throw new Error(isNewUserError);

        if (isNew) {
          await saveStats(userId, localStats);
          setStats(localStats);
          setLocalStats(defaultStats);
        } else {
          const { error: getStatsError, compressedStats } =
            await getCompressedStats(userId);

          if (getStatsError) throw new Error(getStatsError);
          if (typeof compressedStats !== 'string')
            throw new Error('Returned compressed stats is not of type string');

          const [isValid, validStats] = validateStats(
            JSON.parse(
              decompressFromEncodedURIComponent(compressedStats) || '{}'
            )
          );

          if (!isValid) throw new Error('Uncompressed stats is not valid');

          setStats(validStats);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log('Error thrown:', error.message);
          alert(error.message);
        }
      } finally {
        handCount.current = 0;
      }
    };

    if (userId != null) {
      fetchData(userId);
    }
  }, [
    userId,
    localStats,
    setLocalStats,
    isNewUser,
    saveStats,
    getCompressedStats,
  ]);

  useEffect(() => {
    if (!userId) return;

    if (renderCount.current < 2) {
      // ignoring the first 2 renders. first inital render for when stats is the default value. second for when stats is populated with data from the cloud.
      renderCount.current += 1;
      return;
    }

    handCount.current += 1;
    console.log(handCount.current);
    if (handCount.current === saveFrequency.current) {
      console.log('saving');
      handCount.current = 0;
      saveStats(userId, stats);
    }
  }, [userId, saveStats, stats]);

  const setSaveFrequency = useCallback((frequency: number) => {
    saveFrequency.current = frequency;
    handCount.current = 0;
  }, []);

  const customSetStats = useCallback(
    (value: SetStateAction<Stats>) => {
      if (userId != null) {
        return setStats(value);
      }

      return setLocalStats(value);
    },
    [userId, setLocalStats]
  );

  const customStats = useMemo(() => {
    if (userId != null) {
      return stats;
    }

    return localStats;
  }, [userId, stats, localStats]);

  return {
    stats: customStats,
    setStats: customSetStats,
    saveFrequency,
    setSaveFrequency,
  };
};

export { useStats };
