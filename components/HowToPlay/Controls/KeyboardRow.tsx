type KeyboardRowProps = {
  children: React.ReactNode;
  isIndented?: boolean;
};

const KeyboardRow = ({ children, isIndented = false }: KeyboardRowProps) => {
  return (
    <div className={`flex gap-2 ${isIndented ? 'ml-2' : ''}`}>{children}</div>
  );
};

export default KeyboardRow;
