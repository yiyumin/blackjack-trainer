type StatisticsOverallItemProps = {
  value: string;
  title: string;
  mini: boolean;
};

const StatisticsOverallItem = ({
  value,
  title,
  mini,
}: StatisticsOverallItemProps) => {
  return (
    <div className='flex w-14 flex-col items-center'>
      <div
        className={`font-light ${mini ? 'text-base md:text-xl' : 'text-3xl'}`}
      >
        {value}
      </div>
      <div className='text-center text-xs'>{title}</div>
    </div>
  );
};

export default StatisticsOverallItem;
