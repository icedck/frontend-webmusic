import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false,
  clickable = false,
  onClick,
  ...props 
}) => {
  const { currentTheme } = useDarkMode();

  const baseClasses = `
    ${currentTheme.bgCard} 
    ${currentTheme.border} 
    border rounded-xl shadow-sm
    transition-all duration-200
  `;

  const hoverClasses = hover || clickable ? `
    hover:shadow-md hover:${currentTheme.borderHover}
    ${clickable ? 'cursor-pointer' : ''}
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
      {children}
    </CardComponent>
  );
};

export default Card;
