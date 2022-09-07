type ResultProps = {
  isCorrect?: boolean;
  explanation: string;
};

const Result = ({ isCorrect, explanation }: ResultProps) => {
  return (
    <div className='grid h-20 grid-cols-2 items-center justify-items-center p-2 text-white md:h-24'>
      <div>
        {isCorrect != null && (
          <span
            className={`text-lg font-bold ${
              isCorrect ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isCorrect ? 'CORRECT!' : 'WRONG'}
          </span>
        )}
      </div>
      <div className='text-xs md:text-sm'>{explanation}</div>
    </div>
  );
};

export default Result;
