import React, { ButtonHTMLAttributes } from 'react';
import { buttonStyle, type ButtonVariants } from './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant, size, children, className, ...props }) => {
  return (
    <button className={buttonStyle({ variant, size })} {...props}>
      {children}
    </button>
  );
};