const LoadingSpinner = () => {
  return (
    <div className='inline-flex h-6 w-6 items-center justify-center motion-reduce:hidden'>
      <div className='block h-4 w-4 animate-spin rounded-[50%] border-[2px] border-white border-b-transparent' />
    </div>
  );
};

export default LoadingSpinner;
