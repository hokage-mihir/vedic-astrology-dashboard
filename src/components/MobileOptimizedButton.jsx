import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const MobileOptimizedButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  ariaLabel,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    touch-manipulation
  `;

  const sizeClasses = {
    small: 'px-3 py-2 text-sm min-h-[44px]',
    medium: 'px-4 py-3 text-base min-h-[48px]',
    large: 'px-6 py-4 text-lg min-h-[52px]'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-cosmic-purple-600 to-cosmic-blue-600
      text-white
      hover:from-cosmic-purple-700 hover:to-cosmic-blue-700
      focus:ring-cosmic-purple-500
      shadow-lg hover:shadow-xl
      transform hover:scale-105 active:scale-95
    `,
    secondary: `
      bg-white border-2 border-gray-300
      text-gray-700
      hover:border-cosmic-purple-500 hover:text-cosmic-purple-600
      focus:ring-cosmic-purple-500
    `,
    outline: `
      border-2 border-cosmic-purple-600
      text-cosmic-purple-600
      hover:bg-cosmic-purple-50
      focus:ring-cosmic-purple-500
    `
  };

  const motionProps = !prefersReducedMotion ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default MobileOptimizedButton;