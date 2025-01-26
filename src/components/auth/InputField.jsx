import React from 'react';
import { cn } from '../../lib/utils';

export default function InputField({
  icon: Icon,
  type = 'text',
  className,
  ...props
}) {
  return (
    <div className="relative transform transition-all duration-300 hover:scale-[1.02]">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type={type}
        className={cn(
          "w-full pl-12 pr-4 py-3 rounded-xl",
          "glass-input",
          "text-gray-900 dark:text-white",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "transition-all duration-300",
          className
        )}
        {...props}
      />
    </div>
  );
}