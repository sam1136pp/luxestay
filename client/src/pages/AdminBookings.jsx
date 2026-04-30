import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../api/axios';
import { useToast } from '../hooks/useToast';
import { FaSearch } from 'react-icons/fa';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { error } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/admin/bookings');
        setBookings(res.data.bookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [error]);

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room?.roomNumber.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Manage Bookings</h1>
          <p className="text-gray-500 mt-1">View and track all customer reservations</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name, email or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white min-w-[150px]"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Booking Details</th>
                  <th className="px-6 py-4 font-medium">Guest Info</th>
                  <th className="px-6 py-4 font-medium">Room Details</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No bookings found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium text-gray-500 block mb-1">Check In:</span>
                          {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-gray-900 mt-2">
                          <span className="font-medium text-gray-500 block mb-1">Check Out:</span>
                          {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Booked: {format(new Date(booking.createdAt), 'MMM dd')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{booking.user?.name}</div>
                        <div className="text-sm text-gray-500">{booking.user?.email}</div>
                        <div className="text-sm text-gray-500">{booking.user?.phone || 'No phone'}</div>
                        <div className="text-xs bg-gray-100 inline-block px-2 py-1 rounded mt-1">{booking.guests} Guest(s)</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">Room {booking.room?.roomNumber}</div>
                        <div className="text-sm text-amber-600 font-medium">{booking.room?.type}</div>
                        <div className="text-xs text-gray-500 mt-1">₹{booking.room?.pricePerNight}/night</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-lg">₹{booking.totalPrice}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize
                          ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminBookings;
