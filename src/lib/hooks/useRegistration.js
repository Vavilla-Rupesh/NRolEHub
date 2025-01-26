import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export function useRegistration(eventId, subEventId) {
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!eventId || !subEventId) return;
      
      try {
        setLoading(true);
        const response = await api.get('/registrations/my-registrations');
        const registration = response.data.find(
          reg => 
            reg.event_id === parseInt(eventId) && 
            reg.subevent_id === parseInt(subEventId) && 
            reg.payment_status === 'paid'
        );
        setIsRegistered(!!registration);
      } catch (error) {
        console.error('Failed to check registration status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRegistrationStatus();
  }, [eventId, subEventId]);

  const handleRegistration = async (registrationData, onSuccess) => {
    if (registering || isRegistered) return;

    try {
      setRegistering(true);

      // Initialize Razorpay payment directly without creating a pending registration
      const paymentResponse = await api.post('/payments/create', {
        ...registrationData,
        amount: registrationData.fee * 100 // Convert to paise
      });

      const { order_id, key } = paymentResponse.data;

      // Initialize Razorpay
      const options = {
        key,
        amount: registrationData.fee * 100,
        currency: 'INR',
        name: 'Campus Connect',
        description: `Registration for ${registrationData.event_name}`,
        order_id,
        prefill: {
          name: registrationData.student_name,
          email: registrationData.student_email
        },
        handler: async function(response) {
          try {
            // Create registration only after successful payment
            const registrationResponse = await api.post('/registrations/register', {
              ...registrationData,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              payment_status: 'paid'
            });

            if (registrationResponse.data) {
              setIsRegistered(true);
              toast.success('Registration successful!');
              onSuccess?.();
            }
          } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed after payment');
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

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  return { handleRegistration, registering, isRegistered, loading };
}