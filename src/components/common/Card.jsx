import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false,
  clickable = false,
  onClick,
  variant = 'default',
  ...props 
}) => {
  const { currentTheme } = useDarkMode();

  const variants = {
    default: `
      ${currentTheme.bgCard} backdrop-blur-sm
      border border-surface-200/60 dark:border-surface-700/60
      shadow-lg shadow-surface-900/5
      rounded-3xl
    `,
    elevated: `
      ${currentTheme.bgCard} backdrop-blur-sm
      border border-white/20 dark:border-surface-700/50
      shadow-xl shadow-surface-900/10
      rounded-3xl
      bg-gradient-to-br from-white/80 to-white/60 dark:from-surface-800/80 dark:to-surface-900/60
    `,
    glass: `
      backdrop-blur-xl bg-white/10 dark:bg-surface-800/10
      border border-white/20 dark:border-surface-700/30
      shadow-2xl shadow-surface-900/20
      rounded-3xl
    `,
    gradient: `
      bg-gradient-to-br from-surface-50/90 via-white/80 to-surface-100/90 
      dark:from-surface-800/90 dark:via-surface-900/80 dark:to-surface-800/90
      backdrop-blur-sm border border-surface-200/60 dark:border-surface-700/60
      shadow-xl shadow-surface-900/10
      rounded-3xl
    `
  };

  const baseClasses = `
    ${variants[variant] || variants.default}
    transition-all duration-300 ease-out
  `;

  const hoverClasses = hover || clickable ? `
    hover:shadow-xl hover:shadow-surface-900/15
    hover:border-surface-300/80 dark:hover:border-surface-600/80
    hover:scale-[1.02] hover:-translate-y-1
    ${clickable ? 'cursor-pointer active:scale-[0.98] active:translate-y-0' : ''}
  ` : '';

  const classes = `
    ${baseClasses}
    ${hoverClasses}
    ${padding}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const CardComponent = clickable ? 'button' : 'div';

  return (
    <CardComponent
      className={classes}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </CardComponent>
  );
};

export default Card;
