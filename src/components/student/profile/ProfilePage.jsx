import React, { useState } from 'react';
import { User, Mail, Award } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import Badge from '../../shared/Badge';

function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.username}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium">Total Points:</span>
              <Badge>{user?.total_app_points || 0} points</Badge>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                className="input"
                value={user?.username}
                disabled={!editing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="input"
                value={user?.email}
                disabled={!editing}
              />
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="btn btn-primary w-full"
            >
              {editing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;