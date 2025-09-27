import React from 'react';

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, isLoading, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:ring-cyan-500 disabled:opacity-60 disabled:pointer-events-none px-4 py-2 transform hover:-translate-y-px active:translate-y-0";

  const variantClasses = {
    primary: 'bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-700/30',
    secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 border border-zinc-700',
    ghost: 'bg-transparent text-zinc-200 hover:bg-zinc-800 active:bg-zinc-700',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;

  return (
    <button className={combinedClasses} {...props} disabled={props.disabled || isLoading}>
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};
