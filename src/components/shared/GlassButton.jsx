import React from 'react';
import { cn } from '../../lib/utils';

function GlassButton({ children, className, icon: Icon, ...props }) {
  return (
    <button
      className={cn(
        'glass-button inline-flex items-center justify-center',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
}

export default GlassButton;