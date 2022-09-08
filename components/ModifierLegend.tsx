import { BanIcon } from '@heroicons/react/outline';
import {
  ChevronDoubleDownIcon,
  FlagIcon,
  ScissorsIcon,
} from '@heroicons/react/solid';

import ModifierIcon from './ModifierIcon';
import ModifierLegendItem from './ModifierLegendItem';

const ModifierLegend = () => {
  return (
    <div className='g-green-600 grid grid-cols-2 md:grid-cols-4'>
      <ModifierLegendItem description='double down allowed'>
        <ModifierIcon Icon={ChevronDoubleDownIcon} allowed />
      </ModifierLegendItem>

      <ModifierLegendItem description='double down after split allowed'>
        <ModifierIcon Icon={ScissorsIcon} allowed />
      </ModifierLegendItem>

      <ModifierLegendItem description='surrender allowed'>
        <ModifierIcon Icon={FlagIcon} allowed />
      </ModifierLegendItem>

      <ModifierLegendItem description='modifier NOT allowed'>
        <BanIcon className='h-5 w-5 stroke-red-500/50 md:h-6 md:w-6' />
      </ModifierLegendItem>
    </div>
  );
};

export default ModifierLegend;
