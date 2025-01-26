import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Award,
  Users,
  FileCheck
} from 'lucide-react';

export default function NavbarMenu({ isMobile = false }) {
  const { user } = useAuth();

  const menuItems = user?.role === 'admin' ? [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Certificates', path: '/admin/certificates', icon: FileCheck }
  ] : [
    { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { label: 'Events', path: '/student/events', icon: Calendar },
    { label: 'Calendar', path: '/student/calendar', icon: Calendar },
    { label: 'My Events', path: '/student/my-events', icon: Users }
  ];

  const className = isMobile
    ? 'flex flex-col space-y-4'
    : 'hidden md:flex md:space-x-8';

  return (
    <nav className={className}>
      {menuItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-center space-x-2 text-gray-700 hover:text-primary 
                     dark:text-gray-200 dark:hover:text-primary transition-colors"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}