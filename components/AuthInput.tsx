import React, { HTMLInputTypeAttribute } from 'react';

type AuthInputProps = {
  id: string;
  label: string;
  inputType: HTMLInputTypeAttribute;
  value: string;
  setValue: (value: string) => void;
  children?: React.ReactNode;
};

const AuthInput = ({
  id,
  label,
  inputType,
  value,
  setValue,
  children,
}: AuthInputProps) => {
  return (
    <div className='flex flex-col gap-y-4'>
      <div>
        <label htmlFor={id} className='text-sm font-extralight'>
          {label}
        </label>
      </div>
      <div className='relative'>
        <input
          type={inputType}
          id={id}
          className='w-full rounded-md border border-slate-500 bg-transparent py-2 px-10 text-sm font-thin outline-none outline-offset-0 focus:outline-amber-600'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        {children}
      </div>
    </div>
  );
};

type AuthInputIconProps = {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
};

const AuthInputLeftIcon = ({
  className,
  onClick,
  children,
}: AuthInputIconProps) => {
  return (
    <div
      className={`absolute inset-y-0 left-0 flex w-10 items-center justify-center ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const AuthInputRightIcon = ({
  className,
  onClick,
  children,
}: AuthInputIconProps) => {
  return (
    <div
      className={`absolute inset-y-0 right-0 flex w-10 items-center justify-center ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

AuthInput.LeftIcon = AuthInputLeftIcon;
AuthInput.RightIcon = AuthInputRightIcon;

export default AuthInput;
