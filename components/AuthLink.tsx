import { MouseEventHandler } from 'react';

type AuthLinkProps = {
  label: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
};

const AuthLink = ({ label, onClick }: AuthLinkProps) => {
  return (
    <a
      className='cursor-pointer text-amber-400 underline dark:text-amber-600'
      onClick={onClick}
    >
      {label}
    </a>
  );
};

export default AuthLink;
