import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const { currentTheme } = useDarkMode();

  const baseClasses = `
    relative inline-flex items-center justify-center font-medium 
    transition-all duration-300 ease-out focus:outline-none 
    disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
    active:scale-95 transform-gpu
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white
      hover:from-slate-700 hover:via-slate-800 hover:to-slate-700
      border border-slate-700/50 hover:border-slate-600/50
      shadow-lg shadow-slate-900/25 hover:shadow-xl hover:shadow-slate-900/40
      rounded-2xl
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent 
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    secondary: `
      bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm
      text-slate-700 dark:text-slate-300
      hover:bg-slate-200/80 dark:hover:bg-slate-700/80
      border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/60 dark:hover:border-slate-600/60
      rounded-2xl shadow-sm hover:shadow-md
    `,
    outline: `
      border-2 border-slate-300/60 dark:border-slate-700/60 
      text-slate-700 dark:text-slate-300
      hover:bg-slate-50/80 dark:hover:bg-slate-800/80 
      hover:border-slate-400/60 dark:hover:border-slate-600/60
      rounded-2xl backdrop-blur-sm
    `,
    ghost: `
      text-slate-600 dark:text-slate-400
      hover:bg-slate-100/60 dark:hover:bg-slate-800/60
      hover:text-slate-900 dark:hover:text-slate-100
      rounded-2xl
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-rose-500 text-white
      hover:from-red-600 hover:to-rose-600
      border border-red-400/50 hover:border-red-500/50
      shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40
      rounded-2xl
    `,
    success: `
      bg-gradient-to-r from-emerald-500 to-teal-500 text-white
      hover:from-emerald-600 hover:to-teal-600
      border border-emerald-400/50 hover:border-emerald-500/50
      shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40
      rounded-2xl
    `,
    accent: `
      bg-gradient-to-r from-indigo-500 to-purple-500 text-white
      hover:from-indigo-600 hover:to-purple-600
      border border-indigo-400/50 hover:border-indigo-500/50
      shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40
      rounded-2xl
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent 
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm h-9',
    md: 'px-6 py-3 text-base h-11',
    lg: 'px-8 py-4 text-lg h-13',
    icon: 'w-10 h-10 text-sm',
  };

  const buttonClasses = [
    baseClasses,
    variants[variant] || variants.primary,
    sizes[size],
    loading && 'cursor-wait',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-200'}>
        {children}
      </span>
    </button>
  );
};

export default Button;
