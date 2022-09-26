type MoveOptionProps = {
  label: string;
  isEnabled?: boolean;
  onClick: () => void;
};

const MoveOption = ({ label, isEnabled = true, onClick }: MoveOptionProps) => {
  return (
    <button
      className={`rounded-md border py-3 px-4 text-xs md:px-3 md:py-1.5 md:text-base ${
        isEnabled
          ? 'border-black shadow-md dark:border-white dark:text-white'
          : 'border-slate-400 text-slate-400'
      }`}
      disabled={!isEnabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default MoveOption;
