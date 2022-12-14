import { useState } from 'react';
import { compressToEncodedURIComponent } from 'lz-string';

import { Stats } from '../lib/types';

type SaveExportType = {
  stats: Stats;
};

const SaveExport = ({ stats }: SaveExportType) => {
  const [copied, setCopied] = useState(false);

  const compressedStats = compressToEncodedURIComponent(JSON.stringify(stats));
  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(compressedStats).then(() => setCopied(true));
  };

  return (
    <div className='my-2.5 flex w-2/3 flex-col gap-2'>
      <label htmlFor='save-file' className='text-xl font-bold text-white'>
        Export
      </label>
      <textarea
        id='save-file'
        value={compressedStats}
        onFocus={(e) => e.target.select()}
        rows={5}
        className='p-1'
        readOnly
      />
      <button
        className={`mt-4 rounded-md py-2 text-xl text-white ${
          copied
            ? 'bg-sky-500 dark:bg-sky-700'
            : 'bg-sky-700 transition-colors hover:bg-sky-800 dark:bg-sky-800 dark:hover:bg-sky-900'
        }`}
        onClick={copyTextToClipboard}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default SaveExport;
