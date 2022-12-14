type SettingsItemProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsItem = ({ title, children }: SettingsItemProps) => {
  return (
    <div className='flex w-full justify-between border-b-2 py-4 dark:border-zinc-700'>
      <div className='text-lg dark:text-white'>{title}</div>
      <div>{children}</div>
    </div>
  );
};

export default SettingsItem;
