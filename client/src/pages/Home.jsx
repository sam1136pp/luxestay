import React from 'react';
import { Link } from 'react-router-dom';
import { FaSwimmingPool, FaWifi, FaCoffee, FaConciergeBell, FaSpa, FaDumbbell } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[80vh] flex items-center justify-center bg-slate-900 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Discover <span className="text-amber-500">Extraordinary</span> Luxury
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow">
            Experience world-class service, stunning architecture, and unforgettable moments at LuxeStay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/rooms" 
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg text-lg transition-transform hover:scale-105 shadow-xl"
            >
              Book Your Stay
            </Link>
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-lg text-lg transition-all shadow-xl"
            >
              Join Member Club
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Amenities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">World-Class Amenities</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Everything you need for a perfect stay, designed with your ultimate comfort in mind.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { icon: <FaSwimmingPool size={40} />, name: "Infinity Pool" },
              { icon: <FaWifi size={40} />, name: "High-Speed WiFi" },
              { icon: <FaSpa size={40} />, name: "Luxury Spa" },
              { icon: <FaDumbbell size={40} />, name: "Fitness Center" },
              { icon: <FaCoffee size={40} />, name: "Gourmet Dining" },
              { icon: <FaConciergeBell size={40} />, name: "24/7 Concierge" },
            ].map((amenity, index) => (
              <div key={index} className="flex flex-col items-center p-6 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="text-amber-500 mb-4 transform transition-transform group-hover:-translate-y-2 duration-300">
                  {amenity.icon}
                </div>
                <h3 className="font-semibold text-slate-800">{amenity.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Rooms Teaser */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Rooms</h2>
              <div className="w-24 h-1 bg-amber-500"></div>
            </div>
            <Link to="/rooms" className="hidden sm:inline-flex items-center text-amber-600 font-bold hover:text-amber-700">
              View All Rooms &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hardcoded teaser rooms for the home page layout */}
            {[
              {
                name: "Ocean View Deluxe",
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                price: 4200
              },
              {
                name: "Presidential Suite",
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
                price: 8500
              },
              {
                name: "Executive Double",
                image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
                price: 3600
              }
            ].map((room, index) => (
              <div key={index} className="group rounded-2xl overflow-hidden shadow-lg cursor-pointer relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10"></div>
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-80 object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <h3 className="text-2xl font-bold text-white mb-2">{room.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-amber-400 font-bold">From ₹{room.price} / night</p>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white flex items-center">
                      Explore &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/rooms" className="inline-block px-6 py-3 border-2 border-slate-900 text-slate-900 font-bold rounded hover:bg-slate-900 hover:text-white transition-colors">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-amber-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready for an unforgettable experience?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Join our membership program today and get exclusive access to special rates, free upgrades, and priority booking.
          </p>
          <Link 
            to="/register" 
            className="inline-block px-10 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          >
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
