import { MouseEventHandler } from 'react';

type AuthLinkProps = {
  label: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
};

const AuthLink = ({ label, onClick }: AuthLinkProps) => {
  return (
    <a
      className='cursor-pointer text-amber-400 underline transition-colors hover:text-amber-500 dark:text-amber-600 dark:hover:text-amber-700'
      onClick={onClick}
    >
      {label}
    </a>
  );
};

export default AuthLink;
