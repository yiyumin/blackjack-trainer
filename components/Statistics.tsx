import { useState } from 'react';

import { DealerKey, HandKey, HandSettingType, HandType, Stats } from '../types';
import StatisticsTable from './StatisticsTable';
import StatisticsFilter from './StatisticsFilter';
import ModifierLegend from './ModifierLegend';

type StatisticsProps = {
  stats: Stats;
  resetHandStat: (
    handType: HandType,
    handSettingType: HandSettingType,
    playerHandKey: HandKey,
    dealerKey: DealerKey
  ) => void;
  resetAllHandStatsOfHandType: (handType?: HandType) => void;
};

const Statistics = ({
  stats,
  resetHandStat,
  resetAllHandStatsOfHandType,
}: StatisticsProps) => {
  const [handTypeFilter, setHandTypeFilter] = useState<HandType>();

  return (
    <div className='mt-3 flex w-full flex-col gap-6 border-t border-t-slate-600 py-10 dark:text-white md:gap-12'>
      <div className='space-y-2'>
        <StatisticsTable
          stats={stats}
          handTypeFilter={handTypeFilter}
          resetHandStat={resetHandStat}
          resetAllHandStatsOfHandType={resetAllHandStatsOfHandType}
        />
        <ModifierLegend />
      </div>

      <StatisticsFilter
        handTypeFilter={handTypeFilter}
        setHandTypeFilter={setHandTypeFilter}
      />
    </div>
  );
};

export default Statistics;
