import { HeroIcon } from '../lib/types';

type HeaderIconProps = {
  Icon: HeroIcon;
  onClick: () => void;
  label: string;
};

const HeaderIcon = ({ Icon, onClick, label }: HeaderIconProps) => {
  return (
    <div className='group'>
      <button onClick={onClick} aria-label={label}>
        <Icon className='h-6 w-6 stroke-slate-500 transition-colors group-hover:stroke-slate-700 dark:group-hover:stroke-slate-300' />
      </button>
    </div>
  );
};

export default HeaderIcon;
