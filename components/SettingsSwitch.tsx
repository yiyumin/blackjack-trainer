import { Switch } from '@headlessui/react';

type SettingsSwitchProps = {
  isChecked: boolean;
  srLabel: string;
  onChange: () => void;
};

const SettingsSwitch = ({
  isChecked,
  srLabel,
  onChange,
}: SettingsSwitchProps) => {
  return (
    <Switch
      checked={isChecked}
      onChange={onChange}
      className={`${
        isChecked ? 'bg-[#6aaa64]' : 'bg-[#878a8c]'
      } relative inline-flex h-5 w-8 items-center rounded-full transition-colors`}
    >
      <span className='sr-only'>{srLabel}</span>
      <span
        className={`${
          isChecked ? 'translate-x-3.5' : 'translate-x-0.5'
        } inline-block h-4 w-4 rounded-full bg-white duration-300 ease-in-out`}
      />
    </Switch>
  );
};

export default SettingsSwitch;
