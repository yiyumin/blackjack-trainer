import { Popover } from '@headlessui/react';

type ConfirmationPopoverProps = {
  openPopoverElement: React.ReactNode;
  message: string;
  onConfirm: () => void;
  buttonLabel: string;
};

const ConfirmationPopover = ({
  openPopoverElement,
  message,
  onConfirm,
  buttonLabel,
}: ConfirmationPopoverProps) => {
  return (
    <Popover className='relative'>
      <Popover.Button aria-label={buttonLabel}>
        {openPopoverElement}
      </Popover.Button>
      <Popover.Panel className='absolute right-3 z-10 flex flex-col gap-5 rounded-md bg-slate-300 py-2.5 px-5 text-sm font-bold text-black'>
        <div>{message}</div>
        <div className='flex justify-center gap-2.5 text-white'>
          <Popover.Button
            as='button'
            onClick={onConfirm}
            className='rounded-md bg-red-700 p-2.5'
          >
            Confirm
          </Popover.Button>
          <Popover.Button as='button' className='rounded-md bg-slate-600 p-2.5'>
            Cancel
          </Popover.Button>
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default ConfirmationPopover;
