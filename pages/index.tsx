import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';

import { Move } from '../types';
import { useSupabase } from '../contexts/SupabaseProvider';
import { useBlackjack } from '../hooks/useBlackjack';
import { useStats } from '../hooks/useStats';

import Header from '../components/Header';
import MainBoard from '../components/MainBoard';
import ModalFloat from '../components/ModalFloat';
import Settings from '../components/Settings';
import MoveOptions from '../components/MoveOptions';
import Result from '../components/Result';
import ModalFullPage from '../components/ModalFullPage';
import Statistics from '../components/Statistics';
import HowToPlay from '../components/HowToPlay';
import UpdatePassword from '../components/UpdatePassword';

const KEYBOARD_MOVE_MAP: Record<string, Move> = {
  u: 'hit',
  i: 'stand',
  j: 'split',
  k: 'double_down',
  l: 'surrender',
};

const Home: NextPage = () => {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(true);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);

  const {
    userId,
    isPasswordRecoveryMode,
    updatePassword,
    saveStats,
    isNewUser,
    getCompressedStats,
  } = useSupabase();

  const { stats, setStats, saveFrequency, setSaveFrequency } = useStats(
    saveStats,
    isNewUser,
    getCompressedStats,
    userId
  );

  const {
    isHandDealt,
    hand,
    isCorrect,
    explanation,
    selectedPracticeType,
    setSelectedPracticeType,
    dealCards,
    makeMove,
    resetHandStat,
    resetAllHandStatsOfHandType,
  } = useBlackjack(stats, setStats);

  useEffect(() => {
    setIsUpdatePasswordOpen(isPasswordRecoveryMode);

    if (isPasswordRecoveryMode) {
      setIsHowToPlayOpen(false);
    }
  }, [isPasswordRecoveryMode]);

  useEffect(() => {
    if (isHowToPlayOpen || isStatisticsOpen || isSettingsOpen) return;

    const onMoveKeyDown = (e: KeyboardEvent) => {
      if (/^[uijkl]$/.test(e.key)) {
        makeMove(KEYBOARD_MOVE_MAP[e.key]);
      }
    };

    document.addEventListener('keydown', onMoveKeyDown);
    return () => document.removeEventListener('keydown', onMoveKeyDown);
  }, [makeMove, isHowToPlayOpen, isStatisticsOpen, isSettingsOpen]);

  useEffect(() => {
    if (isHowToPlayOpen || isStatisticsOpen || isSettingsOpen) return;

    const onSpaceKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        dealCards();
      }
    };

    document.addEventListener('keydown', onSpaceKeyDown);
    return () => document.removeEventListener('keydown', onSpaceKeyDown);
  }, [dealCards, isHowToPlayOpen, isStatisticsOpen, isSettingsOpen]);

  return (
    <>
      <div className='flex w-full max-w-3xl flex-col justify-between divide-y-2 divide-[#d3d6da] dark:divide-[#3a3a3c]'>
        <Head>
          <title>Blackjack Trainer</title>
          <meta name='description' content='Perfect your blackjack strategy.' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <Header
          openHowToPlay={useCallback(() => setIsHowToPlayOpen(true), [])}
          openStatistics={useCallback(() => setIsStatisticsOpen(true), [])}
          openSettings={useCallback(() => setIsSettingsOpen(true), [])}
        />

        <MainBoard hand={hand} />

        <Result isCorrect={isCorrect} explanation={explanation} />

        <MoveOptions
          isHandDealt={isHandDealt}
          isSplittable={
            hand !== undefined &&
            hand.playerCard1.rank === hand.playerCard2.rank
          }
          onDealCards={dealCards}
          makeMove={makeMove}
        />
      </div>

      <ModalFloat
        isOpen={isHowToPlayOpen}
        closeModal={() => setIsHowToPlayOpen(false)}
      >
        <HowToPlay />
      </ModalFloat>

      <ModalFullPage
        title='Statistics'
        isOpen={isStatisticsOpen}
        closeModal={() => setIsStatisticsOpen(false)}
      >
        <Statistics
          stats={stats}
          resetHandStat={resetHandStat}
          resetAllHandStatsOfHandType={resetAllHandStatsOfHandType}
        />
      </ModalFullPage>

      <ModalFullPage
        title='Settings'
        isOpen={isSettingsOpen}
        closeModal={() => setIsSettingsOpen(false)}
      >
        <Settings
          selectedPracticeType={selectedPracticeType}
          setSelectedPracticeType={setSelectedPracticeType}
          stats={stats}
          importStats={setStats}
          saveFrequency={saveFrequency.current}
          setSaveFrequency={setSaveFrequency}
        />
      </ModalFullPage>

      <ModalFloat
        isOpen={isUpdatePasswordOpen}
        closeModal={() => setIsUpdatePasswordOpen(false)}
        colorMode='alternate'
      >
        <UpdatePassword updatePassword={updatePassword} />
      </ModalFloat>
    </>
  );
};

export default Home;
