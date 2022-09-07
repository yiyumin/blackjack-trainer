import KeyboardKey from './KeyboardKey';
import KeyboardRow from './KeyboardRow';

const Controls = () => {
  return (
    <>
      <h1 className='text-center text-xl font-bold'>Game Controls</h1>

      <div>
        While practicing, use the mouse to select the correct move in the given
        scenario. Alternatively, use the keyboard to select the correct move.
      </div>

      <div className='flex flex-col gap-y-2.5'>
        <h3 className='text-lg font-medium'>Keyboard Mapping</h3>
        <div>
          The keyboard controls are mapped to the move location on screen.
        </div>

        <div className='mt-10 flex justify-center'>
          <div className='space-y-2 rounded-xl bg-gray-200 py-5 px-10'>
            <KeyboardRow>
              <KeyboardKey title='U' description='hit' />
              <KeyboardKey title='I' description='stand' />
            </KeyboardRow>

            <KeyboardRow isIndented>
              <KeyboardKey title='J' description='split' />
              <KeyboardKey title='K' description='doub.' />
              <KeyboardKey title='L' description='surr.' />
            </KeyboardRow>

            <div className='h-5'></div>

            <KeyboardRow>
              <KeyboardKey title='Spacebar' description='deal' isWide />
            </KeyboardRow>
          </div>
        </div>
      </div>
    </>
  );
};

export default Controls;
