const suits = ['♠', '♣', '♥', '♦'] as const;
type Suit = typeof suits[number];

const ranks = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
] as const;
type Rank = typeof ranks[number];

type Card = {
  suit: Suit;
  rank: Rank;
};

type Hand = {
  dealerCard: Card;
  playerCard1: Card;
  playerCard2: Card;
};

type Move = 'hit' | 'stand' | 'double_down' | 'split' | 'surrender';

type ChartMove =
  | 'H'
  | 'S'
  | 'Dh'
  | 'Ds'
  | 'P'
  | 'Ph'
  | 'Pd'
  | 'Rh'
  | 'Rs'
  | 'Rp';

type Stats = {
  pairs: HandStat<PairKey>[];
  softHands: HandStat<SoftHandKey>[];
  hardHands: HandStat<HardHandKey>[];
};

const simpleRanks = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'A',
] as const;
type SimpleRank = typeof simpleRanks[number];

type DealerKey = SimpleRank;

const pairKeys = simpleRanks;
type PairKey = SimpleRank;

const softHandKeys = ['2', '3', '4', '5', '6', '7', '8', '9'] as const;
type SoftHandKey = typeof softHandKeys[number];

const hardHandKeys = [
  '8-',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17+',
] as const;
type HardHandKey = typeof hardHandKeys[number];

type HandKey = SimpleRank | HardHandKey;

type HandStat<KeyType extends string> = {
  playerHandKey: KeyType;
  dealerKey: DealerKey;
  modifier?: Modifier;
  timesSeen: number;
  timesCorrect: number;
};

const handTypes = ['pair', 'soft_hand', 'hard_hand'] as const;
type HandType = typeof handTypes[number];

type ModifierType = 'double_down' | 'double_down_after_split' | 'surrender';

type Modifier = {
  type: ModifierType;
  allowed: boolean;
};

type HandStatDisplay<KeyType extends string> = HandStat<KeyType> & {
  handType: HandType;
  modifier?: Modifier;
  correctMove: string;
  correctMoveDetailed: string;
};

type PracticeType = {
  handType: HandType;
  handKey?: HandKey;
};

type HeroIcon = (props: React.ComponentProps<'svg'>) => JSX.Element;

export { suits, ranks, pairKeys, softHandKeys, hardHandKeys, handTypes };
export type {
  Suit,
  Rank,
  Card,
  Hand,
  Move,
  ChartMove,
  Stats,
  HandStat,
  HandType,
  HandStatDisplay,
  PracticeType,
  SimpleRank,
  DealerKey,
  PairKey,
  SoftHandKey,
  HardHandKey,
  HandKey,
  ModifierType,
  Modifier,
  HeroIcon,
};
