import { HeroIcon } from '../types';

type HeaderIconProps = {
  Icon: HeroIcon;
  onClick: () => void;
};

const HeaderIcon = ({ Icon, onClick }: HeaderIconProps) => {
  return (
    <button onClick={onClick}>
      <Icon className='h-6 w-6 stroke-[#878a8c]' />
    </button>
  );
};

export default HeaderIcon;
