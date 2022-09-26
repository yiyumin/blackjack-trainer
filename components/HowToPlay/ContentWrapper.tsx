type ContentWrapperProps = {
  children: React.ReactNode;
};

const ContentWrapper = ({ children }: ContentWrapperProps) => {
  return (
    <div className='flex h-[60vh] w-full flex-col gap-y-5 overflow-y-auto rounded-xl p-2.5 dark:text-white'>
      {children}
    </div>
  );
};

export default ContentWrapper;
