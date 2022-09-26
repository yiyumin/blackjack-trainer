import { Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/outline';

import { PracticeType } from '../types';

const OPTION_TYPE_CLASS: Record<'all' | 'hand_type' | 'hand', string> = {
  all: 'py-2 pl-4 text-lg',
  hand_type: 'py-1.5 pl-10',
  hand: 'py-1 pl-16 text-sm',
};

type PracticeTypeListboxOptionProps = {
  value?: PracticeType;
  name: string;
  optionType?: 'all' | 'hand_type' | 'hand';
};

const PracticeTypeListboxOption = ({
  value,
  name,
  optionType = 'hand',
}: PracticeTypeListboxOptionProps) => {
  return (
    <Listbox.Option
      value={value}
      className={({ active }) =>
        `relative select-none ${OPTION_TYPE_CLASS[optionType]}  ${
          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
        }`
      }
    >
      {({ selected }) => (
        <>
          <span
            className={`block truncate pr-8 ${
              selected ? 'font-bold' : 'font-normal'
            }`}
          >
            {name}
          </span>

          {selected ? (
            <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-amber-600'>
              <CheckIcon className='h-5 w-5' aria-hidden='true' />
            </span>
          ) : null}
        </>
      )}
    </Listbox.Option>
  );
};

export default PracticeTypeListboxOption;
