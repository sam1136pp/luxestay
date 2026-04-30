import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaBars, FaTimes, FaHotel } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <FaHotel className="h-8 w-8 text-amber-500" />
              <span className="font-bold text-xl tracking-wider text-amber-500">LuxeStay</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-amber-500 transition-colors font-medium">Home</Link>
            <Link to="/rooms" className="hover:text-amber-500 transition-colors font-medium">Rooms</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to={dashboardLink} className="hover:text-amber-500 transition-colors font-medium">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 bg-slate-800 py-1 px-3 rounded-full">
                  <FaUserCircle className="text-amber-500" />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-amber-500 transition-colors font-medium">Login</Link>
                <Link
                  to="/register"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded font-bold transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/rooms"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700"
              onClick={() => setIsOpen(false)}
            >
              Rooms
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardLink}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 text-amber-500 border-t border-slate-700 mt-2">
                  Signed in as: {user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="border-t border-slate-700 pt-2 pb-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-amber-500 hover:bg-slate-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
