import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';

type ModalFloatProps = {
  children: React.ReactNode;
  isOpen: boolean;
  colorMode?: 'default' | 'alternate';
  closeModal: () => void;
};

const ModalFloat = ({
  children,
  isOpen,
  closeModal,
  colorMode = 'default',
}: ModalFloatProps) => {
  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter='ease-out duration-150'
      enterFrom='opacity-0 scale-95 translate-y-10'
      enterTo='opacity-100 scale-100'
      leave='ease-in duration-150'
      leaveFrom='opacity-100 scale-100'
      leaveTo='opacity-0 scale-95 translate-y-10'
    >
      <Dialog
        onClose={closeModal}
        className='fixed inset-0 flex items-center justify-center'
      >
        <Dialog.Overlay className='fixed inset-0 bg-white opacity-50 dark:bg-black' />

        <div
          className={`relative flex w-11/12 max-w-lg flex-col items-center rounded-xl p-2 shadow-xl ${
            colorMode === 'default'
              ? 'bg-zinc-300 dark:bg-zinc-900'
              : ' bg-slate-600 dark:bg-slate-800'
          }`}
        >
          <button
            className='absolute right-5'
            onClick={closeModal}
            aria-label='close modal'
          >
            <XIcon
              className={`h-6 w-6 ${
                colorMode === 'default' ? 'dark:stroke-white' : 'stroke-white'
              }`}
            />
          </button>
          {children}
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalFloat;
