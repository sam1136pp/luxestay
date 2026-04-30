import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { FaWifi, FaTv, FaCoffee, FaConciergeBell, FaUserFriends, FaChevronLeft } from 'react-icons/fa';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { success, error } = useToast();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Booking Form State
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data.room);
      } catch (err) {
        error('Failed to load room details');
        navigate('/rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate, error]);

  // Calculate total price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate && room) {
      // Set to midnight to avoid timezone issues when calculating days
      const start = new Date(checkInDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(checkOutDate);
      end.setHours(0, 0, 0, 0);
      
      const timeDiff = end.getTime() - start.getTime();
      const nightCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (nightCount > 0) {
        setTotalPrice(nightCount * room.pricePerNight);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, room]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      error('Please login to book a room');
      navigate('/login');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      error('Please select check-in and check-out dates');
      return;
    }

    if (checkOutDate <= checkInDate) {
      error('Check-out date must be after check-in date');
      return;
    }

    if (user.role === 'admin') {
      error('Admins cannot book rooms. Please use a customer account.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/bookings', {
        roomId: room._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: Number(guests)
      });
      
      success(res.data.message);
      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!room) return null;

  // Filter dates before today for check-in
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate.getTime() <= time.getTime();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate('/rooms')}
          className="flex items-center text-gray-500 hover:text-amber-500 transition-colors mb-6 font-medium"
        >
          <FaChevronLeft className="mr-2" /> Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Images + Details) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] sm:h-[500px]">
              <img 
                src={room.imageUrl} 
                alt={room.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {room.type}
                    </span>
                    <span className="text-gray-500 font-medium">Room {room.roomNumber}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900">{room.name}</h1>
                </div>
                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                  <div className="text-3xl font-bold text-amber-500">₹{room.pricePerNight}</div>
                  <div className="text-gray-500 text-sm">per night</div>
                </div>
              </div>

              <div className="prose max-w-none text-gray-600 mb-8">
                <p>{room.description}</p>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-gray-600">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-slate-500">
                      {/* Dynamic icon mapping - simplified */}
                      {amenity.toLowerCase().includes('wifi') ? <FaWifi /> :
                       amenity.toLowerCase().includes('tv') ? <FaTv /> :
                       amenity.toLowerCase().includes('service') ? <FaConciergeBell /> :
                       <FaCoffee />}
                    </span>
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
                <div className="flex items-center text-gray-600">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-slate-500">
                    <FaUserFriends />
                  </span>
                  <span className="text-sm font-medium">Up to {room.capacity} Guests</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Book this room</h2>

              {!room.isAvailable ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center">
                  <p className="font-bold">Not Available</p>
                  <p className="text-sm mt-1">This room is currently blocked or under maintenance.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => setCheckInDate(date)}
                      selectsStart
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={new Date()}
                      placeholderText="Select date"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      selectsEnd
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={checkInDate || new Date()}
                      placeholderText="Select date"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      required
                      disabled={!checkInDate}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
                      required
                    >
                      {[...Array(room.capacity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Calculation Display */}
                  {totalPrice > 0 && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>₹{room.pricePerNight} × {totalPrice / room.pricePerNight} nights</span>
                        <span>₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Taxes & Fees</span>
                        <span className="text-emerald-500">Included</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center font-bold text-lg text-slate-900">
                        <span>Total Price</span>
                        <span>₹{totalPrice}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingLoading || !checkInDate || !checkOutDate}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg text-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      You will be redirected to login first.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
