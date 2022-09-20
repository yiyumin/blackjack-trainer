import { FormEvent, useState } from 'react';
import { decompressFromEncodedURIComponent } from 'lz-string';

type SaveImportProps = {
  importStats: (stats: any) => boolean;
  handleClose: () => void;
};

const SaveImport = ({ importStats, handleClose }: SaveImportProps) => {
  const [compressedStats, setCompressedStats] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      importStats(
        JSON.parse(decompressFromEncodedURIComponent(compressedStats) || '{}')
      )
    ) {
      handleClose();
    }
  };

  return (
    <div className='my-2.5 w-2/3'>
      <form className='flex w-full flex-col gap-2' onSubmit={onSubmit}>
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
          className='mt-4 rounded-md bg-sky-900 py-2 text-xl text-white'
        >
          Import
        </button>
      </form>
    </div>
  );
};

export default SaveImport;
