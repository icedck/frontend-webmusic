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
    inline-flex items-center justify-center font-medium rounded-lg 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-music-500 to-music-600 text-white
      hover:from-music-600 hover:to-music-700 
      focus:ring-music-500
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100
      hover:bg-gray-300 dark:hover:bg-gray-600
      focus:ring-gray-500
    `,
    outline: `
      border-2 border-music-500 text-music-600 dark:text-music-400
      hover:bg-music-500 hover:text-white
      focus:ring-music-500
    `,
    ghost: `
      text-gray-600 dark:text-gray-400
      hover:bg-gray-100 dark:hover:bg-gray-800
      focus:ring-gray-500
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600
      focus:ring-red-500
    `,
    success: `
      bg-green-500 text-white
      hover:bg-green-600
      focus:ring-green-500
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            className="opacity-25"
          />
          <path 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            className="opacity-75"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
