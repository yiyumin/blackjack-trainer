import { useState } from 'react';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { toast } from 'react-toastify';

import { Stats } from '../lib/types';
import { validateStats } from '../lib/blackjack';

import SaveImportConfirm from './SaveImportConfirm';

type SaveImportProps = {
  stats: Stats;
  importStats: (stats: Stats) => void;
  handleClose: () => void;
};

const SaveImport = ({ stats, importStats, handleClose }: SaveImportProps) => {
  const [compressedStats, setCompressedStats] = useState('');
  const [importedStats, setImportedStats] = useState<Stats>();

  const onNext = () => {
    const [isValid, validStats] = validateStats(
      JSON.parse(decompressFromEncodedURIComponent(compressedStats) || '{}')
    );

    if (isValid) {
      setImportedStats(validStats);
    } else {
      toast.error('Invalid save file');
    }
  };

  const onConfirmImport = (statsToImport: Stats) => {
    importStats(statsToImport);
    toast.success('Save imported!');
    handleClose();
  };

  return (
    <div className='my-2.5 w-2/3'>
      {importedStats === undefined ? (
        <div className='flex w-full flex-col gap-2'>
          <label htmlFor='save-file' className='text-xl font-bold text-white'>
            Import
          </label>
          <label htmlFor='save-file' className='text-sm text-white'>
            Copy and paste your save file here
          </label>
          <textarea
            id='save-file'
            value={compressedStats}
            onChange={(e) => setCompressedStats(e.target.value)}
            rows={5}
            className='p-1'
            autoFocus
            required
          />
          <button
            type='submit'
            className='mt-4 rounded-md bg-sky-700 py-2 text-xl text-white dark:bg-sky-900'
            onClick={onNext}
          >
            Next
          </button>
        </div>
      ) : (
        <SaveImportConfirm
          fromStats={stats}
          toStats={importedStats}
          onConfirm={() => onConfirmImport(importedStats)}
          onCancel={() => setImportedStats(undefined)}
        />
      )}
    </div>
  );
};

export default SaveImport;
