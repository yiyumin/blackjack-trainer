type StatisticsOverallItemProps = {
  value: string;
  title: string;
};

const StatisticsOverallItem = ({
  value,
  title,
}: StatisticsOverallItemProps) => {
  return (
    <div className='flex w-14 flex-col items-center'>
      <div className='text-3xl font-light'>{value}</div>
      <div className='text-center text-xs'>{title}</div>
    </div>
  );
};

export default StatisticsOverallItem;
