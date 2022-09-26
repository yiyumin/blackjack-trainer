import { Fragment } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';

type ModalFullPageProps = {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  closeModal: () => void;
};

const ModalFullPage = ({
  children,
  title,
  isOpen,
  closeModal,
}: ModalFullPageProps) => {
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
        className='fixed inset-0 flex justify-center'
      >
        <div className='flex w-full max-w-3xl flex-col items-center bg-zinc-300 p-2 dark:bg-zinc-900'>
          <Dialog.Title className='relative w-full text-center'>
            <span className='font-bold uppercase dark:text-white'>{title}</span>
          </Dialog.Title>
          {children}
        </div>
        <div className='group absolute top-2 right-5'>
          <button onClick={closeModal} aria-label='close-modal'>
            <XIcon className='h-6 w-6 transition-opacity group-hover:opacity-50 dark:stroke-white' />
          </button>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalFullPage;
