import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  const { currentTheme } = useDarkMode();

  const inputClasses = `
    w-full px-4 py-3 border backdrop-blur-sm transition-all duration-300 ease-out
    ${currentTheme.bgCard} ${currentTheme.text}
    ${error 
      ? 'border-red-400/60 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/10' 
      : `border-slate-200/60 dark:border-slate-700/60 
         focus:border-indigo-300 dark:focus:border-indigo-600 
         focus:ring-4 focus:ring-indigo-500/20`
    }
    hover:border-slate-300/80 dark:hover:border-slate-600/80
    rounded-2xl focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium ${currentTheme.text} tracking-wide`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {!error && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm font-medium flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
