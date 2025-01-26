// Authentication utility functions
export const handleLoginError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred during login';
};

export const validateLoginCredentials = (email, password) => {
  if (!email) {
    return 'Email is required';
  }
  if (!password) {
    return 'Password is required';
  }
  return null;
};