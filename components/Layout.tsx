import { useEffect } from 'react';
import { ToastContainer, Flip } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useSettings } from '../contexts/SettingsProvider';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { isDarkModeEnabled } = useSettings();

  useEffect(() => {
    document.body.classList.remove(isDarkModeEnabled ? 'light' : 'dark');
    document.body.classList.add(isDarkModeEnabled ? 'dark' : 'light');
  }, [isDarkModeEnabled]);

  return (
    <div className='flex h-screen w-screen justify-center bg-zinc-300 dark:bg-zinc-900'>
      {children}
      <ToastContainer autoClose={2500} transition={Flip} theme='colored' />
    </div>
  );
};

export default Layout;
