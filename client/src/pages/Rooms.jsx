import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import RoomCard from '../components/RoomCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    available: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);
      if (filters.available === 'true') params.append('available', 'true');

      const res = await api.get(`/rooms?${params.toString()}`);
      setRooms(res.data.rooms);
      setError(null);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []); // Initial load

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
    setIsFilterOpen(false); // Close mobile filter panel after apply
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      available: ''
    });
    // Need to trigger a fetch with empty filters immediately
    setTimeout(() => {
      document.getElementById('filter-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Discover Our Rooms</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From cozy singles to luxurious suites, find the perfect accommodation for your stay.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center w-full py-3 bg-slate-900 text-white rounded-lg font-bold"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="mr-2" /> 
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Sidebar / Filters */}
          <div className={`lg:w-1/4 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <FaFilter className="mr-2 text-amber-500" /> Filters
              </h2>
              
              <form id="filter-form" onSubmit={handleFilterSubmit} className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Room name..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
                    />
                  </div>
                </div>

                {/* Availability Toggle */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="available"
                      checked={filters.available === 'true'}
                      onChange={(e) => setFilters({ ...filters, available: e.target.checked ? 'true' : '' })}
                      className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show available only</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Main Content / Room Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            ) : rooms.length === 0 ? (
              <div className="bg-white p-10 rounded-xl shadow border border-gray-100 text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No rooms found</h3>
                <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-amber-600 font-medium hover:text-amber-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">{rooms.length} room(s) available</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <RoomCard key={room._id} room={room} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
