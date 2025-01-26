import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Shield, Phone, Hash, Calendar, Building, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import InputField from './InputField';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    mobile_number: '',
    roll_number: '',
    college_name: '',
    stream: '',
    year: '',
    semester: ''
  });
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');
  const [tempId, setTempId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.role === 'student') {
      if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
        toast.error('Please enter a valid 10-digit mobile number');
        return;
      }

      if (!formData.college_name?.trim()) {
        toast.error('College name is required');
        return;
      }

      if (!formData.stream?.trim()) {
        toast.error('Stream/Branch is required');
        return;
      }
    }

    try {
      setLoading(true);
      
      if (!showOTPInput) {
        // First step: Register and get OTP
        const response = await register(formData);
        if (response.temp_id) {
          setTempId(response.temp_id);
          setShowOTPInput(true);
          toast.success('OTP sent to your email');
        } else {
          throw new Error('Failed to get temporary ID');
        }
      } else {
        // Second step: Verify OTP
        if (!otp || otp.length !== 6) {
          toast.error('Please enter a valid 6-digit OTP');
          return;
        }

        const response = await register({ 
          temp_id: tempId, 
          otp: otp.toString()
        });

        if (response.user && response.token) {
          toast.success('Registration successful!');
          navigate(`/${response.user.role}`);
        } else {
          throw new Error('Invalid response from server');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      
      // Reset OTP input if verification fails
      if (showOTPInput) {
        setOTP('');
      }
    } finally {
      setLoading(false);
    }
  };

  const STREAMS = [
    'B.Tech - Computer Science',
    'B.Tech - Information Technology',
    'B.Tech - Electronics',
    'B.Tech - Mechanical',
    'B.Tech - Civil',
    'B.Tech - Electrical',
    'B.Tech - Chemical',
    'B.Tech - Biotechnology',
    'Other'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      {/* Background animations */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-[20%] right-[15%] w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[15%] left-[15%] w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass-card backdrop-blur-lg bg-white/10 dark:bg-gray-900/10 rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="glass-icon-container p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <Shield className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {showOTPInput ? 'Verify OTP' : 'Create Account'}
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {showOTPInput ? 'Enter the OTP sent to your email' : 'Join Campus Connect today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {showOTPInput ? (
              <InputField
                icon={Lock}
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 6) {
                    setOTP(value);
                  }
                }}
                required
                maxLength={6}
                pattern="\d{6}"
                title="Please enter a valid 6-digit OTP"
              />
            ) : (
              <>
                <InputField
                  icon={User}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />

                <InputField
                  icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <InputField
                  icon={Lock}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <InputField
                  icon={Lock}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Role
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'student' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.role === 'student'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <User className="h-6 w-6 mx-auto mb-2" />
                      <span className="block text-sm font-medium">Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'admin' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.role === 'admin'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Shield className="h-6 w-6 mx-auto mb-2" />
                      <span className="block text-sm font-medium">Admin</span>
                    </button>
                  </div>
                </div>

                {formData.role === 'student' && (
                  <div className="space-y-4">
                    <InputField
                      icon={Phone}
                      type="tel"
                      name="mobile_number"
                      placeholder="Mobile Number"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                      required
                      pattern="[0-9]{10}"
                    />

                    <InputField
                      icon={Hash}
                      type="text"
                      name="roll_number"
                      placeholder="Roll Number"
                      value={formData.roll_number}
                      onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                      required
                    />

                    <InputField
                      icon={Building}
                      type="text"
                      name="college_name"
                      placeholder="College Name"
                      value={formData.college_name}
                      onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                      required
                    />
<div>
  <label className="block text-sm font-medium mb-1">Stream/Branch</label>
  <InputField
    icon={BookOpen}
    type="text"
    name="stream"
    placeholder="Stream/Branch"
    value={formData.stream}
    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
    required
  />
</div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <select
                          className="input w-full"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          required
                        >
                          <option value="">Select Year</option>
                          {[1, 2, 3, 4].map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Semester</label>
                        <select
                          className="input w-full"
                          value={formData.semester}
                          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                          required
                        >
                          <option value="">Select Semester</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

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
              {loading ? 'Processing...' : (showOTPInput ? 'Verify OTP' : 'Create Account')}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}