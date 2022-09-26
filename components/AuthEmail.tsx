import { FormEvent, useState } from 'react';
import { LockClosedIcon, InboxIcon } from '@heroicons/react/outline';

import { useSupabase } from '../contexts/SupabaseProvider';

import AuthInputPassword from './AuthInputPassword';
import AuthInputEmail from './AuthInputEmail';
import AuthButton from './AuthButton';
import AuthLink from './AuthLink';

type FormMode =
  | 'sign_in_password'
  | 'sign_in_magic_link'
  | 'sign_up'
  | 'reset_password';

const FORM_MODE_BUTTON_TEXT: Record<FormMode, string> = {
  sign_in_password: 'Sign in',
  sign_in_magic_link: 'Send magic link',
  sign_up: 'Sign up',
  reset_password: 'Send reset password instructions',
};

const FORM_MODE_NAV_LINK_MODE: Record<FormMode, FormMode> = {
  sign_in_password: 'sign_in_magic_link',
  sign_in_magic_link: 'sign_in_password',
  sign_up: 'sign_in_password',
  reset_password: 'sign_in_password',
};

const FORM_MODE_NAV_LINK_TEXT: Record<FormMode, string> = {
  sign_in_password: 'Sign in with magic link',
  sign_in_magic_link: 'Sign in with password',
  sign_up: 'Do you have an account? Sign in',
  reset_password: 'Go back to sign in',
};

type AuthEmailProps = {
  handleClose: () => void;
};

const AuthEmail = ({ handleClose }: AuthEmailProps) => {
  const [mode, setMode] = useState<FormMode>('sign_in_password');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, signInWithPassword, signInWithOtp, resetPassword } =
    useSupabase();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    switch (mode) {
      case 'sign_in_password':
        await signInWithPassword(email, password, handleClose);
        break;
      case 'sign_in_magic_link':
        await signInWithOtp(email);
        break;
      case 'sign_up':
        await signUp(email, password);
        break;
      case 'reset_password':
        await resetPassword(email);
        break;
      default:
        break;
    }

    setLoading(false);
  };

  return (
    <div className='w-full space-y-4'>
      <form action='submit' onSubmit={onSubmit} className='space-y-4'>
        <AuthInputEmail
          label='Email address'
          email={email}
          setEmail={setEmail}
        />
        {(mode === 'sign_up' || mode === 'sign_in_password') && (
          <>
            <AuthInputPassword
              label='Password'
              password={password}
              setPassword={setPassword}
            />
            <div className='text-right text-xs'>
              {mode === 'sign_in_password' && (
                <AuthLink
                  label='Forgot your password?'
                  onClick={() => setMode('reset_password')}
                />
              )}
            </div>
          </>
        )}
        <AuthButton
          label={FORM_MODE_BUTTON_TEXT[mode]}
          loading={loading}
          icon={
            mode === 'sign_in_password' || mode === 'sign_up' ? (
              <LockClosedIcon className='h-6 w-6 stroke-1' />
            ) : (
              <InboxIcon className='h-6 w-6 stroke-1' />
            )
          }
        />
      </form>
      <div className='flex flex-col items-center gap-y-2 pt-2 text-xs'>
        <AuthLink
          label={FORM_MODE_NAV_LINK_TEXT[mode]}
          onClick={() => setMode(FORM_MODE_NAV_LINK_MODE[mode])}
        />

        {mode === 'sign_in_password' && (
          <AuthLink
            label="Don't have an account? Sign up"
            onClick={() => setMode('sign_up')}
          />
        )}
      </div>
    </div>
  );
};

export default AuthEmail;
