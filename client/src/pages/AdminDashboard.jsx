import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api/axios';
import { useToast } from '../hooks/useToast';
import { FaBook, FaBed, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
        setRecentBookings(res.data.recentBookings);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, colorClass, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start">
      <div className={`p-4 rounded-lg mr-4 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your hotel operations</p>
          </div>
          
          <div className="flex gap-3">
            <Link to="/admin/rooms" className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Manage Rooms
            </Link>
            <Link to="/admin/bookings" className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-bold hover:bg-amber-600 transition-colors">
              All Bookings
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Revenue" 
            value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
            icon={<FaMoneyBillWave size={24} className="text-emerald-600" />}
            colorClass="bg-emerald-100"
            subtitle="From confirmed/completed"
          />
          <StatCard 
            title="Active Bookings" 
            value={stats?.activeBookings || 0}
            icon={<FaBook size={24} className="text-blue-600" />}
            colorClass="bg-blue-100"
            subtitle={`${stats?.totalBookings || 0} total all time`}
          />
          <StatCard 
            title="Available Rooms" 
            value={stats?.availableRooms || 0}
            icon={<FaBed size={24} className="text-amber-600" />}
            colorClass="bg-amber-100"
            subtitle={`${stats?.occupiedRooms || 0} currently occupied`}
          />
          <StatCard 
            title="Total Customers" 
            value={stats?.totalCustomers || 0}
            icon={<FaUsers size={24} className="text-purple-600" />}
            colorClass="bg-purple-100"
            subtitle="Registered users"
          />
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-amber-600 text-sm font-medium hover:text-amber-700">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Guest</th>
                  <th className="px-6 py-4 font-medium">Room</th>
                  <th className="px-6 py-4 font-medium">Dates</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No recent bookings found
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{booking.user?.name}</div>
                        <div className="text-sm text-gray-500">{booking.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">Room {booking.room?.roomNumber}</div>
                        <div className="text-sm text-gray-500">{booking.room?.type}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        ₹{booking.totalPrice}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
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

export default AdminDashboard;
