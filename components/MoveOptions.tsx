import { useSettings } from '../contexts/SettingsProvider';
import { Move } from '../types';
import MoveOption from './MoveOption';

type MoveOptionsProps = {
  isHandDealt: boolean;
  isSplittable?: boolean;
  onDealCards: () => void;
  makeMove: (move: Move) => void;
};

const MoveOptions = ({
  isHandDealt,
  isSplittable,
  onDealCards,
  makeMove,
}: MoveOptionsProps) => {
  const { isDoubleDownAllowed, isSurrenderAllowed } = useSettings();

  return (
    <div className='h-1/5 p-3'>
      {isHandDealt ? (
        <div className='h-full'>
          <div className='flex h-1/2 items-center justify-center gap-x-12'>
            <MoveOption label='Hit (u)' onClick={() => makeMove('hit')} />
            <MoveOption label='Stand (i)' onClick={() => makeMove('stand')} />
          </div>
          <div className='flex h-1/2 items-center justify-center gap-x-12'>
            <MoveOption
              label='Split (j)'
              isEnabled={isSplittable}
              onClick={() => makeMove('split')}
            />
            <MoveOption
              label='Double Down (k)'
              isEnabled={isDoubleDownAllowed}
              onClick={() => makeMove('double_down')}
            />
            <MoveOption
              label='Surrender (l)'
              isEnabled={isSurrenderAllowed}
              onClick={() => makeMove('surrender')}
            />
          </div>
        </div>
      ) : (
        <div className='flex h-full items-center justify-center'>
          <MoveOption label='Deal (spacebar)' onClick={onDealCards} />
        </div>
      )}
    </div>
  );
};

export default MoveOptions;
