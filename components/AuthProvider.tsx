type AuthProviderProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const AuthProvider = ({ children, onClick }: AuthProviderProps) => {
  return (
    <button
      className='rounded-md border border-transparent bg-black/20 py-2 text-sm font-light transition-colors hover:border-black/20 hover:bg-transparent dark:bg-white/10 dark:hover:border-white/10 dark:hover:bg-transparent'
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default AuthProvider;
