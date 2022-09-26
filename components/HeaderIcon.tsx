import { HeroIcon } from '../types';

type HeaderIconProps = {
  Icon: HeroIcon;
  onClick: () => void;
  label: string;
};

const HeaderIcon = ({ Icon, onClick, label }: HeaderIconProps) => {
  return (
    <button onClick={onClick} aria-label={label}>
      <Icon className='h-6 w-6 stroke-[#878a8c]' />
    </button>
  );
};

export default HeaderIcon;
