import { useSupabase } from '../contexts/SupabaseProvider';

import AuthProvider from './AuthProvider';
import { FacebookIcon, GithubIcon, GoogleIcon } from './icons';

const AuthProviders = () => {
  const { signInWithProvider } = useSupabase();
  return (
    <div className='w-full space-y-4'>
      <div className='text-sm font-extralight'>Sign in with</div>
      <div className='flex flex-col gap-y-2'>
        <AuthProvider onClick={() => signInWithProvider('google')}>
          <div className='flex items-center justify-center gap-x-2'>
            <GoogleIcon className='h-6 w-6 fill-white' /> Sign up with Google
          </div>
        </AuthProvider>
        <AuthProvider onClick={() => signInWithProvider('github')}>
          <div className='flex items-center justify-center gap-x-2'>
            <GithubIcon className='h-6 w-6 fill-white' /> Sign up with Github
          </div>
        </AuthProvider>
        <AuthProvider onClick={() => signInWithProvider('facebook')}>
          <div className='flex items-center justify-center gap-x-2'>
            <FacebookIcon className='h-6 w-6 fill-white' /> Sign up with
            Facebook
          </div>
        </AuthProvider>
      </div>
    </div>
  );
};

export default AuthProviders;
