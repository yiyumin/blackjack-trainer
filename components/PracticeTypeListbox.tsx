import { Listbox } from '@headlessui/react';
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
    <Listbox
      value={selectedPracticeType}
      onChange={(pt: PracticeType) => {
        setSelectedPracticeType(pt);
      }}
    >
      <Listbox.Button className='relative w-60 cursor-default rounded-lg bg-white py-2 pl-3 text-left'>
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
      <Listbox.Options className='absolute mt-1 max-h-96 w-60 overflow-auto rounded-lg bg-white py-1'>
        <PracticeTypeListboxOption
          name={getHandFriendlyName()}
          optionType='all'
        />
        {handTypes.map((handType) => (
          <>
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
            {handTypeToKeys[handType].map((key) => (
              <PracticeTypeListboxOption
                key={key}
                value={
                  selectedPracticeType?.handType == handType &&
                  selectedPracticeType.handKey == key
                    ? selectedPracticeType
                    : { handType, handKey: key }
                }
                name={getHandFriendlyName(handType, key)}
              />
            ))}
          </>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default PracticeTypeListbox;
