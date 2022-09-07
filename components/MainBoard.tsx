import { Hand as HandType } from '../types';
import Hand from './Hand';

type MainBoardProps = {
  hand?: HandType;
};

const MainBoard = ({ hand }: MainBoardProps) => {
  return (
    <div className='flex basis-full flex-col items-center justify-around gap-3 text-white'>
      {hand && (
        <>
          <Hand card1={hand.dealerCard} />
          <Hand card1={hand.playerCard1} card2={hand.playerCard2} />
        </>
      )}
    </div>
  );
};

export default MainBoard;
