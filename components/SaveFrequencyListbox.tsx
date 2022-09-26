import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline';

const frequencies = [50, 100, 250];

type SaveFrequencyListboxProps = {
  selectedFrequency: number;
  setSelectedFrequency: (frequency: number) => void;
};

const SaveFrequencyListbox = ({
  selectedFrequency,
  setSelectedFrequency,
}: SaveFrequencyListboxProps) => {
  return (
    <Listbox value={selectedFrequency} onChange={setSelectedFrequency}>
      <Listbox.Button className='relative w-16 cursor-default rounded-lg bg-white py-1 pl-2 pr-6 text-left text-black'>
        {selectedFrequency}

        <div className='absolute inset-y-0 right-0 flex items-center pr-1'>
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
        className='absolute bottom-full mb-1 w-full'
      >
        <Listbox.Options className='rounded-lg bg-white py-1'>
          {frequencies.map((frequency) => (
            <Listbox.Option
              key={frequency}
              value={frequency}
              className={({ active }) =>
                `relative select-none py-1 pl-2 pr-6 ${
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    {frequency}
                  </span>

                  {selected ? (
                    <span className='absolute inset-y-0 right-0 flex items-center pr-1 text-amber-600'>
                      <CheckIcon className='h-5 w-5' aria-hidden='true' />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
};

export default SaveFrequencyListbox;
