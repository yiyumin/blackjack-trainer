import { BanIcon } from '@heroicons/react/outline';

import { HeroIcon } from '../types';

type ModifierIconProps = { Icon: HeroIcon; allowed: boolean };

const ModifierIcon = ({ Icon, allowed }: ModifierIconProps) => {
  return (
    <div className='relative flex h-5 w-5 items-center justify-center outline-1 md:h-6 md:w-6'>
      <Icon
        className={
          allowed
            ? 'h-5 w-5 text-white md:h-6 md:w-6'
            : 'h-3 w-3 text-white/70 md:h-5 md:w-5'
        }
      />
      {!allowed && (
        <BanIcon className='absolute h-5 w-5 stroke-red-500/50 md:h-6 md:w-6' />
      )}
    </div>
  );
};

export default ModifierIcon;
