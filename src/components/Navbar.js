import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold tracking-wide text-white">Distributo</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard') 
                    ? 'bg-primary-700 text-white' 
                    : 'text-white/90 hover:bg-primary-700 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/agents"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/agents') 
                    ? 'bg-primary-700 text-white' 
                    : 'text-white/90 hover:bg-primary-700 hover:text-white'
                }`}
              >
                Agents
              </Link>
              <Link
                to="/lists"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/lists') 
                    ? 'bg-primary-700 text-white' 
                    : 'text-white/90 hover:bg-primary-700 hover:text-white'
                }`}
              >
                Lists
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center">
            {currentUser && (
              <div className="text-white/90 mr-4">
                Signed in as: <span className="text-white font-medium">{currentUser.email}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-primary border-white text-white hover:bg-primary-700"
            >
              Logout
            </button>
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-700 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="h-6 w-6" 
                stroke="currentColor" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard')
                  ? 'bg-primary-700 text-white'
                  : 'text-white/90 hover:text-white hover:bg-primary-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/agents"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/agents')
                  ? 'bg-primary-700 text-white'
                  : 'text-white/90 hover:text-white hover:bg-primary-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Agents
            </Link>
            <Link
              to="/lists"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/lists')
                  ? 'bg-primary-700 text-white'
                  : 'text-white/90 hover:text-white hover:bg-primary-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Lists
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-primary-700">
            {currentUser && (
              <div className="px-4 text-white/90 text-sm">
                Signed in as: <span className="text-white font-medium">{currentUser.email}</span>
              </div>
            )}
            <div className="mt-3 px-2 pb-3">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-700 hover:bg-primary-600 text-center"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 