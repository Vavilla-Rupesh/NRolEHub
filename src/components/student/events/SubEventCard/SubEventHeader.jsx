import React from 'react';
import { IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../../../lib/utils';

function SubEventHeader({ title, description, fee }) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
      </div>
      <div className="flex items-center space-x-1 text-primary font-bold">
        <IndianRupee className="h-4 w-4" />
        <span>{formatCurrency(fee)}</span>
      </div>
    </div>
  );
}

export default SubEventHeader;