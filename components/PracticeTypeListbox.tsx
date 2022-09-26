import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/outline';

import {
  PracticeType,
  pairKeys,
  softHandKeys,
  hardHandKeys,
  handTypes,
} from '../types';
import { getHandFriendlyName } from '../lib/blackjack';

import PracticeTypeListboxOption from './PracticeTypeListboxOption';

const handTypeToKeys = {
  pair: pairKeys,
  soft_hand: softHandKeys,
  hard_hand: hardHandKeys,
};

type PracticeTypeListboxProps = {
  selectedPracticeType?: PracticeType;
  setSelectedPracticeType: (practiceType: PracticeType) => void;
};

const PracticeTypeListbox = ({
  selectedPracticeType,
  setSelectedPracticeType,
}: PracticeTypeListboxProps) => {
  return (
    <Listbox value={selectedPracticeType} onChange={setSelectedPracticeType}>
      <Listbox.Button className='relative w-60 cursor-default rounded-lg bg-white py-2 pl-3 pr-7 text-left'>
        {getHandFriendlyName(
          selectedPracticeType?.handType,
          selectedPracticeType?.handKey
        )}

        <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
          <SelectorIcon
            className='h-5 w-5 stroke-[#878a8c]'
            aria-hidden='true'
          />
        </div>
      </Listbox.Button>
      <Transition
        enter='transition duration-100 ease-out'
        enterFrom='transform scale-95 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-75 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-95 opacity-0'
      >
        <Listbox.Options className='absolute mt-1 max-h-96 w-full overflow-auto rounded-lg bg-white py-1'>
          <PracticeTypeListboxOption
            name={getHandFriendlyName()}
            optionType='all'
          />
          {handTypes.map((handType) => (
            <React.Fragment key={handType}>
              <PracticeTypeListboxOption
                value={
                  selectedPracticeType?.handType == handType &&
                  selectedPracticeType.handKey == null
                    ? selectedPracticeType
                    : { handType }
                }
                name={getHandFriendlyName(handType)}
                optionType='hand_type'
              />
              {handTypeToKeys[handType].map((handKey) => (
                <PracticeTypeListboxOption
                  key={handKey}
                  value={
                    selectedPracticeType?.handType == handType &&
                    selectedPracticeType.handKey == handKey
                      ? selectedPracticeType
                      : { handType, handKey }
                  }
                  name={getHandFriendlyName(handType, handKey)}
                />
              ))}
            </React.Fragment>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
};

export default PracticeTypeListbox;
