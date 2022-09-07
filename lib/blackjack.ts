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
  HandSettingType,
} from '../types';
import { pairChart, softHandChart, hardHandChart, ChartMap } from '../data';

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

const getMoveForPairs = (
  isDoubleDownAllowed: boolean,
  isDoubleDownAfterSplitAllowed: boolean,
  dealerKey: DealerKey,
  pairKey: PairKey
): Move => {
  return (
    (isDoubleDownAllowed &&
      pairChart[pairKey].facing[dealerKey].doubleDownAllowedMove) ||
    (isDoubleDownAfterSplitAllowed &&
      pairChart[pairKey].facing[dealerKey].doubleDownAfterSplitAllowedMove) ||
    pairChart[pairKey].facing[dealerKey].move
  );
};

const getMoveForSoftHands = (
  isDoubleDownAllowed: boolean,
  dealerKey: DealerKey,
  softHandKey: SoftHandKey
): Move => {
  return (
    (isDoubleDownAllowed &&
      softHandChart[softHandKey].facing[dealerKey].doubleDownAllowedMove) ||
    softHandChart[softHandKey].facing[dealerKey].move
  );
};

const getMoveForHardHands = (
  isDoubleDownAllowed: boolean,
  isSurrenderAllowed: boolean,
  dealerKey: DealerKey,
  hardHandKey: HardHandKey
): Move => {
  return (
    (isDoubleDownAllowed &&
      hardHandChart[hardHandKey].facing[dealerKey].doubleDownAllowedMove) ||
    (isSurrenderAllowed &&
      hardHandChart[hardHandKey].facing[dealerKey].surrenderAllowedMove) ||
    hardHandChart[hardHandKey].facing[dealerKey].move
  );
};

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
    return getMoveForPairs(
      isDoubleDownAllowed,
      isDoubleDownAfterSplitAllowed,
      dealerRank,
      rank1
    );
  }

  if (rank1 === 'A' || rank2 === 'A') {
    return getMoveForSoftHands(
      isDoubleDownAllowed,
      dealerRank,
      (rank1 === 'A' ? rank2 : rank1) as SoftHandKey // guaranteed not to be an A since the hand cannot be a pair or of value 10 since blackjack's aren't dealt
    );
  }

  return getMoveForHardHands(
    isDoubleDownAllowed,
    isSurrenderAllowed,
    dealerRank,
    convertHardHandTotalValueToKey(getHandTotalValue(rank1, rank2))
  );
};

const getMoveVerboseForPairs = (dealerKey: DealerKey, pairKey: PairKey) => {
  if ('doubleDownAllowedMove' in pairChart[pairKey].facing[dealerKey]) {
    return `${
      MOVE_TEXT['double_down']
    } if doubling down is possible, otherwise ${
      MOVE_TEXT[pairChart[pairKey].facing[dealerKey].move]
    }`;
  }

  if (
    'doubleDownAfterSplitAllowedMove' in pairChart[pairKey].facing[dealerKey]
  ) {
    return `${
      MOVE_TEXT['split']
    } if doubling down after splits is possible, otherwise ${
      MOVE_TEXT[pairChart[pairKey].facing[dealerKey].move]
    }`;
  }

  return `always ${MOVE_TEXT[pairChart[pairKey].facing[dealerKey].move]}`;
};

const getMoveVerboseForSoftHands = (
  dealerKey: DealerKey,
  softHandKey: SoftHandKey
) => {
  if ('doubleDownAllowedMove' in softHandChart[softHandKey].facing[dealerKey]) {
    return `${
      MOVE_TEXT['double_down']
    } if doubling down is possible, otherwise ${
      MOVE_TEXT[softHandChart[softHandKey].facing[dealerKey].move]
    }`;
  }

  return `always ${
    MOVE_TEXT[softHandChart[softHandKey].facing[dealerKey].move]
  }`;
};

const getMoveVerboseForHardHands = (
  dealerKey: DealerKey,
  hardHandKey: HardHandKey
) => {
  if ('doubleDownAllowedMove' in hardHandChart[hardHandKey].facing[dealerKey]) {
    return `${
      MOVE_TEXT['double_down']
    } if doubling down is possible, otherwise ${
      MOVE_TEXT[hardHandChart[hardHandKey].facing[dealerKey].move]
    }`;
  }

  if ('surrenderAllowedMove' in hardHandChart[hardHandKey].facing[dealerKey]) {
    return `${MOVE_TEXT['surrender']} if surrendering is possible, otherwise ${
      MOVE_TEXT[hardHandChart[hardHandKey].facing[dealerKey].move]
    }`;
  }

  return `always ${
    MOVE_TEXT[hardHandChart[hardHandKey].facing[dealerKey].move]
  }`;
};

const getMoveVerbose = (hand: Hand) => {
  const rank1 = convertToSimpleRank(hand.playerCard1.rank);
  const rank2 = convertToSimpleRank(hand.playerCard2.rank);
  const dealerRank = convertToSimpleRank(hand.dealerCard.rank);

  if (hand.playerCard1.rank === hand.playerCard2.rank) {
    return getMoveVerboseForPairs(dealerRank, rank1);
  }

  if (rank1 === 'A' || rank2 === 'A') {
    return getMoveVerboseForSoftHands(
      dealerRank,
      (rank1 === 'A' ? rank2 : rank1) as SoftHandKey // guaranteed not to be an A since the hand cannot be a pair or of value 10 since blackjack's aren't dealt
    );
  }

  return getMoveVerboseForHardHands(
    dealerRank,
    convertHardHandTotalValueToKey(getHandTotalValue(rank1, rank2))
  );
};

const getHandStatsToDisplay = (stats: Stats): HandStatDisplay<HandKey>[] => {
  const readablePairStats: HandStatDisplay<PairKey>[] = stats.pairs.map(
    (pairStat) => {
      const isDoubleDownAllowed =
        'doubleDownAllowedMove' in
        pairChart[pairStat.playerHandKey].facing[pairStat.dealerKey];
      const isDoubleDownAfterSplitAllowed =
        'doubleDownAfterSplitAllowedMove' in
        pairChart[pairStat.playerHandKey].facing[pairStat.dealerKey];

      const hasModifier = isDoubleDownAllowed || isDoubleDownAfterSplitAllowed;
      const modifier = `when ${
        isDoubleDownAllowed ? 'doubling down' : 'doubling down after splits'
      } is ${pairStat.settingType === 'default' ? 'not ' : ''}possible`;
      const correctMove = getMoveForPairs(
        pairStat.settingType === 'double_down_allowed',
        pairStat.settingType === 'double_down_after_split_allowed',
        pairStat.dealerKey,
        pairStat.playerHandKey
      );
      const correctMoveDetailed = `the correct move is to ${getMoveVerboseForPairs(
        pairStat.dealerKey,
        pairStat.playerHandKey
      )}`;

      return {
        ...pairStat,
        handType: 'pair',
        ...(hasModifier && {
          modifier: modifier,
        }),
        correctMove:
          correctMove === 'double_down' ? 'double down' : correctMove,
        correctMoveDetailed: correctMoveDetailed,
      };
    }
  );

  const readableSoftHandStats: HandStatDisplay<SoftHandKey>[] =
    stats.softHands.map((softHandStat) => {
      const hasModifier =
        'doubleDownAllowedMove' in
        softHandChart[softHandStat.playerHandKey].facing[
          softHandStat.dealerKey
        ];
      const modifier = `when doubling down is ${
        softHandStat.settingType === 'default' ? 'not ' : ''
      }possible`;
      const correctMove = getMoveForSoftHands(
        softHandStat.settingType === 'double_down_allowed',
        softHandStat.dealerKey,
        softHandStat.playerHandKey
      );

      const correctMoveDetailed = `the correct move is to ${getMoveVerboseForSoftHands(
        softHandStat.dealerKey,
        softHandStat.playerHandKey
      )}`;

      return {
        ...softHandStat,
        handType: 'soft_hand',
        ...(hasModifier && {
          modifier: modifier,
        }),
        correctMove:
          correctMove === 'double_down' ? 'double down' : correctMove,
        correctMoveDetailed: correctMoveDetailed,
      };
    });

  const readableHardHandStats: HandStatDisplay<HardHandKey>[] =
    stats.hardHands.map((hardHandStat) => {
      const isDoubleDownAllowed =
        'doubleDownAllowedMove' in
        hardHandChart[hardHandStat.playerHandKey].facing[
          hardHandStat.dealerKey
        ];
      const isSurrenderAllowed =
        'surrenderAllowedMove' in
        hardHandChart[hardHandStat.playerHandKey].facing[
          hardHandStat.dealerKey
        ];

      const hasModifier = isDoubleDownAllowed || isSurrenderAllowed;
      const modifier = `when ${
        isDoubleDownAllowed ? 'doubling down' : 'surrendering'
      } is ${hardHandStat.settingType === 'default' ? 'not ' : ''}possible`;
      const correctMove = getMoveForHardHands(
        hardHandStat.settingType === 'double_down_allowed',
        hardHandStat.settingType === 'surrender_allowed',
        hardHandStat.dealerKey,
        hardHandStat.playerHandKey
      );
      const correctMoveDetailed = `the correct move is to ${getMoveVerboseForHardHands(
        hardHandStat.dealerKey,
        hardHandStat.playerHandKey
      )}`;

      return {
        ...hardHandStat,
        handType: 'hard_hand',
        ...(hasModifier && {
          modifier: modifier,
        }),
        correctMove:
          correctMove === 'double_down' ? 'double down' : correctMove,
        correctMoveDetailed: correctMoveDetailed,
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

const getHandSettingType = <KeyType extends string>(
  chart: ChartMap<KeyType>,
  playerKey: KeyType,
  dealerKey: DealerKey,
  isDoubleDownAllowed: boolean,
  isDoubleDownAfterSplitAllowed: boolean,
  isSurrenderAllowed: boolean
): HandSettingType => {
  if (
    isDoubleDownAllowed &&
    'doubleDownAllowedMove' in chart[playerKey].facing[dealerKey]
  ) {
    return 'double_down_allowed';
  }

  if (
    isDoubleDownAfterSplitAllowed &&
    'doubleDownAfterSplitAllowedMove' in chart[playerKey].facing[dealerKey]
  ) {
    return 'double_down_after_split_allowed';
  }

  if (
    isSurrenderAllowed &&
    'surrenderAllowedMove' in chart[playerKey].facing[dealerKey]
  ) {
    return 'surrender_allowed';
  }

  return 'default';
};

export {
  MOVE_TEXT,
  getCards,
  getMove,
  getMoveVerbose,
  convertToSimpleRank,
  getHandTotalValue,
  convertHardHandTotalValueToKey,
  getHandStatsToDisplay,
  getHandFriendlyName,
  getHandSettingType,
};
