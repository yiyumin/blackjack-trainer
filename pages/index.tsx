import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';

import { Move } from '../types';

import Header from '../components/Header';
import MainBoard from '../components/MainBoard';
import ModalFloat from '../components/ModalFloat';
import Settings from '../components/Settings';
import MoveOptions from '../components/MoveOptions';
import Result from '../components/Result';
import ModalFullPage from '../components/ModalFullPage';
import Statistics from '../components/Statistics';
import HowToPlay from '../components/HowToPlay';
import { useBlackjack } from '../hooks/useBlackjack';

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

  const {
    stats,
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
  } = useBlackjack();

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
          openHowToPlay={() => setIsHowToPlayOpen(true)}
          openStatistics={() => setIsStatisticsOpen(true)}
          openSettings={() => setIsSettingsOpen(true)}
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
        />
      </ModalFullPage>
    </>
  );
};

export default Home;
