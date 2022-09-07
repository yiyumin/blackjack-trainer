import { Transition } from '@headlessui/react';
import { useSettings } from '../contexts/SettingsProvider';
import { PracticeType } from '../types';
import PracticeTypeListbox from './PracticeTypeListbox';

import SettingsItem from './SettingsItem';
import SettingsSwitch from './SettingsSwitch';

type SettingProps = {
  selectedPracticeType?: PracticeType;
  setSelectedPracticeType: (practiceType: PracticeType) => void;
};

const Settings = ({
  selectedPracticeType,
  setSelectedPracticeType,
}: SettingProps) => {
  const {
    isDoubleDownAllowed,
    isDoubleDownAfterSplitAllowed,
    isSurrenderAllowed,
    toggleIsDoubleDownAllowed,
    toggleIsDoubleDownAfterSplitAllowed,
    toggleIsSurrenderAllowed,
  } = useSettings();

  return (
    <div className='mt-2 w-full py-3 px-5'>
      <SettingsItem title='Double down allowed?'>
        <SettingsSwitch
          isChecked={isDoubleDownAllowed}
          srLabel='Toggle whether doubling down is allowed'
          onChange={toggleIsDoubleDownAllowed}
        />
      </SettingsItem>

      <Transition
        show={isDoubleDownAllowed}
        enter='transition duration-100'
        enterFrom='opacity-0 scale-95 -translate-y-2.5'
        enterTo='opacity-100 scale-100 translate-y-0'
        leave='transition duration-75'
        leaveFrom='opacity-100 scale-100 translate-y-0'
        leaveTo='opacity-0 scale-95 -translate-y-2.5'
      >
        <SettingsItem title='Double down after splits allowed?'>
          <SettingsSwitch
            isChecked={isDoubleDownAfterSplitAllowed}
            srLabel='Toggle whether doubling down after a split is allowed'
            onChange={toggleIsDoubleDownAfterSplitAllowed}
          />
        </SettingsItem>
      </Transition>

      <SettingsItem title='Surrenders allowed?'>
        <SettingsSwitch
          isChecked={isSurrenderAllowed}
          srLabel='Toggle whether surrendering is allowed'
          onChange={toggleIsSurrenderAllowed}
        />
      </SettingsItem>

      <SettingsItem title='Practice'>
        <PracticeTypeListbox
          selectedPracticeType={selectedPracticeType}
          setSelectedPracticeType={setSelectedPracticeType}
        />
      </SettingsItem>
    </div>
  );
};

export default Settings;
