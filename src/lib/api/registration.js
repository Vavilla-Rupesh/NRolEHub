import api from '../api';

export async function createRegistration(registrationData) {
  try {
    const response = await api.post('/registrations/register', registrationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export async function createPayment(paymentData) {
  try {
    const response = await api.post('/payments/create', paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment initialization failed');
  }
}

export async function verifyPayment(verificationData) {
  try {
    const response = await api.post('/payments/verify', verificationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
}