import { ArrowRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';

import { HandKey, HandStat, Stats } from '../types';

import StatisticsOverall from './StatisticsOverall';

const getTimesCorrectSeen = (handStats: HandStat<HandKey>[]) =>
  handStats.reduce(
    (curr, stat) => {
      curr.timesCorrect += stat.timesCorrect;
      curr.timesSeen += stat.timesSeen;

      return curr;
    },
    { timesCorrect: 0, timesSeen: 0 }
  );

type SaveImportConfirmProps = {
  fromStats: Stats;
  toStats: Stats;
  onConfirm: () => void;
  onCancel: () => void;
};

const SaveImportConfirm = ({
  fromStats,
  toStats,
  onConfirm,
  onCancel,
}: SaveImportConfirmProps) => {
  const { timesCorrect: fromTimesCorrect, timesSeen: fromTimesSeen } =
    getTimesCorrectSeen([
      ...fromStats.pairs,
      ...fromStats.softHands,
      ...fromStats.hardHands,
    ]);

  const { timesCorrect: toTimesCorrect, timesSeen: toTimesSeen } =
    getTimesCorrectSeen([
      ...toStats.pairs,
      ...toStats.softHands,
      ...toStats.hardHands,
    ]);

  return (
    <>
      <button className='absolute left-6' onClick={onCancel}>
        <ChevronLeftIcon className='h-8 w-8 text-white' />
      </button>

      <div className='flex flex-col gap-y-8 py-4 text-white'>
        <div className='flex items-center justify-center gap-2 md:gap-4'>
          <div className='space-y-2 text-slate-300'>
            <div className='text-xl font-semibold'>Replacing:</div>
            <StatisticsOverall
              handsPlayed={fromTimesSeen}
              handsPlayedCorrect={fromTimesCorrect}
              mini
            />
          </div>

          <ArrowRightIcon className='h-8 w-8' />

          <div className='space-y-2'>
            <div className='text-xl font-semibold'>With:</div>
            <StatisticsOverall
              handsPlayed={toTimesSeen}
              handsPlayedCorrect={toTimesCorrect}
              mini
            />
          </div>
        </div>
        <button
          onClick={onConfirm}
          className='rounded-md bg-sky-700 p-2 text-xl'
        >
          Confirm
        </button>
      </div>
    </>
  );
};

export default SaveImportConfirm;
