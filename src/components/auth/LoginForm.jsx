import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import InputField from './InputField';
import { handleLoginError, validateLoginCredentials } from '../../lib/auth';
import toast from 'react-hot-toast';

export default function LoginForm({ onSuccess }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateLoginCredentials(credentials.email, credentials.password);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const user = await login(credentials.email, credentials.password);
      onSuccess(user);
    } catch (error) {
      const errorMessage = handleLoginError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
      <InputField
        icon={Mail}
        type="email"
        name="email"
        placeholder="Email address"
        value={credentials.email}
        onChange={handleChange}
        required
        autoComplete="email"
      />

      <InputField
        icon={Lock}
        type="password"
        name="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={loading}
        className="glass-button w-full py-3 px-4 rounded-xl font-medium text-white
                 bg-gradient-to-r from-primary to-secondary
                 hover:from-primary/90 hover:to-secondary/90
                 transform transition-all duration-300
                 hover:scale-[1.02] hover:shadow-lg
                 disabled:opacity-50 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <span className="relative z-10">
          {loading ? 'Signing in...' : 'Sign in'}
        </span>
      </button>
    </form>
  );
}