type AuthProviderProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const AuthProvider = ({ children, onClick }: AuthProviderProps) => {
  return (
    <button
      className='rounded-md border border-transparent bg-white/10 py-2 text-sm font-light transition-colors hover:border-white/10 hover:bg-transparent'
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default AuthProvider;
