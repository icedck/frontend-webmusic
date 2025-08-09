import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

const Button = ({
                  children,
                  variant = 'primary',
                  size = 'md',
                  type = 'button',
                  layout = 'horizontal',
                  disabled = false,
                  loading = false,
                  className = '',
                  onClick,
                  ...props
                }) => {
  const { currentTheme, isDarkMode } = useDarkMode();

  const baseClasses = `
    inline-flex justify-center font-medium
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${isDarkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'}
    disabled:opacity-60 disabled:cursor-not-allowed
    active:scale-95
  `;

  const layoutClasses = layout === 'vertical'
      ? 'flex-col space-y-2'
      : 'flex-row items-center space-x-2';

  // <<< THAY ĐỔI TẠI ĐÂY >>>
  const variants = {
    primary: `
      text-white border border-transparent
      bg-gradient-to-br from-cyan-500 to-blue-600
      hover:from-cyan-600 hover:to-blue-700
      ${currentTheme.focusRing}
    `,
    secondary: `
      ${currentTheme.bgSecondary} ${currentTheme.text}
      border ${currentTheme.border} ${currentTheme.borderHover}
      hover:${currentTheme.bgHover}
      ${currentTheme.focusRing}
    `,
    outline: `
      bg-transparent
      border ${currentTheme.border}
      ${currentTheme.textPrimary}
      hover:${currentTheme.bgSecondary}
      ${currentTheme.focusRing}
    `,
    ghost: `
      bg-transparent
      ${currentTheme.textSecondary}
      hover:${currentTheme.text} hover:${currentTheme.bgSecondary}
    `,
    danger: `
      bg-red-600 hover:bg-red-700 text-white
      border border-transparent
      focus:ring-red-500
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md h-9',
    md: 'px-4 py-2 text-sm rounded-lg h-10',
    lg: 'px-6 py-3 text-base rounded-lg h-12',
    icon: 'w-10 h-10 text-sm rounded-lg',
    card: 'p-4 rounded-xl h-auto text-base',
  };

  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;

  const buttonClasses = [
    baseClasses,
    layoutClasses,
    variantClasses,
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  const spinnerColor = variant === 'primary' || variant === 'danger' ? 'border-white' : `border-primary-500`;

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
              <div className={`w-5 h-5 border-2 ${spinnerColor}/30 border-t-${spinnerColor} rounded-full animate-spin`} />
            </div>
        )}
        <span className={`flex h-full w-full items-center justify-center ${layoutClasses} ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      </button>
  );
};

export default Button;