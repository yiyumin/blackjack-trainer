type HeaderTitleProps = {
  title: string;
  subTitle: string;
};

const HeaderTitle = ({ title, subTitle }: HeaderTitleProps) => {
  return (
    <div className='text-center dark:text-white'>
      <h1 className='text-2xl font-bold tracking-wider md:text-4xl'>{title}</h1>
      <h2 className='text-xs md:text-sm'>{subTitle}</h2>
    </div>
  );
};

export default HeaderTitle;
