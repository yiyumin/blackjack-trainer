import { RadioGroup } from '@headlessui/react';

import { HandType } from '../types';

type StatisticsFilterProps = {
  handTypeFilter?: HandType;
  setHandTypeFilter: (handTypeFilter?: HandType) => void;
};

const StatisticsFilter = ({
  handTypeFilter,
  setHandTypeFilter,
}: StatisticsFilterProps) => {
  return (
    <RadioGroup value={handTypeFilter} onChange={setHandTypeFilter}>
      <RadioGroup.Label className='sr-only'>Filter</RadioGroup.Label>
      <div className='flex justify-center'>
        {[
          { label: 'All', value: undefined },
          { label: 'Pairs', value: 'pair' },
          { label: 'Soft Hands', value: 'soft_hand' },
          { label: 'Hard Hands', value: 'hard_hand' },
        ].map(({ label, value }) => (
          <RadioGroup.Option
            key={label}
            value={value}
            className={({ active, checked }) =>
              `${
                active
                  ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                  : ''
              } ${
                checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
              } cursor-pointer border-2 border-slate-600 py-4 px-2 first:rounded-l-lg last:rounded-r-lg focus:outline-none md:px-5`
            }
          >
            {({ checked }) => (
              <RadioGroup.Label
                as='span'
                className={`font-medium  ${
                  checked ? 'text-white' : 'text-gray-900'
                }`}
              >
                {label}
              </RadioGroup.Label>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default StatisticsFilter;
