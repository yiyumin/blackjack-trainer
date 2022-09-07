type HeroIcon = (props: React.ComponentProps<'svg'>) => JSX.Element;

type HeaderIconProps = {
  Icon: HeroIcon;
  onClick: () => void;
};

const HeaderIcon = ({ Icon, onClick }: HeaderIconProps) => {
  return (
    <button onClick={onClick}>
      <Icon className='h-5 w-5 stroke-[#878a8c] md:h-6 md:w-6' />
    </button>
  );
};

export default HeaderIcon;
