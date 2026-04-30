import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaWifi, FaCoffee, FaTv } from 'react-icons/fa';

const RoomCard = ({ room }) => {
  // Map some basic amenities to icons
  const renderAmenityIcon = (amenity) => {
    const am = amenity.toLowerCase();
    if (am.includes('wifi')) return <FaWifi title="WiFi" />;
    if (am.includes('tv')) return <FaTv title="TV" />;
    if (am.includes('service') || am.includes('coffee')) return <FaCoffee title="Room Service" />;
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      {/* Image container with fixed aspect ratio */}
      <div className="relative h-48 sm:h-56 overflow-hidden group">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {room.type}
        </div>
        
        {/* Availability Badge */}
        <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${room.isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {room.isAvailable ? 'Available' : 'Booked'}
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{room.name}</h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-amber-500">₹{room.pricePerNight}</span>
            <span className="text-gray-500 text-sm block">/ night</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Info row */}
        <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <FaUserFriends className="mr-2 text-slate-400" />
            <span>Up to {room.capacity} Guests</span>
          </div>
          
          <div className="flex space-x-2 text-slate-400">
            {room.amenities && room.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index}>{renderAmenityIcon(amenity)}</span>
            ))}
            {room.amenities && room.amenities.length > 3 && (
              <span className="text-xs self-center">+{room.amenities.length - 3}</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/rooms/${room._id}`}
          className={`w-full text-center py-2 rounded-lg font-bold transition-colors ${
            room.isAvailable 
              ? 'bg-slate-900 text-white hover:bg-slate-800' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
          }`}
        >
          {room.isAvailable ? 'View Details' : 'Currently Unavailable'}
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
