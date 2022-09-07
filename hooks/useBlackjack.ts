import { useCallback, useState } from 'react';

import {
  DealerKey,
  Hand,
  HandKey,
  HandSettingType,
  HandType,
  Move,
  PracticeType,
  Rank,
  SoftHandKey,
  Stats,
} from '../types';
import {
  convertHardHandTotalValueToKey,
  convertToSimpleRank,
  getCards,
  getHandSettingType,
  getHandTotalValue,
  getMove,
  getMoveVerbose,
} from '../lib/blackjack';

import useLocalStorage from './useLocalStorage';
import { hardHandChart, pairChart, softHandChart } from '../data';
import { useSettings } from '../contexts/SettingsProvider';

const defaultStats: Stats = { pairs: [], softHands: [], hardHands: [] };

const useBlackjack = () => {
  const [stats, setStats] = useLocalStorage(
    'blackjack-stats',
    (): Stats => defaultStats
  );

  const {
    isDoubleDownAllowed,
    isDoubleDownAfterSplitAllowed,
    isSurrenderAllowed,
  } = useSettings();

  const [isHandDealt, setIsHandDealt] = useState(false);
  const [hand, setHand] = useState<Hand>();

  const [isCorrect, setIsCorrect] = useState<boolean>();
  const [explanation, setExplanation] = useState('');

  const [selectedPracticeType, setSelectedPracticeType] =
    useState<PracticeType>();

  const dealCards = useCallback(() => {
    if (isHandDealt) return;

    setHand(
      getCards(selectedPracticeType?.handType, selectedPracticeType?.handKey)
    );
    setIsHandDealt(true);
    setIsCorrect(undefined);
    setExplanation('');
  }, [
    isHandDealt,
    selectedPracticeType?.handType,
    selectedPracticeType?.handKey,
  ]);

  const updateStats = useCallback(
    (rank1: Rank, rank2: Rank, dealerRank: Rank, isCorrect: boolean) => {
      const dealerKey = convertToSimpleRank(dealerRank);

      if (rank1 === rank2) {
        const pairKey = convertToSimpleRank(rank1);
        const handSettingType = getHandSettingType(
          pairChart,
          pairKey,
          dealerKey,
          isDoubleDownAllowed,
          isDoubleDownAfterSplitAllowed,
          isSurrenderAllowed
        );

        setStats((prevStats) => {
          const recordExists = prevStats.pairs.some(
            (handStat) =>
              handStat.playerHandKey === pairKey &&
              handStat.dealerKey === dealerKey &&
              handStat.settingType === handSettingType
          );

          if (recordExists) {
            return {
              ...prevStats,
              pairs: prevStats.pairs.map((handStat) =>
                handStat.playerHandKey === pairKey &&
                handStat.dealerKey === dealerKey &&
                handStat.settingType === handSettingType
                  ? {
                      ...handStat,
                      timesSeen: handStat.timesSeen + 1,
                      timesCorrect: handStat.timesCorrect + (isCorrect ? 1 : 0),
                    }
                  : handStat
              ),
            };
          } else {
            return {
              ...prevStats,
              pairs: [
                ...prevStats.pairs,
                {
                  playerHandKey: pairKey,
                  dealerKey: dealerKey,
                  settingType: handSettingType,
                  timesSeen: 1,
                  timesCorrect: isCorrect ? 1 : 0,
                },
              ],
            };
          }
        });
      } else if (rank1 === 'A' || rank2 === 'A') {
        const softHandKey = (rank1 === 'A' ? rank2 : rank1) as SoftHandKey; // guaranteed not to be an A since the hand cannot be a pair or of value 10 since blackjack's aren't dealt
        const handSettingType = getHandSettingType(
          softHandChart,
          softHandKey,
          dealerKey,
          isDoubleDownAllowed,
          isDoubleDownAfterSplitAllowed,
          isSurrenderAllowed
        );

        setStats((prevStats) => {
          const recordExists = prevStats.softHands.some(
            (handStat) =>
              handStat.playerHandKey === softHandKey &&
              handStat.dealerKey === dealerKey &&
              handStat.settingType === handSettingType
          );

          if (recordExists) {
            return {
              ...prevStats,
              softHands: prevStats.softHands.map((handStat) =>
                handStat.playerHandKey === softHandKey &&
                handStat.dealerKey === dealerKey &&
                handStat.settingType === handSettingType
                  ? {
                      ...handStat,
                      timesSeen: handStat.timesSeen + 1,
                      timesCorrect: handStat.timesCorrect + (isCorrect ? 1 : 0),
                    }
                  : handStat
              ),
            };
          } else {
            return {
              ...prevStats,
              softHands: [
                ...prevStats.softHands,
                {
                  playerHandKey: softHandKey,
                  dealerKey: dealerKey,
                  settingType: handSettingType,
                  timesSeen: 1,
                  timesCorrect: isCorrect ? 1 : 0,
                },
              ],
            };
          }
        });
      } else {
        const hardHandKey = convertHardHandTotalValueToKey(
          getHandTotalValue(rank1, rank2)
        );
        const handSettingType = getHandSettingType(
          hardHandChart,
          hardHandKey,
          dealerKey,
          isDoubleDownAllowed,
          isDoubleDownAfterSplitAllowed,
          isSurrenderAllowed
        );

        setStats((prevStats) => {
          const recordExists = prevStats.hardHands.some(
            (handStat) =>
              handStat.playerHandKey === hardHandKey &&
              handStat.dealerKey === dealerKey &&
              handStat.settingType === handSettingType
          );

          if (recordExists) {
            return {
              ...prevStats,
              hardHands: prevStats.hardHands.map((handStat) =>
                handStat.playerHandKey === hardHandKey &&
                handStat.dealerKey === dealerKey &&
                handStat.settingType === handSettingType
                  ? {
                      ...handStat,
                      timesSeen: handStat.timesSeen + 1,
                      timesCorrect: handStat.timesCorrect + (isCorrect ? 1 : 0),
                    }
                  : handStat
              ),
            };
          } else {
            return {
              ...prevStats,
              hardHands: [
                ...prevStats.hardHands,
                {
                  playerHandKey: hardHandKey,
                  dealerKey: dealerKey,
                  settingType: handSettingType,
                  timesSeen: 1,
                  timesCorrect: isCorrect ? 1 : 0,
                },
              ],
            };
          }
        });
      }
    },
    [
      isDoubleDownAllowed,
      isDoubleDownAfterSplitAllowed,
      isSurrenderAllowed,
      setStats,
    ]
  );

  const makeMove = useCallback(
    (move: Move) => {
      if (!isHandDealt || hand === undefined) return;

      if (
        (move === 'split' && hand.playerCard1.rank !== hand.playerCard2.rank) ||
        (move === 'double_down' && !isDoubleDownAllowed) ||
        (move === 'surrender' && !isSurrenderAllowed)
      )
        return;

      setIsHandDealt(false);
      const correctMove = getMove(
        isDoubleDownAllowed,
        isDoubleDownAfterSplitAllowed,
        isSurrenderAllowed,
        hand
      );
      const correctMoveVerbose = getMoveVerbose(hand);

      setIsCorrect(move === correctMove);
      setExplanation(
        `The correct move is to ${correctMoveVerbose} in this scenario.`
      );

      updateStats(
        hand.playerCard1.rank,
        hand.playerCard2.rank,
        hand.dealerCard.rank,
        move === correctMove
      );
    },
    [
      isHandDealt,
      hand,
      isDoubleDownAllowed,
      isDoubleDownAfterSplitAllowed,
      isSurrenderAllowed,
      updateStats,
    ]
  );

  const resetHandStat = useCallback(
    (
      handType: HandType,
      handSettingType: HandSettingType,
      playerHandKey: HandKey,
      dealerKey: DealerKey
    ) => {
      if (handType === 'pair') {
        setStats((prevStats) => ({
          ...prevStats,
          pairs: prevStats.pairs.filter(
            (pair) =>
              pair.playerHandKey !== playerHandKey ||
              pair.dealerKey !== dealerKey ||
              pair.settingType !== handSettingType
          ),
        }));
      } else if (handType === 'soft_hand') {
        setStats((prevStats) => ({
          ...prevStats,
          softHands: prevStats.softHands.filter(
            (softHand) =>
              softHand.playerHandKey !== playerHandKey ||
              softHand.dealerKey !== dealerKey ||
              softHand.settingType !== handSettingType
          ),
        }));
      } else {
        setStats((prevStats) => ({
          ...prevStats,
          hardHands: prevStats.hardHands.filter(
            (hardHands) =>
              hardHands.playerHandKey !== playerHandKey ||
              hardHands.dealerKey !== dealerKey ||
              hardHands.settingType !== handSettingType
          ),
        }));
      }
    },
    [setStats]
  );

  const resetAllHandStatsOfHandType = useCallback(
    (handType?: HandType) => {
      if (handType === 'pair') {
        setStats((prevStats) => ({
          ...prevStats,
          pairs: [],
        }));
      } else if (handType === 'soft_hand') {
        setStats((prevStats) => ({
          ...prevStats,
          softHands: [],
        }));
      } else if (handType === 'hard_hand') {
        setStats((prevStats) => ({
          ...prevStats,
          hardHands: [],
        }));
      } else {
        setStats(defaultStats);
      }
    },
    [setStats]
  );

  return {
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
  };
};

export { useBlackjack };
