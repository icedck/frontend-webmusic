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
    w-full px-4 py-3 border rounded-xl 
    ${currentTheme.bgCard} ${currentTheme.text}
    ${error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : `${currentTheme.border} ${currentTheme.focusRing}`
    }
    focus:outline-none focus:ring-2 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium ${currentTheme.text}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
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
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default Input;
