import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import BookingCard from '../components/BookingCard';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { success, error } = useToast();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        await api.put(`/bookings/${bookingId}/cancel`);
        success('Booking cancelled successfully');
        // Refresh the list
        fetchBookings();
      } catch (err) {
        error(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Separate bookings by status for better display
  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-slate-900 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-300">Manage your stays and explore new destinations.</p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          
          {/* Active Bookings Section */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Upcoming Stays</h2>
              <Link to="/rooms" className="text-amber-600 font-medium hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
                Book a new room
              </Link>
            </div>

            {activeBookings.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧳</span>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No upcoming bookings</h3>
                <p className="text-gray-500 mb-6">You don't have any confirmed stays coming up.</p>
                <Link to="/rooms" className="inline-block px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded hover:bg-amber-600 transition-colors">
                  Explore Rooms
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {activeBookings.map(booking => (
                  <BookingCard 
                    key={booking._id} 
                    booking={booking} 
                    onCancel={handleCancelBooking} 
                  />
                ))}
              </div>
            )}
          </section>

          {/* Past Bookings Section */}
          {pastBookings.length > 0 && (
            <section className="pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Booking History</h2>
              <div className="grid gap-6 opacity-75">
                {pastBookings.map(booking => (
                  <BookingCard 
                    key={booking._id} 
                    booking={booking} 
                    onCancel={handleCancelBooking} 
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
