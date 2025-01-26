import React from 'react';
import { cn } from '../../lib/utils';

function GlassInput({ icon: Icon, className, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        className={cn(
          'glass-input w-full',
          Icon && 'pl-10',
          className
        )}
        {...props}
      />
    </div>
  );
}

export default GlassInput;