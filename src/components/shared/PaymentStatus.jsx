import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

function PaymentStatus({ status }) {
  if (status === 'paid') {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span>Payment Successful</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <XCircle className="h-5 w-5" />
        <span>Payment Failed</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-yellow-600">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />
      <span>Processing Payment</span>
    </div>
  );
}

export default PaymentStatus;