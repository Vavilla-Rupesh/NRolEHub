import React, { useState } from 'react';
import { Award, Download } from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

function SubEventRegistration({ subevent, eventId }) {
  const [registering, setRegistering] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      // First create registration
      const registration = await api.post('/registrations/register', {
        event_id: eventId,
        subevent_id: subevent.id
      });

      // Initialize payment
      const paymentResponse = await api.post('/payments/create', {
        registration_id: registration.data.id,
        amount: subevent.fee * 100, // Convert to paise
        currency: 'INR'
      });

      setPaymentData(paymentResponse.data.payment);

      // Initialize Razorpay
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: paymentResponse.data.payment.amount,
        currency: paymentResponse.data.payment.currency,
        name: 'Campus Connect',
        description: `Registration for ${subevent.title}`,
        order_id: paymentResponse.data.payment.razorpay_order_id,
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              registration_id: registration.data.id
            });
            toast.success('Registration successful!');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div>
          <h3 className="event-card-title">{subevent.title}</h3>
          <p className="event-card-subtitle">{subevent.description}</p>
        </div>
        <span className="event-card-price">₹{subevent.fee}</span>
      </div>

      <div className="event-card-footer">
        {subevent.isRegistered ? (
          <div className="flex space-x-4">
            <button
              onClick={() => window.open(`/api/leaderboard/${subevent.id}`, '_blank')}
              className="btn btn-secondary btn-icon"
            >
              <Award className="h-4 w-4 mr-2" />
              View Leaderboard
            </button>

            {subevent.certificate_Generated && (
              <button
                onClick={() => window.open(`/api/certificates/${subevent.id}`, '_blank')}
                className="btn btn-primary btn-icon"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleRegister}
            disabled={registering}
            className="btn btn-primary w-full"
          >
            {registering ? 'Processing...' : 'Register Now'}
          </button>
        )}
      </div>
    </div>
  );
}

export default SubEventRegistration;