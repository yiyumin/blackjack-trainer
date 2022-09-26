import LoadingSpinner from './LoadingSpinner';

type AuthButtonProps = {
  label: string;
  loading?: boolean;
  icon?: React.ReactNode;
};

const AuthButton = ({ label, loading, icon }: AuthButtonProps) => {
  return (
    <button
      type='submit'
      className={`flex w-full items-center justify-center gap-x-1 rounded-md py-2 transition-colors disabled:cursor-not-allowed ${
        loading ? 'bg-amber-800' : 'bg-amber-600 hover:bg-amber-700'
      }`}
      disabled={loading}
    >
      {loading ? <LoadingSpinner /> : <>{icon}</>}
      {label}
    </button>
  );
};

export default AuthButton;
