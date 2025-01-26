import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export function usePayment() {
  const [processing, setProcessing] = useState(false);

  const initializePayment = async (registrationData, amount) => {
    if (processing) return;
    
    try {
      setProcessing(true);

      // Create registration first
      const registrationResponse = await api.post('/registrations/register', {
        student_id: registrationData.student_id,
        event_id: registrationData.event_id,
        subevent_id: registrationData.subevent_id,
        student_name: registrationData.student_name,
        student_email: registrationData.student_email,
        event_name: registrationData.event_name,
      });

      const registration_id = registrationResponse.data.id;

      // Create payment order
      const response = await api.post('/payments/create', {
        ...registrationData,
        registration_id,
        amount: amount * 100 // Convert to paise
      });

      const { payment } = response.data;

      // Initialize Razorpay
      const options = {
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_xsO2YXEJiNnEMm',
        amount: payment.amount,
        currency: 'INR',
        name: 'Campus Connect',
        description: `Registration for ${registrationData.event_name}`,
        order_id: payment.razorpay_order_id,
        prefill: {
          name: registrationData.student_name,
          email: registrationData.student_email
        },
        handler: async function(razorpayResponse) {
          try {
            const verificationData = {
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              registration_id
            };

            const verificationResponse = await api.post('/payments/verify', verificationData);

            if (verificationResponse.data.success) {
              toast.success('Payment successful!');
              return { success: true, registration_id };
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.message || 'Payment verification failed');
            return { success: false };
          }
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      return { success: true, registration_id };
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(error.response?.data?.message || 'Payment initialization failed');
      return { success: false };
    } finally {
      setProcessing(false);
    }
  };

  return { initializePayment, processing };
}