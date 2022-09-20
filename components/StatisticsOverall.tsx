import StatisticsOverallItem from './StatisticsOverallItem';

type StatisticsOverallProps = {
  handsPlayed: number;
  handsPlayedCorrect: number;
  mini?: boolean;
};

const StatisticsOverall = ({
  handsPlayed,
  handsPlayedCorrect,
  mini = false,
}: StatisticsOverallProps) => {
  return (
    <div className={`flex ${mini ? 'md:gap-2' : 'gap-8'}`}>
      {!mini && (
        <StatisticsOverallItem
          value={handsPlayedCorrect.toString()}
          title='Hands Played Correctly'
          mini={mini}
        />
      )}
      <StatisticsOverallItem
        value={handsPlayed.toString()}
        title='Hands Played'
        mini={mini}
      />
      <StatisticsOverallItem
        value={
          handsPlayed !== 0
            ? ((handsPlayedCorrect / handsPlayed) * 100).toFixed(1)
            : '-'
        }
        title='Correct %'
        mini={mini}
      />
    </div>
  );
};

export default StatisticsOverall;
