import { useState } from 'react';
import { compressToEncodedURIComponent } from 'lz-string';

import { Stats } from '../types';

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
        className='mt-4 rounded-md bg-sky-900 py-2 text-xl text-white'
        onClick={copyTextToClipboard}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default SaveExport;
