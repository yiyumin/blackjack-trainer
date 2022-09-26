import AuthEmail from './AuthEmail';
import AuthProviders from './AuthProviders';
import Divider from './Divider';

type AuthProps = {
  handleClose: () => void;
};

const Auth = ({ handleClose }: AuthProps) => {
  return (
    <div className='w-full text-white'>
      <div className='flex flex-col items-center gap-y-8 px-4 py-8'>
        <AuthProviders />
        <Divider />
        <AuthEmail handleClose={handleClose} />
      </div>
    </div>
  );
};

export default Auth;
