import { useState } from 'react';
import { EyeIcon, EyeOffIcon, KeyIcon } from '@heroicons/react/outline';

import AuthInput from './AuthInput';

type AuthInputPasswordProps = {
  label: string;
  password: string;
  setPassword: (password: string) => void;
};

const AuthInputPassword = ({
  label,
  password,
  setPassword,
}: AuthInputPasswordProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <AuthInput
      id='password'
      label={label}
      inputType={isPasswordVisible ? 'text' : 'password'}
      value={password}
      setValue={setPassword}
    >
      <AuthInput.LeftIcon>
        <KeyIcon className='h-6 w-6 stroke-slate-400 stroke-1 dark:stroke-slate-500' />
      </AuthInput.LeftIcon>

      <AuthInput.RightIcon
        className='group cursor-pointer transition-transform duration-100 hover:scale-110'
        onClick={() => setIsPasswordVisible((prev) => !prev)}
      >
        {isPasswordVisible ? (
          <EyeOffIcon className='h-6 w-6 stroke-slate-400 stroke-1 transition-colors group-hover:stroke-slate-300 dark:stroke-slate-500 dark:group-hover:stroke-slate-400' />
        ) : (
          <EyeIcon className='h-6 w-6 stroke-slate-400 stroke-1 transition-colors group-hover:stroke-slate-300 dark:stroke-slate-500 dark:group-hover:stroke-slate-400' />
        )}
      </AuthInput.RightIcon>
    </AuthInput>
  );
};

export default AuthInputPassword;
