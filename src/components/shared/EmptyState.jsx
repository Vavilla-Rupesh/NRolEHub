import React from 'react';
import { AlertCircle } from 'lucide-react';

function EmptyState({ title, message, icon: Icon = AlertCircle }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Icon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

export default EmptyState;