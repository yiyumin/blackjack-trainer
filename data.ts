import { DealerKey, HardHandKey, Move, PairKey, SoftHandKey } from './types';

export type ChartMap<KeyType extends string> = {
  [key in KeyType]: {
    facing: {
      [dealerKey in DealerKey]: {
        move: Move;
        doubleDownAllowedMove?: Move;
        doubleDownAfterSplitAllowedMove?: Move;
        surrenderAllowedMove?: Move;
      };
    };
  };
};

// key is one of the 2 cards in the pair hand
const pairChart: ChartMap<PairKey> = {
  '2': {
    facing: {
      '2': {
        move: 'hit',
        doubleDownAfterSplitAllowedMove: 'split',
      },
      '3': {
        move: 'hit',
        doubleDownAfterSplitAllowedMove: 'split',
      },
      '4': {
        move: 'split',
      },
      '5': {
        move: 'split',
      },
      '6': {
        move: 'split',
      },
      '7': {
        move: 'split',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '3': {
    facing: {
      '2': {
        move: 'hit',
        doubleDownAfterSplitAllowedMove: 'split',
      },
      '3': {
        move: 'hit',
        doubleDownAfterSplitAllowedMove: 'split',
      },
      '4': {
        move: 'split',
      },
      '5': {
        move: 'split',
      },
      '6': {
        move: 'split',
      },
      '7': {
        move: 'split',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '4': {
    facing: {
      '2': {
        move: 'hit',
      },
      '3': {
        move: 'hit',
      },
      '4': {
        move: 'hit',
      },
      '5': {
        move: 'hit',
        doubleDownAfterSplitAllowedMove: 'split',
      },
      '6': {
        move: 'hit',
        doubleDownAfterSplitAllowedMove: 'split',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '5': {
    facing: {
      '2': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '3': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '4': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '5': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '8': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '9': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '6': {
    facing: {
      '2': {
        move: 'hit',
        doubleDownAfterSplitAllowedMove: 'split',
      },
      '3': {
        move: 'split',
      },
      '4': {
        move: 'split',
      },
      '5': {
        move: 'split',
      },
      '6': {
        move: 'split',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '7': {
    facing: {
      '2': {
        move: 'split',
      },
      '3': {
        move: 'split',
      },
      '4': {
        move: 'split',
      },
      '5': {
        move: 'split',
      },
      '6': {
        move: 'split',
      },
      '7': {
        move: 'split',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '8': {
    facing: {
      '2': {
        move: 'split',
      },
      '3': {
        move: 'split',
      },
      '4': {
        move: 'split',
      },
      '5': {
        move: 'split',
      },
      '6': {
        move: 'split',
      },
      '7': {
        move: 'split',
      },
      '8': {
        move: 'split',
      },
      '9': {
        move: 'split',
      },
      '10': {
        move: 'split',
      },
      A: {
        move: 'split',
      },
    },
  },
  '9': {
    facing: {
      '2': {
        move: 'split',
      },
      '3': {
        move: 'split',
      },
      '4': {
        move: 'split',
      },
      '5': {
        move: 'split',
      },
      '6': {
        move: 'split',
      },
      '7': {
        move: 'stand',
      },
      '8': {
        move: 'split',
      },
      '9': {
        move: 'split',
      },
      '10': {
        move: 'stand',
      },
      A: {
        move: 'stand',
      },
    },
  },
  '10': {
    facing: {
      '2': {
        move: 'stand',
      },
      '3': {
        move: 'stand',
      },
      '4': {
        move: 'stand',
      },
      '5': {
        move: 'stand',
      },
      '6': {
        move: 'stand',
      },
      '7': {
        move: 'stand',
      },
      '8': {
        move: 'stand',
      },
      '9': {
        move: 'stand',
      },
      '10': {
        move: 'stand',
      },
      A: {
        move: 'stand',
      },
    },
  },
  A: {
    facing: {
      '2': {
        move: 'split',
      },
      '3': {
        move: 'split',
      },
      '4': {
        move: 'split',
      },
      '5': {
        move: 'split',
      },
      '6': {
        move: 'split',
      },
      '7': {
        move: 'split',
      },
      '8': {
        move: 'split',
      },
      '9': {
        move: 'split',
      },
      '10': {
        move: 'split',
      },
      A: {
        move: 'split',
      },
    },
  },
};

// key is the non-'A' rank of the soft hand
const softHandChart: ChartMap<SoftHandKey> = {
  '2': {
    facing: {
      '2': {
        move: 'hit',
      },
      '3': {
        move: 'hit',
      },
      '4': {
        move: 'hit',
      },
      '5': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '3': {
    facing: {
      '2': {
        move: 'hit',
      },
      '3': {
        move: 'hit',
      },
      '4': {
        move: 'hit',
      },
      '5': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '4': {
    facing: {
      '2': {
        move: 'hit',
      },
      '3': {
        move: 'hit',
      },
      '4': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '5': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '5': {
    facing: {
      '2': {
        move: 'hit',
      },
      '3': {
        move: 'hit',
      },
      '4': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '5': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '6': {
    facing: {
      '2': {
        move: 'hit',
      },
      '3': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '4': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '5': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '7': {
    facing: {
      '2': {
        move: 'stand',
      },
      '3': {
        move: 'stand',
        doubleDownAllowedMove: 'double_down',
      },
      '4': {
        move: 'stand',
        doubleDownAllowedMove: 'double_down',
      },
      '5': {
        move: 'stand',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'stand',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'stand',
      },
      '8': {
        move: 'stand',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '8': {
    facing: {
      '2': {
        move: 'stand',
      },
      '3': {
        move: 'stand',
      },
      '4': {
        move: 'stand',
      },
      '5': {
        move: 'stand',
      },
      '6': {
        move: 'stand',
      },
      '7': {
        move: 'stand',
      },
      '8': {
        move: 'stand',
      },
      '9': {
        move: 'stand',
      },
      '10': {
        move: 'stand',
      },
      A: {
        move: 'stand',
      },
    },
  },
  '9': {
    facing: {
      '2': {
        move: 'stand',
      },
      '3': {
        move: 'stand',
      },
      '4': {
        move: 'stand',
      },
      '5': {
        move: 'stand',
      },
      '6': {
        move: 'stand',
      },
      '7': {
        move: 'stand',
      },
      '8': {
        move: 'stand',
      },
      '9': {
        move: 'stand',
      },
      '10': {
        move: 'stand',
      },
      A: {
        move: 'stand',
      },
    },
  },
};

// key is the total of the 2 ranks (lookup table to be used for '8-' and '17+')
const hardHandChart: ChartMap<HardHandKey> = {
  '8-': {
    facing: {
      '2': {
        move: 'hit',
      },
      '3': {
        move: 'hit',
      },
      '4': {
        move: 'hit',
      },
      '5': {
        move: 'hit',
      },
      '6': {
        move: 'hit',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '9': {
    facing: {
      '2': {
        move: 'hit',
      },
      '3': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '4': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '5': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '10': {
    facing: {
      '2': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '3': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '4': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '5': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '8': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '9': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '11': {
    facing: {
      '2': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '3': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '4': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '5': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '6': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '7': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '8': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '9': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      '10': {
        move: 'hit',
        doubleDownAllowedMove: 'double_down',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '12': {
    facing: {
      '2': {
        move: 'hit',
      },
      '3': {
        move: 'hit',
      },
      '4': {
        move: 'stand',
      },
      '5': {
        move: 'stand',
      },
      '6': {
        move: 'stand',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '13': {
    facing: {
      '2': {
        move: 'stand',
      },
      '3': {
        move: 'stand',
      },
      '4': {
        move: 'stand',
      },
      '5': {
        move: 'stand',
      },
      '6': {
        move: 'stand',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '14': {
    facing: {
      '2': {
        move: 'stand',
      },
      '3': {
        move: 'stand',
      },
      '4': {
        move: 'stand',
      },
      '5': {
        move: 'stand',
      },
      '6': {
        move: 'stand',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '15': {
    facing: {
      '2': {
        move: 'stand',
      },
      '3': {
        move: 'stand',
      },
      '4': {
        move: 'stand',
      },
      '5': {
        move: 'stand',
      },
      '6': {
        move: 'stand',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
      },
      '10': {
        move: 'hit',
        surrenderAllowedMove: 'surrender',
      },
      A: {
        move: 'hit',
      },
    },
  },
  '16': {
    facing: {
      '2': {
        move: 'stand',
      },
      '3': {
        move: 'stand',
      },
      '4': {
        move: 'stand',
      },
      '5': {
        move: 'stand',
      },
      '6': {
        move: 'stand',
      },
      '7': {
        move: 'hit',
      },
      '8': {
        move: 'hit',
      },
      '9': {
        move: 'hit',
        surrenderAllowedMove: 'surrender',
      },
      '10': {
        move: 'hit',
        surrenderAllowedMove: 'surrender',
      },
      A: {
        move: 'hit',
        surrenderAllowedMove: 'surrender',
      },
    },
  },
  '17+': {
    facing: {
      '2': {
        move: 'stand',
      },
      '3': {
        move: 'stand',
      },
      '4': {
        move: 'stand',
      },
      '5': {
        move: 'stand',
      },
      '6': {
        move: 'stand',
      },
      '7': {
        move: 'stand',
      },
      '8': {
        move: 'stand',
      },
      '9': {
        move: 'stand',
      },
      '10': {
        move: 'stand',
      },
      A: {
        move: 'stand',
      },
    },
  },
};

export { pairChart, softHandChart, hardHandChart };
