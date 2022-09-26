import { FormEvent, useState } from 'react';
import { CheckIcon } from '@heroicons/react/outline';

import AuthInputPassword from './AuthInputPassword';
import AuthButton from './AuthButton';

type UpdatePasswordProps = {
  updatePassword: (password: string) => Promise<void>;
};

const UpdatePassword = ({ updatePassword }: UpdatePasswordProps) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updatePassword(password);
    setLoading(false);
  };

  return (
    <div className='w-full px-4 py-8 text-white'>
      <form action='submit' onSubmit={onSubmit} className='space-y-4'>
        <AuthInputPassword
          label='What would you like your new password to be?'
          password={password}
          setPassword={setPassword}
        />
        <AuthButton
          label='Update password'
          loading={loading}
          icon={<CheckIcon className='h-6 w-6 stroke-1' />}
        />
      </form>
    </div>
  );
};

export default UpdatePassword;
