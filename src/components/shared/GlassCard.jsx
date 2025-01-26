import React from 'react';
import { cn } from '../../lib/utils';

function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <div 
      className={cn(
        'glass-card',
        hover && 'hover:scale-[1.02]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;