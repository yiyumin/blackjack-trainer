import {
  ChartBarIcon,
  CogIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline';

import HeaderIcon from './HeaderIcon';
import HeaderTitle from './HeaderTitle';

type HeaderProps = {
  openHowToPlay: () => void;
  openStatistics: () => void;
  openSettings: () => void;
};

const Header = ({
  openHowToPlay,
  openStatistics,
  openSettings,
}: HeaderProps) => {
  return (
    <header className='relative flex items-center justify-center p-2'>
      <div className='absolute left-2'>
        <HeaderIcon Icon={QuestionMarkCircleIcon} onClick={openHowToPlay} />
      </div>

      <HeaderTitle
        title='Blackjack Trainer'
        subTitle='Multiple Deck (4+), Dealer Stands on Soft 17'
      />

      <div className='absolute right-2 flex gap-2'>
        <HeaderIcon Icon={ChartBarIcon} onClick={openStatistics} />
        <HeaderIcon Icon={CogIcon} onClick={openSettings} />
      </div>
    </header>
  );
};

export default Header;
