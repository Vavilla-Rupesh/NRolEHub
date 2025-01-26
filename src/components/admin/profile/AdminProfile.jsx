import React, { useState } from 'react';
import { User, Mail, Shield, Key } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

function AdminProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add API call to update profile
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Profile</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.username}</h2>
              <div className="flex items-center space-x-2 mt-1 text-gray-600 dark:text-gray-300">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="mt-2">
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              onClick={() => !isEditing && setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;