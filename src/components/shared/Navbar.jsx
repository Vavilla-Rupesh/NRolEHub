import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Menu, X } from 'lucide-react';
import NavbarMenu from './NavbarMenu';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="glass-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="glass-icon-container p-2 rounded-full 
                          bg-gradient-to-br from-primary/20 to-secondary/20
                          group-hover:scale-110 transition-all duration-300">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary 
                           bg-clip-text text-transparent">
              Campus Connect
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex md:items-center md:space-x-6">
              <NavbarMenu />
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            {user && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="glass-button ml-2 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="glass-morphism md:hidden p-4 animate-float">
          <NavbarMenu isMobile />
        </div>
      )}
    </header>
  );
}