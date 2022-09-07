import StatisticsOverallItem from './StatisticsOverallItem';

type StatisticsOverallProps = {
  handsPlayed: number;
  handsPlayedCorrect: number;
};

const StatisticsOverall = ({
  handsPlayed,
  handsPlayedCorrect,
}: StatisticsOverallProps) => {
  return (
    <div className='flex gap-3'>
      <StatisticsOverallItem
        value={handsPlayedCorrect.toString()}
        title='Hands Played Correctly'
      />
      <StatisticsOverallItem
        value={handsPlayed.toString()}
        title='Hands Played'
      />
      <StatisticsOverallItem
        value={
          handsPlayed !== 0
            ? ((handsPlayedCorrect / handsPlayed) * 100).toFixed(1)
            : '-'
        }
        title='Correct %'
      />
    </div>
  );
};

export default StatisticsOverall;
