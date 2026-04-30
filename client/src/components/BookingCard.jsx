import React from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaDoorOpen, FaUsers } from 'react-icons/fa';

const BookingCard = ({ booking, onCancel }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-200">Confirmed</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-red-200">Cancelled</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">Completed</span>;
      default:
        return null;
    }
  };

  const isCancelable = booking.status === 'confirmed' && new Date(booking.checkIn) > new Date();

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-5 flex flex-col md:flex-row gap-6">
      {/* Room Image - hidden on small mobile, visible on tablet+ */}
      <div className="hidden md:block w-48 h-32 flex-shrink-0">
        <img 
          src={booking.room?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
          alt={booking.room?.name} 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-slate-800">
              {booking.room?.name || 'Room No Longer Available'}
            </h3>
            {getStatusBadge(booking.status)}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <FaDoorOpen className="mr-2 text-slate-400" />
              <span>Room {booking.room?.roomNumber} ({booking.room?.type})</span>
            </div>
            <div className="flex items-center">
              <FaUsers className="mr-2 text-slate-400" />
              <span>{booking.guests} Guest(s)</span>
            </div>
            <div className="flex items-center sm:col-span-2">
              <FaCalendarAlt className="mr-2 text-slate-400" />
              <span>
                {format(new Date(booking.checkIn), 'MMM dd, yyyy')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-auto">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="text-xl font-bold text-slate-800">₹{booking.totalPrice}</p>
          </div>
          
          {isCancelable && (
            <button
              onClick={() => onCancel(booking._id)}
              className="px-4 py-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
