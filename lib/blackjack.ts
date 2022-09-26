import {
  suits,
  ranks,
  Rank,
  Card,
  Move,
  HandType,
  Suit,
  HandStatDisplay,
  Stats,
  SimpleRank,
  PairKey,
  SoftHandKey,
  DealerKey,
  HardHandKey,
  HandKey,
  pairKeys,
  hardHandKeys,
  softHandKeys,
  Hand,
  ModifierType,
  ChartMove,
  Modifier,
} from './types';
import {
  pairChart,
  softHandChart,
  hardHandChart,
  ChartMap,
  dealerKeyIndex,
} from './charts';
import { statsSchema } from './validator';

const RANK_VALUE: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 10,
  Q: 10,
  K: 10,
  A: 11,
};

const MOVE_TEXT: Record<Move, string> = {
  hit: 'hit',
  stand: 'stand',
  double_down: 'double down',
  split: 'split the cards',
  surrender: 'surrender',
};

const MODIFIER_TEXT: Record<ModifierType, string> = {
  double_down: 'doubling down',
  double_down_after_split: 'doubling down after splits',
  surrender: 'surrendering',
};

// returns a random integer in range [floor, ceiling).
const getRandomInteger = (ceiling: number, floor: number = 0): number =>
  Math.floor(Math.random() * (ceiling - floor) + floor);

const getRandomCard = (rank?: Rank, suit?: Suit): Card => ({
  rank: rank || ranks[getRandomInteger(ranks.length)],
  suit: suit || suits[getRandomInteger(suits.length)],
});

const value10Cards: Rank[] = ['10', 'J', 'Q', 'K'];

const getRandomRankOfValue10 = () =>
  value10Cards[getRandomInteger(value10Cards.length)];

const convertSimpleRankToRandomRank = (
  simpleRank?: SimpleRank
): Rank | undefined => {
  if (simpleRank === '10') {
    return getRandomRankOfValue10();
  }

  return simpleRank;
};

const getCards = (handType?: HandType, handKey?: HandKey): Hand => {
  if (handType === 'pair') {
    if (handKey == null || pairKeys.some((pk) => pk === handKey)) {
      return getPairCards(handKey as PairKey);
    }

    throw new Error(
      `Invalid handKey type of ${handKey} provided for pair hand. Must be of type PairKey.`
    );
  }

  if (handType === 'soft_hand') {
    if (handKey == null || softHandKeys.some((shk) => shk === handKey)) {
      return getSoftHandCards(handKey as SoftHandKey);
    }

    throw new Error(
      `Invalid handKey type of ${handKey} provided for soft hand. Must be of type SoftHandKey.`
    );
  }

  if (handType === 'hard_hand') {
    if (handKey == null || hardHandKeys.some((hhk) => hhk === handKey)) {
      return getHardHandCards(handKey as HardHandKey);
    }

    throw new Error(
      `Invalid handKey type of ${handKey} provided for hard hand. Must be of type HardHandKey.`
    );
  }

  const dealerCard = getRandomCard();
  let playerCard1 = getRandomCard();
  let playerCard2 = getRandomCard();

  // ensure player isn't dealt a blackjack
  while (getHandTotalValue(playerCard1.rank, playerCard2.rank) === 21) {
    playerCard1 = getRandomCard();
    playerCard2 = getRandomCard();
  }

  return { dealerCard, playerCard1, playerCard2 };
};

const getPairCards = (pairKey?: PairKey): Hand => {
  const rank = convertSimpleRankToRandomRank(pairKey);

  const dealerCard = getRandomCard();
  const playerCard1 = getRandomCard(rank);
  const playerCard2 = getRandomCard(playerCard1.rank);

  return { dealerCard, playerCard1, playerCard2 };
};

const getSoftHandCards = (softHandKey?: SoftHandKey): Hand => {
  const dealerCard = getRandomCard();
  const playerCard1 = getRandomCard('A');
  let playerCard2 = getRandomCard(softHandKey);

  while (RANK_VALUE[playerCard2.rank] >= 10) {
    playerCard2 = getRandomCard();
  }

  return { dealerCard, playerCard1, playerCard2 };
};

const getHardHandCards = (hardHandKey?: HardHandKey): Hand => {
  const dealerCard = getRandomCard();

  if (hardHandKey != null) {
    const handTotal = convertHardHandKeyToRandomValue(hardHandKey);
    let cardRank = getRandomInteger(
      Math.min(handTotal - 1, 11),
      Math.max(handTotal - 10, 2)
    );

    while (cardRank === handTotal / 2 && cardRank !== 10) {
      cardRank = getRandomInteger(
        Math.min(handTotal - 1, 11),
        Math.max(handTotal - 10, 2)
      );
    }

    let playerCard1 = getRandomCard(
      convertSimpleRankToRandomRank(cardRank.toString() as SimpleRank) // cardRank is a random number between 2 minimum and 10 maximum
    );
    let playerCard2 = getRandomCard(
      convertSimpleRankToRandomRank(
        (handTotal - cardRank).toString() as SimpleRank // cardRank is generated so that handTotal - cardRank is always between 2 minimum and 10 maximum
      )
    );

    while (playerCard1.rank === playerCard2.rank) {
      playerCard2 = getRandomCard(
        convertSimpleRankToRandomRank(
          (handTotal - cardRank).toString() as SimpleRank
        )
      );
    }

    return { dealerCard, playerCard1, playerCard2 };
  }

  let playerCard1 = getRandomCard();
  let playerCard2 = getRandomCard();

  while (playerCard1.rank === 'A') {
    playerCard1 = getRandomCard();
  }

  while (playerCard1.rank === playerCard2.rank || playerCard2.rank === 'A') {
    playerCard2 = getRandomCard();
  }

  return { dealerCard, playerCard1, playerCard2 };
};

const convertToSimpleRank = (rank: Rank): SimpleRank => {
  if (['J', 'Q', 'K'].includes(rank)) {
    return '10';
  }

  return rank as SimpleRank;
};

const isModifierAllowed = (type: ModifierType, modifier?: Modifier) => {
  return modifier !== undefined && modifier.type === type && modifier.allowed;
};

const convertChartMoveToMove = (
  chartMove: ChartMove,
  isDoubleDownAllowed: boolean,
  isDoubleDownAfterSplitAllowed: boolean,
  isSurrenderAllowed: boolean
): Move => {
  switch (chartMove) {
    case 'H':
      return 'hit';
    case 'S':
      return 'stand';
    case 'Dh':
      return isDoubleDownAllowed ? 'double_down' : 'hit';
    case 'Ds':
      return isDoubleDownAllowed ? 'double_down' : 'stand';
    case 'P':
      return 'split';
    case 'Ph':
      return isDoubleDownAfterSplitAllowed ? 'split' : 'hit';
    case 'Pd':
      return isDoubleDownAfterSplitAllowed ? 'split' : 'double_down';
    case 'Rh':
      return isSurrenderAllowed ? 'surrender' : 'hit';
    case 'Rs':
      return isSurrenderAllowed ? 'surrender' : 'stand';
    case 'Rp':
      return isSurrenderAllowed ? 'surrender' : 'split';
    default:
      throw new Error(`${chartMove} is not a valid chart move.`);
  }
};

const getChartMove = <KeyType extends string>(
  chart: ChartMap<KeyType>,
  dealerKey: DealerKey,
  handKey: KeyType
) => chart[handKey][dealerKeyIndex[dealerKey]];

const getHandTotalValue = (rank1: Rank, rank2: Rank): number => {
  return RANK_VALUE[rank1] + RANK_VALUE[rank2];
};

const convertHardHandTotalValueToKey = (hardHandTotal: number): HardHandKey => {
  if (hardHandTotal <= 8) {
    return '8-';
  }
  if (hardHandTotal >= 17) {
    return '17+';
  }

  return hardHandTotal.toString() as HardHandKey; // hardHandTotal is between 9 and 16
};

const convertHardHandKeyToRandomValue = (hardHandKey: HardHandKey): number => {
  if (hardHandKey === '8-') {
    return [5, 6, 7, 8][getRandomInteger(4)];
  }
  if (hardHandKey === '17+') {
    return [17, 18, 19, 20][getRandomInteger(4)];
  }

  return parseInt(hardHandKey);
};

const getMove = (
  isDoubleDownAllowed: boolean,
  isDoubleDownAfterSplitAllowed: boolean,
  isSurrenderAllowed: boolean,
  hand: Hand
): Move => {
  const rank1 = convertToSimpleRank(hand.playerCard1.rank);
  const rank2 = convertToSimpleRank(hand.playerCard2.rank);
  const dealerRank = convertToSimpleRank(hand.dealerCard.rank);

  if (hand.playerCard1.rank === hand.playerCard2.rank) {
    return convertChartMoveToMove(
      getChartMove(pairChart, dealerRank, rank1),
      isDoubleDownAllowed,
      isDoubleDownAfterSplitAllowed,
      isSurrenderAllowed
    );
  }

  if (rank1 === 'A' || rank2 === 'A') {
    return convertChartMoveToMove(
      getChartMove(
        softHandChart,
        dealerRank,
        (rank1 === 'A' ? rank2 : rank1) as SoftHandKey // guaranteed not to be an A since the hand cannot be a pair or of value 10 since blackjack's aren't dealt
      ),
      isDoubleDownAllowed,
      isDoubleDownAfterSplitAllowed,
      isSurrenderAllowed
    );
  }

  return convertChartMoveToMove(
    getChartMove(
      hardHandChart,
      dealerRank,
      convertHardHandTotalValueToKey(getHandTotalValue(rank1, rank2))
    ),
    isDoubleDownAllowed,
    isDoubleDownAfterSplitAllowed,
    isSurrenderAllowed
  );
};

const getMoveVerboseForChartMove = (chartMove: ChartMove): string => {
  switch (chartMove) {
    case 'H':
      return 'always hit';
    case 'S':
      return 'always stand';
    case 'Dh':
      return 'double down if doubling down is possible, otherwise hit';
    case 'Ds':
      return 'double down if doubling down is possible, otherwise stand';
    case 'P':
      return 'always split';
    case 'Ph':
      return 'split if doubling down after splits is possible, otherwise hit';
    case 'Pd':
      return 'split if doubling down after splits is possible, otherwise double down';
    case 'Rh':
      return 'surrender if surrendering is possible, otherwise hit';
    case 'Rs':
      return 'surrender if surrendering is possible, otherwise stand';
    case 'Rp':
      return 'surrender if surrendering is possible, otherwise split';
    default:
      throw new Error(`${chartMove} is not a valid chart move.`);
  }
};

const getMoveVerbose = (hand: Hand): string => {
  const rank1 = convertToSimpleRank(hand.playerCard1.rank);
  const rank2 = convertToSimpleRank(hand.playerCard2.rank);
  const dealerRank = convertToSimpleRank(hand.dealerCard.rank);

  if (hand.playerCard1.rank === hand.playerCard2.rank) {
    return getMoveVerboseForChartMove(
      getChartMove(pairChart, dealerRank, rank1)
    );
  }

  if (rank1 === 'A' || rank2 === 'A') {
    return getMoveVerboseForChartMove(
      getChartMove(
        softHandChart,
        dealerRank,
        (rank1 === 'A' ? rank2 : rank1) as SoftHandKey // guaranteed not to be an A since the hand cannot be a pair or of value 10 since blackjack's aren't dealt
      )
    );
  }

  return getMoveVerboseForChartMove(
    getChartMove(
      hardHandChart,
      dealerRank,
      convertHardHandTotalValueToKey(getHandTotalValue(rank1, rank2))
    )
  );
};

const getModifierForChartMove = (
  chartMove: ChartMove,
  isDoubleDownAllowed: boolean,
  isDoubleDownAfterSplitAllowed: boolean,
  isSurrenderAllowed: boolean
): Modifier | undefined => {
  switch (chartMove) {
    case 'H':
    case 'S':
    case 'P':
      return undefined;
    case 'Dh':
    case 'Ds':
      return {
        type: 'double_down',
        allowed: isDoubleDownAllowed,
      };
    case 'Ph':
    case 'Pd':
      return {
        type: 'double_down_after_split',
        allowed: isDoubleDownAfterSplitAllowed,
      };
    case 'Rh':
    case 'Rs':
    case 'Rp':
      return {
        type: 'surrender',
        allowed: isSurrenderAllowed,
      };
    default:
      throw new Error(`${chartMove} is not a valid chart move.`);
  }
};

const getHandStatsToDisplay = (stats: Stats): HandStatDisplay<HandKey>[] => {
  const readablePairStats: HandStatDisplay<PairKey>[] = stats.pairs.map(
    (pairStat) => {
      const chartMove = getChartMove(
        pairChart,
        pairStat.dealerKey,
        pairStat.playerHandKey
      );
      const correctMove = convertChartMoveToMove(
        chartMove,
        isModifierAllowed('double_down', pairStat.modifier),
        isModifierAllowed('double_down_after_split', pairStat.modifier),
        isModifierAllowed('surrender', pairStat.modifier)
      );

      return {
        ...pairStat,
        handType: 'pair',
        correctMove:
          correctMove === 'double_down' ? 'double down' : correctMove,
        correctMoveDetailed: `the correct move is to ${getMoveVerboseForChartMove(
          chartMove
        )}`,
      };
    }
  );

  const readableSoftHandStats: HandStatDisplay<SoftHandKey>[] =
    stats.softHands.map((softHandStat) => {
      const chartMove = getChartMove(
        softHandChart,
        softHandStat.dealerKey,
        softHandStat.playerHandKey
      );
      const correctMove = convertChartMoveToMove(
        chartMove,
        isModifierAllowed('double_down', softHandStat.modifier),
        isModifierAllowed('double_down_after_split', softHandStat.modifier),
        isModifierAllowed('surrender', softHandStat.modifier)
      );

      return {
        ...softHandStat,
        handType: 'soft_hand',
        correctMove:
          correctMove === 'double_down' ? 'double down' : correctMove,
        correctMoveDetailed: `the correct move is to ${getMoveVerboseForChartMove(
          chartMove
        )}`,
      };
    });

  const readableHardHandStats: HandStatDisplay<HardHandKey>[] =
    stats.hardHands.map((hardHandStat) => {
      const chartMove = getChartMove(
        hardHandChart,
        hardHandStat.dealerKey,
        hardHandStat.playerHandKey
      );
      const correctMove = convertChartMoveToMove(
        chartMove,
        isModifierAllowed('double_down', hardHandStat.modifier),
        isModifierAllowed('double_down_after_split', hardHandStat.modifier),
        isModifierAllowed('surrender', hardHandStat.modifier)
      );

      return {
        ...hardHandStat,
        handType: 'hard_hand',
        correctMove:
          correctMove === 'double_down' ? 'double down' : correctMove,
        correctMoveDetailed: `the correct move is to ${getMoveVerboseForChartMove(
          chartMove
        )}`,
      };
    });

  const readableStats = [
    ...readablePairStats,
    ...readableSoftHandStats,
    ...readableHardHandStats,
  ];

  return readableStats;
};

const getHandFriendlyName = (handType?: HandType, handKey?: HandKey) => {
  if (handType == null && handKey == null) {
    return 'All Hands';
  }

  if (handKey == null) {
    if (handType == 'pair') {
      return 'Pair Hands';
    }

    if (handType == 'soft_hand') {
      return 'Soft Hands';
    }

    return 'Hard Hands';
  }

  if (handType === 'pair') {
    return `Pair ${handKey}'s${handKey === '10' ? ' (J/Q/K)' : ''}`;
  }

  if (handType === 'soft_hand') {
    return `A-${handKey} (Soft ${parseInt(handKey) + 11})`;
  }

  return `Hard ${handKey}`;
};

const getModifier = <KeyType extends string>(
  chart: ChartMap<KeyType>,
  playerKey: KeyType,
  dealerKey: DealerKey,
  isDoubleDownAllowed: boolean,
  isDoubleDownAfterSplitAllowed: boolean,
  isSurrenderAllowed: boolean
): Modifier | undefined => {
  const chartMove = getChartMove(chart, dealerKey, playerKey);
  return getModifierForChartMove(
    chartMove,
    isDoubleDownAllowed,
    isDoubleDownAfterSplitAllowed,
    isSurrenderAllowed
  );
};

const validateStats = (unvalidatedStats: any) => {
  const { value, error } = statsSchema.validate(unvalidatedStats);
  return [!error, value as Stats] as const;
};

export {
  MOVE_TEXT,
  MODIFIER_TEXT,
  getCards,
  getMove,
  getMoveVerbose,
  convertToSimpleRank,
  getHandTotalValue,
  convertHardHandTotalValueToKey,
  getHandStatsToDisplay,
  getHandFriendlyName,
  getModifier,
  validateStats,
};
