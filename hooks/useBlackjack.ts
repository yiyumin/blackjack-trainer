import { useCallback, useState } from 'react';

import {
  DealerKey,
  Hand,
  HandKey,
  HandType,
  Modifier,
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
  getHandTotalValue,
  getModifier,
  getMove,
  getMoveVerbose,
} from '../lib/blackjack';

import useLocalStorage from './useLocalStorage';
import { hardHandChart, pairChart, softHandChart } from '../data';
import { useSettings } from '../contexts/SettingsProvider';
import { statsSchema } from '../lib/validator';

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
        const modifier = getModifier(
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
              ((handStat.modifier === undefined && modifier === undefined) ||
                (handStat.modifier !== undefined &&
                  modifier !== undefined &&
                  handStat.modifier.type === modifier.type &&
                  handStat.modifier.allowed === modifier.allowed))
          );

          if (recordExists) {
            return {
              ...prevStats,
              pairs: prevStats.pairs.map((handStat) =>
                handStat.playerHandKey === pairKey &&
                handStat.dealerKey === dealerKey &&
                ((handStat.modifier === undefined && modifier === undefined) ||
                  (handStat.modifier !== undefined &&
                    modifier !== undefined &&
                    handStat.modifier.type === modifier.type &&
                    handStat.modifier.allowed === modifier.allowed))
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
                  dealerKey,
                  modifier,
                  timesSeen: 1,
                  timesCorrect: isCorrect ? 1 : 0,
                },
              ],
            };
          }
        });
      } else if (rank1 === 'A' || rank2 === 'A') {
        const softHandKey = (rank1 === 'A' ? rank2 : rank1) as SoftHandKey; // guaranteed not to be an A since the hand cannot be a pair or of value 10 since blackjack's aren't dealt
        const modifier = getModifier(
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
              ((handStat.modifier === undefined && modifier === undefined) ||
                (handStat.modifier !== undefined &&
                  modifier !== undefined &&
                  handStat.modifier.type === modifier.type &&
                  handStat.modifier.allowed === modifier.allowed))
          );

          if (recordExists) {
            return {
              ...prevStats,
              softHands: prevStats.softHands.map((handStat) =>
                handStat.playerHandKey === softHandKey &&
                handStat.dealerKey === dealerKey &&
                ((handStat.modifier === undefined && modifier === undefined) ||
                  (handStat.modifier !== undefined &&
                    modifier !== undefined &&
                    handStat.modifier.type === modifier.type &&
                    handStat.modifier.allowed === modifier.allowed))
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
                  dealerKey,
                  modifier,
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
        const modifier = getModifier(
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
              ((handStat.modifier === undefined && modifier === undefined) ||
                (handStat.modifier !== undefined &&
                  modifier !== undefined &&
                  handStat.modifier.type === modifier.type &&
                  handStat.modifier.allowed === modifier.allowed))
          );

          if (recordExists) {
            return {
              ...prevStats,
              hardHands: prevStats.hardHands.map((handStat) =>
                handStat.playerHandKey === hardHandKey &&
                handStat.dealerKey === dealerKey &&
                ((handStat.modifier === undefined && modifier === undefined) ||
                  (handStat.modifier !== undefined &&
                    modifier !== undefined &&
                    handStat.modifier.type === modifier.type &&
                    handStat.modifier.allowed === modifier.allowed))
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
                  dealerKey,
                  modifier,
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
      playerHandKey: HandKey,
      dealerKey: DealerKey,
      modifier?: Modifier
    ) => {
      if (handType === 'pair') {
        setStats((prevStats) => ({
          ...prevStats,
          pairs: prevStats.pairs.filter(
            (pair) =>
              pair.playerHandKey !== playerHandKey ||
              pair.dealerKey !== dealerKey ||
              (pair.modifier === undefined && modifier !== undefined) ||
              (pair.modifier !== undefined && modifier === undefined) ||
              (pair.modifier !== undefined &&
                modifier !== undefined &&
                (pair.modifier.type !== modifier.type ||
                  pair.modifier.allowed !== modifier.allowed))
          ),
        }));
      } else if (handType === 'soft_hand') {
        setStats((prevStats) => ({
          ...prevStats,
          softHands: prevStats.softHands.filter(
            (softHand) =>
              softHand.playerHandKey !== playerHandKey ||
              softHand.dealerKey !== dealerKey ||
              (softHand.modifier === undefined && modifier !== undefined) ||
              (softHand.modifier !== undefined && modifier === undefined) ||
              (softHand.modifier !== undefined &&
                modifier !== undefined &&
                (softHand.modifier.type !== modifier.type ||
                  softHand.modifier.allowed !== modifier.allowed))
          ),
        }));
      } else {
        setStats((prevStats) => ({
          ...prevStats,
          hardHands: prevStats.hardHands.filter(
            (hardHands) =>
              hardHands.playerHandKey !== playerHandKey ||
              hardHands.dealerKey !== dealerKey ||
              (hardHands.modifier === undefined && modifier !== undefined) ||
              (hardHands.modifier !== undefined && modifier === undefined) ||
              (hardHands.modifier !== undefined &&
                modifier !== undefined &&
                (hardHands.modifier.type !== modifier.type ||
                  hardHands.modifier.allowed !== modifier.allowed))
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

  const importStats = useCallback(
    (unvalidatedStats: any) => {
      const { value, error } = statsSchema.validate(unvalidatedStats);

      if (!error) {
        setStats(value);
        return true;
      }

      alert('Invalid save file.');
      return false;
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
    importStats,
  };
};

export { useBlackjack };
