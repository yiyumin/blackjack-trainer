type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  // const { isDarkModeEnabled } = useTheme();
  // useEffect(() => {
  //   document.body.classList.remove(isDarkModeEnabled ? 'light' : 'dark');
  //   document.body.classList.add(isDarkModeEnabled ? 'dark' : 'light');
  // }, [isDarkModeEnabled]);

  return (
    <div className='flex h-screen w-screen justify-center dark:bg-[#121213]'>
      {children}
    </div>
  );
};

export default Layout;
