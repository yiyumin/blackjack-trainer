import {
  DealerKey,
  PairKey,
  SoftHandKey,
  HardHandKey,
  ChartMove,
} from './types';

export type ChartMap<KeyType extends string> = {
  [key in KeyType]: ChartMove[];
};

const dealerKeyIndex: { [key in DealerKey]: number } = {
  '2': 0,
  '3': 1,
  '4': 2,
  '5': 3,
  '6': 4,
  '7': 5,
  '8': 6,
  '9': 7,
  '10': 8,
  A: 9,
};

// key is one of the 2 cards in the pair hand
const pairChart: ChartMap<PairKey> = {
  '2': ['Ph', 'Ph', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  '3': ['Ph', 'Ph', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  '4': ['H', 'H', 'H', 'Ph', 'Ph', 'H', 'H', 'H', 'H', 'H'],
  '5': ['Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H'],
  '6': ['Ph', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
  '7': ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  '8': ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  '9': ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'],
  '10': ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  A: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
};

// key is the non-'A' rank of the soft hand
const softHandChart: ChartMap<SoftHandKey> = {
  '2': ['H', 'H', 'H', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
  '3': ['H', 'H', 'H', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
  '4': ['H', 'H', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
  '5': ['H', 'H', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
  '6': ['H', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
  '7': ['S', 'Ds', 'Ds', 'Ds', 'Ds', 'S', 'S', 'H', 'H', 'H'],
  '8': ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  '9': ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
};

// key is the total of the 2 ranks (lookup table to be used for '8-' and '17+')
const hardHandChart: ChartMap<HardHandKey> = {
  '8-': ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
  '9': ['H', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
  '10': ['Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H'],
  '11': ['Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'H'],
  '12': ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  '13': ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  '14': ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  '15': ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'Rh', 'H'],
  '16': ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'Rh', 'Rh', 'Rh'],
  '17+': ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
};

export { dealerKeyIndex, pairChart, softHandChart, hardHandChart };
