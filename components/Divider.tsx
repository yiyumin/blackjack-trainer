const Divider = () => {
  return (
    <div className='flex w-full items-center'>
      <div className='w-1/2 border-b border-slate-400 dark:border-slate-500' />
      <span className='whitespace-nowrap px-2.5 text-xs font-light text-slate-400 dark:text-slate-500'>
        or continue with
      </span>
      <div className='w-1/2 border-b border-slate-400 dark:border-slate-500' />
    </div>
  );
};

export default Divider;
