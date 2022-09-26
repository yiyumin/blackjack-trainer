import { MailIcon } from '@heroicons/react/outline';

import AuthInput from './AuthInput';

type AuthInputEmailProps = {
  label: string;
  email: string;
  setEmail: (email: string) => void;
};

const AuthInputEmail = ({ label, email, setEmail }: AuthInputEmailProps) => {
  return (
    <AuthInput
      id='email-address'
      label={label}
      inputType='text'
      value={email}
      setValue={setEmail}
    >
      <AuthInput.LeftIcon>
        <MailIcon className='h-6 w-6 stroke-slate-400 stroke-1 dark:stroke-slate-500' />
      </AuthInput.LeftIcon>
    </AuthInput>
  );
};

export default AuthInputEmail;
