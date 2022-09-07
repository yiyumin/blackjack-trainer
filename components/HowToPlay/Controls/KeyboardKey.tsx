type KeyboardKeyProps = {
  title: string;
  description: string;
  isWide?: boolean;
};

const KeyboardKey = ({
  title,
  description,
  isWide = false,
}: KeyboardKeyProps) => {
  return (
    <div
      className={`flex h-14 flex-col items-center justify-center rounded-md bg-slate-700 text-white ${
        isWide ? 'w-full' : 'w-14'
      }`}
    >
      <div>{title}</div>
      <div className='text-xs'>{description}</div>
    </div>
  );
};

export default KeyboardKey;
