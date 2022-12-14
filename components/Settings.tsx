import { Transition } from '@headlessui/react';
import { useState } from 'react';

import { useSettings } from '../contexts/SettingsProvider';
import { PracticeType, Stats } from '../lib/types';

import SettingsItem from './SettingsItem';
import SettingsSwitch from './SettingsSwitch';
import PracticeTypeListbox from './PracticeTypeListbox';
import ModalFloat from './ModalFloat';
import SaveExport from './SaveExport';
import SaveImport from './SaveImport';
import SettingsButton from './SettingsButton';
import Auth from './Auth';
import UserOptions from './UserOptions';

type SettingProps = {
  selectedPracticeType?: PracticeType;
  setSelectedPracticeType: (practiceType: PracticeType) => void;
  stats: Stats;
  importStats: (stats: Stats) => void;
  saveFrequency: number;
  setSaveFrequency: (frequency: number) => void;
};

const Settings = ({
  selectedPracticeType,
  setSelectedPracticeType,
  stats,
  importStats,
  saveFrequency,
  setSaveFrequency,
}: SettingProps) => {
  const {
    isDoubleDownAllowed,
    isDoubleDownAfterSplitAllowed,
    isSurrenderAllowed,
    isDarkModeEnabled,
    toggleIsDoubleDownAllowed,
    toggleIsDoubleDownAfterSplitAllowed,
    toggleIsSurrenderAllowed,
    toggleIsDarkModeEnabled,
  } = useSettings();

  const [isExportSaveOpen, setIsExportSaveOpen] = useState(false);
  const [isImportSaveOpen, setIsImportSaveOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className='relative mt-2 h-full w-full py-3 px-5'>
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

      <SettingsItem title='Dark mode'>
        <SettingsSwitch
          isChecked={isDarkModeEnabled}
          srLabel='Toggle dark mode'
          onChange={toggleIsDarkModeEnabled}
        />
      </SettingsItem>

      <SettingsItem title='Practice'>
        <PracticeTypeListbox
          selectedPracticeType={selectedPracticeType}
          setSelectedPracticeType={setSelectedPracticeType}
        />
      </SettingsItem>

      <div className='space-x-4 py-4'>
        <SettingsButton onClick={() => setIsExportSaveOpen(true)}>
          Export Save
        </SettingsButton>
        <SettingsButton onClick={() => setIsImportSaveOpen(true)}>
          Import Save
        </SettingsButton>
      </div>

      <div className='absolute inset-x-0 bottom-6'>
        <UserOptions
          openAuth={() => setIsAuthOpen(true)}
          stats={stats}
          saveFrequency={saveFrequency}
          setSaveFrequency={setSaveFrequency}
        />
      </div>

      <ModalFloat
        isOpen={isExportSaveOpen}
        closeModal={() => setIsExportSaveOpen(false)}
        colorMode='alternate'
      >
        <SaveExport stats={stats} />
      </ModalFloat>

      <ModalFloat
        isOpen={isImportSaveOpen}
        closeModal={() => setIsImportSaveOpen(false)}
        colorMode='alternate'
      >
        <SaveImport
          stats={stats}
          importStats={importStats}
          handleClose={() => setIsImportSaveOpen(false)}
        />
      </ModalFloat>

      <ModalFloat
        isOpen={isAuthOpen}
        closeModal={() => setIsAuthOpen(false)}
        colorMode='alternate'
      >
        <Auth handleClose={() => setIsAuthOpen(false)} />
      </ModalFloat>
    </div>
  );
};

export default Settings;
