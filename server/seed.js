// ============================================
// Database Seed Script
// ============================================
// Populates the database with sample data:
// - 1 Admin user (admin@hotel.com / admin123)
// - 1 Customer user (customer@hotel.com / customer123)
// - 30 Rooms (10 Single, 10 Double, 10 Deluxe)
// - 5 Sample bookings
//
// Usage: npm run seed (or node seed.js)

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

// Load environment variables
dotenv.config();

// ---- Sample Room Data (30 rooms) ----
const roomsData = [
  {
    name: "Ocean View Hotel",
    roomNumber: 101,
    type: "Deluxe",
    pricePerNight: 4200,
    isAvailable: true,
    description: "Sea-facing deluxe room with balcony and modern amenities",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Mini Bar"],
    capacity: 3
  },
  {
    name: "City Comfort Inn",
    roomNumber: 102,
    type: "Single",
    pricePerNight: 1500,
    isAvailable: true,
    description: "Affordable single room in the heart of the city",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
    amenities: ["WiFi", "AC", "TV"],
    capacity: 1
  },
  {
    name: "Royal Palace Hotel",
    roomNumber: 103,
    type: "Double",
    pricePerNight: 2800,
    isAvailable: true,
    description: "Spacious double room with luxury interiors",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Mini Bar"],
    capacity: 2
  },
  {
    name: "Sunrise Residency",
    roomNumber: 104,
    type: "Single",
    pricePerNight: 1300,
    isAvailable: true,
    description: "Cozy single room with natural lighting",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    amenities: ["WiFi", "AC", "TV"],
    capacity: 1
  },
  {
    name: "Grand Horizon",
    roomNumber: 105,
    type: "Deluxe",
    pricePerNight: 5000,
    isAvailable: true,
    description: "Premium deluxe room with city skyline view",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Mini Bar", "Jacuzzi"],
    capacity: 4
  },
  {
    name: "Budget Stay Lodge",
    roomNumber: 106,
    type: "Single",
    pricePerNight: 1000,
    isAvailable: true,
    description: "Budget-friendly single room for quick stays",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    amenities: ["WiFi", "AC"],
    capacity: 1
  },
  {
    name: "Elite Suites",
    roomNumber: 107,
    type: "Deluxe",
    pricePerNight: 4800,
    isAvailable: true,
    description: "Luxury suite with king-size bed and lounge area",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Mini Bar", "Lounge"],
    capacity: 3
  },
  {
    name: "Comfort Zone Hotel",
    roomNumber: 108,
    type: "Double",
    pricePerNight: 2600,
    isAvailable: true,
    description: "Comfortable double room with all essentials",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service"],
    capacity: 2
  },
  {
    name: "Urban Stay",
    roomNumber: 109,
    type: "Single",
    pricePerNight: 1700,
    isAvailable: true,
    description: "Modern single room for business travelers",
    imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
    amenities: ["WiFi", "AC", "TV", "Desk"],
    capacity: 1
  },
  {
    name: "Green Leaf Hotel",
    roomNumber: 110,
    type: "Double",
    pricePerNight: 2400,
    isAvailable: true,
    description: "Eco-friendly hotel with peaceful ambiance",
    imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service"],
    capacity: 2
  },
  {
    name: "Skyline Resort",
    roomNumber: 111,
    type: "Deluxe",
    pricePerNight: 5200,
    isAvailable: true,
    description: "Top-floor deluxe room with panoramic view",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Mini Bar", "Panoramic View"],
    capacity: 4
  },
  {
    name: "Silver Oak Hotel",
    roomNumber: 112,
    type: "Double",
    pricePerNight: 2700,
    isAvailable: true,
    description: "Elegant room with wooden interiors",
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service"],
    capacity: 2
  },
  {
    name: "Blue Lagoon Stay",
    roomNumber: 113,
    type: "Deluxe",
    pricePerNight: 4600,
    isAvailable: true,
    description: "Relaxing stay with poolside view",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Pool Access", "Mini Bar"],
    capacity: 3
  },
  {
    name: "Golden Tulip Inn",
    roomNumber: 114,
    type: "Single",
    pricePerNight: 1600,
    isAvailable: true,
    description: "Clean and minimal single room",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    amenities: ["WiFi", "AC", "TV"],
    capacity: 1
  },
  {
    name: "Palm Tree Resort",
    roomNumber: 115,
    type: "Double",
    pricePerNight: 2900,
    isAvailable: true,
    description: "Comfortable room with tropical vibes",
    imageUrl: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2107c?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Garden View"],
    capacity: 2
  },
  {
    name: "Royal Crown Hotel",
    roomNumber: 116,
    type: "Deluxe",
    pricePerNight: 5500,
    isAvailable: true,
    description: "High-end luxury room with premium services",
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Mini Bar", "Butler Service"],
    capacity: 4
  },
  {
    name: "Metro Lodge",
    roomNumber: 117,
    type: "Single",
    pricePerNight: 1400,
    isAvailable: true,
    description: "Convenient stay near metro station",
    imageUrl: "https://images.unsplash.com/photo-1551776235-dde6d4829808?w=800",
    amenities: ["WiFi", "AC", "TV"],
    capacity: 1
  },
  {
    name: "Peaceful Retreat",
    roomNumber: 118,
    type: "Double",
    pricePerNight: 2500,
    isAvailable: true,
    description: "Quiet and relaxing double room",
    imageUrl: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service"],
    capacity: 2
  },
  {
    name: "The Grand Stay",
    roomNumber: 119,
    type: "Deluxe",
    pricePerNight: 5100,
    isAvailable: true,
    description: "Premium hotel experience with luxury decor",
    imageUrl: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Mini Bar"],
    capacity: 3
  },
  {
    name: "Happy Homes Hotel",
    roomNumber: 120,
    type: "Single",
    pricePerNight: 1200,
    isAvailable: true,
    description: "Affordable and comfortable stay",
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
    amenities: ["WiFi", "AC", "TV"],
    capacity: 1
  },
  {
    name: "Lake View Resort",
    roomNumber: 121,
    type: "Deluxe",
    pricePerNight: 5300,
    isAvailable: true,
    description: "Beautiful lake-facing luxury room",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Lake View"],
    capacity: 4
  },
  {
    name: "Comfort Palace",
    roomNumber: 122,
    type: "Double",
    pricePerNight: 2600,
    isAvailable: true,
    description: "Well-furnished double room",
    imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a12?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service"],
    capacity: 2
  },
  {
    name: "Quick Stay Inn",
    roomNumber: 123,
    type: "Single",
    pricePerNight: 1100,
    isAvailable: true,
    description: "Perfect for short and quick stays",
    imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
    amenities: ["WiFi", "AC"],
    capacity: 1
  },
  {
    name: "Elite Comfort Suites",
    roomNumber: 124,
    type: "Deluxe",
    pricePerNight: 4900,
    isAvailable: true,
    description: "Modern deluxe suite with stylish interiors",
    imageUrl: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Mini Bar"],
    capacity: 3
  },
  {
    name: "City Lights Hotel",
    roomNumber: 125,
    type: "Double",
    pricePerNight: 2700,
    isAvailable: true,
    description: "Room with beautiful night city view",
    imageUrl: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "City View"],
    capacity: 2
  },
  {
    name: "Royal Heritage Stay",
    roomNumber: 126,
    type: "Deluxe",
    pricePerNight: 5400,
    isAvailable: true,
    description: "Traditional design with royal touch",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Heritage Decor"],
    capacity: 4
  },
  {
    name: "Urban Nest",
    roomNumber: 127,
    type: "Single",
    pricePerNight: 1500,
    isAvailable: true,
    description: "Compact and smart urban room",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
    amenities: ["WiFi", "AC", "TV", "Desk"],
    capacity: 1
  },
  {
    name: "Golden Stay Resort",
    roomNumber: 128,
    type: "Double",
    pricePerNight: 2800,
    isAvailable: true,
    description: "Comfortable resort-style stay",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Pool Access"],
    capacity: 2
  },
  {
    name: "Luxury Haven",
    roomNumber: 129,
    type: "Deluxe",
    pricePerNight: 6000,
    isAvailable: true,
    description: "Top-tier luxury room with premium features",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    amenities: ["WiFi", "AC", "TV", "Room Service", "Balcony", "Mini Bar", "Jacuzzi", "Butler Service"],
    capacity: 4
  },
  {
    name: "Smart Budget Hotel",
    roomNumber: 130,
    type: "Single",
    pricePerNight: 1000,
    isAvailable: true,
    description: "Smart choice for budget travelers",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    amenities: ["WiFi", "AC"],
    capacity: 1
  }
];

/**
 * Main seed function
 * Clears existing data and inserts fresh sample data
 */
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hotel.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210'
    });
    console.log(`   ✅ Admin: admin@hotel.com / admin123`);

    // Create sample customer
    console.log('👤 Creating customer user...');
    const customer = await User.create({
      name: 'John Doe',
      email: 'customer@hotel.com',
      password: 'customer123',
      role: 'customer',
      phone: '9876543211'
    });
    console.log(`   ✅ Customer: customer@hotel.com / customer123`);

    // Create another customer
    const customer2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@hotel.com',
      password: 'jane123',
      role: 'customer',
      phone: '9876543212'
    });
    console.log(`   ✅ Customer: jane@hotel.com / jane123`);

    // Insert all rooms
    console.log('🏨 Creating 30 rooms...');
    const rooms = await Room.insertMany(roomsData);
    console.log(`   ✅ Created ${rooms.length} rooms`);

    // Create sample bookings
    console.log('📅 Creating sample bookings...');
    const today = new Date();
    
    const bookingsData = [
      {
        user: customer._id,
        room: rooms[0]._id,  // Ocean View Hotel - Deluxe
        checkIn: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),  // 2 days from now
        checkOut: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        totalPrice: rooms[0].pricePerNight * 3, // 3 nights
        status: 'confirmed',
        guests: 2
      },
      {
        user: customer._id,
        room: rooms[4]._id,  // Grand Horizon - Deluxe
        checkIn: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
        checkOut: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
        totalPrice: rooms[4].pricePerNight * 2, // 2 nights
        status: 'confirmed',
        guests: 3
      },
      {
        user: customer2._id,
        room: rooms[2]._id,  // Royal Palace Hotel - Double
        checkIn: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        checkOut: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
        totalPrice: rooms[2].pricePerNight * 3,
        status: 'confirmed',
        guests: 2
      },
      {
        user: customer2._id,
        room: rooms[7]._id,  // Comfort Zone Hotel - Double
        checkIn: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        checkOut: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        totalPrice: rooms[7].pricePerNight * 3,
        status: 'completed',
        guests: 2
      },
      {
        user: customer._id,
        room: rooms[1]._id,  // City Comfort Inn - Single
        checkIn: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        checkOut: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        totalPrice: rooms[1].pricePerNight * 2,
        status: 'cancelled',
        guests: 1
      }
    ];

    await Booking.insertMany(bookingsData);
    console.log(`   ✅ Created ${bookingsData.length} bookings`);

    // Summary
    console.log('\n========================================');
    console.log('🎉 Database seeded successfully!');
    console.log('========================================');
    console.log(`Total Users: 3 (1 Admin + 2 Customers)`);
    console.log(`Total Rooms: ${rooms.length}`);
    console.log(`  - Single: ${rooms.filter(r => r.type === 'Single').length}`);
    console.log(`  - Double: ${rooms.filter(r => r.type === 'Double').length}`);
    console.log(`  - Deluxe: ${rooms.filter(r => r.type === 'Deluxe').length}`);
    console.log(`Total Bookings: ${bookingsData.length}`);
    console.log('\nLogin Credentials:');
    console.log('  Admin:    admin@hotel.com / admin123');
    console.log('  Customer: customer@hotel.com / customer123');
    console.log('  Customer: jane@hotel.com / jane123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
