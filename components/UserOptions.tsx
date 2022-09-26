import { useCallback, useState } from 'react';

import { Stats } from '../types';
import { useSupabase } from '../contexts/SupabaseProvider';

import SaveFrequencyListbox from './SaveFrequencyListbox';

type UserOptionsProps = {
  openAuth: () => void;
  stats: Stats;
  saveFrequency: number;
  setSaveFrequency: (frequency: number) => void;
};

const UserOptions = ({
  openAuth,
  stats,
  saveFrequency,
  setSaveFrequency,
}: UserOptionsProps) => {
  const { userId, signOut, saveStats } = useSupabase();
  const [saving, setSaving] = useState(false);
  const [frequency, setFrequency] = useState(saveFrequency);

  const forceSave = async (userId: string) => {
    setSaving(true);
    await saveStats(userId, stats);
    setSaving(false);
  };

  const selectFrequency = useCallback(
    (frequency: number) => {
      setFrequency(frequency);
      setSaveFrequency(frequency);
    },
    [setSaveFrequency]
  );

  return (
    <div className='relative mx-5 text-white'>
      <div className='text-slate-400'>
        Cloud saves{' '}
        {userId ? (
          <span className='font-bold text-green-600'>enabled</span>
        ) : (
          <span className='font-bold text-red-600'>not enabled</span>
        )}
      </div>

      {userId ? (
        <>
          <div className='mt-4 flex flex-col gap-x-4 gap-y-2 sm:flex-row'>
            <button
              className='w-36 rounded-md bg-sky-800 p-2 disabled:cursor-not-allowed disabled:opacity-75'
              onClick={() => forceSave(userId)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Force Save'}
            </button>
            <button
              className='w-36 rounded-md bg-red-900 p-2'
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>

          <div className='absolute bottom-0 right-0 space-y-2'>
            <div className='text-lg font-semibold'>Save Frequency:</div>

            <div className='flex items-center gap-x-2 text-sm'>
              Every
              <div className='relative'>
                <SaveFrequencyListbox
                  selectedFrequency={frequency}
                  setSelectedFrequency={selectFrequency}
                />
              </div>
              hands
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className='text-sm italic text-slate-400'>
            Sign in to enable cloud saving.
          </div>
          <button
            className='mt-4 w-36 rounded-md bg-sky-900 p-2'
            onClick={() => openAuth()}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default UserOptions;
