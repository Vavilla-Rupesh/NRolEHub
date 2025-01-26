import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useRazorpay } from '../../../../lib/hooks/useRazorpay';
import toast from 'react-hot-toast';

function RegistrationButton({ subevent, eventId, onUpdate }) {
  const { user } = useAuth();
  const { processPayment, loading } = useRazorpay();

  const handleRegister = async () => {
    try {
      const paymentData = {
        student_id: user.id,
        student_name: user.username,
        student_email: user.email,
        event_id: eventId,
        subevent_id: subevent.id,
        event_name: subevent.title,
        amount: subevent.fee * 100 // Convert to paise
      };

      const result = await processPayment(paymentData);
      
      if (result?.success) {
        onUpdate?.();
      }
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  return (
    <button
      onClick={handleRegister}
      disabled={loading}
      className="btn btn-primary w-full"
    >
      {loading ? 'Processing...' : 'Register Now'}
    </button>
  );
}

export default RegistrationButton;