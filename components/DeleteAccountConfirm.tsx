type DeleteAccountConfirmProps = {
  onConfirm: () => void;
};

const DeleteAccountConfirm = ({ onConfirm }: DeleteAccountConfirmProps) => {
  return (
    <div className='my-2.5 flex w-2/3 flex-col gap-4 text-white'>
      <div className='text-center text-3xl font-bold'>
        Are you sure you want to delete your account?
      </div>
      <div className='text-sm italic'>
        *This will delete all of your hand statistics and account settings. This
        actions is <span className='font-bold text-red-500'>permanent</span> and
        cannot be undone!
      </div>
      <button
        onClick={onConfirm}
        className='transtion-colors mt-4 rounded-md bg-red-700 p-2 text-xl hover:bg-red-800'
      >
        Confirm
      </button>
    </div>
  );
};

export default DeleteAccountConfirm;
