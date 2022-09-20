type SettingsButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const SettingsButton = ({ children, onClick }: SettingsButtonProps) => {
  return (
    <button
      className='rounded-md border-2 border-white px-2.5 py-1.5 text-white hover:border-amber-600 hover:bg-amber-100 hover:text-amber-900'
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SettingsButton;
