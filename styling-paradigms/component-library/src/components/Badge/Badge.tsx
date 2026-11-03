import React from 'react';
import { badgeStyle, type BadgeVariants } from './Badge.css';

interface BadgeProps extends BadgeVariants {
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  return <span className={badgeStyle({ variant })}>{children}</span>;
};