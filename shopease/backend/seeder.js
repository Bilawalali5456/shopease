import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';

dotenv.config();

// ─── ADMIN & SAMPLE USERS ──────────────────────────────────────────────
const users = [
  {
    name: 'Admin User',
    email: 'admin@shopease.com',
    password: bcrypt.hashSync('admin123', 10),
    isAdmin: true,
  },
  {
    name: 'Ali Khan',
    email: 'ali@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'Sara Ahmed',
    email: 'sara@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

// ─── 40 PRODUCTS ACROSS 5 CATEGORIES ────────────────────────────────────
const products = [
  // ═══════════════ ELECTRONICS (8) ═══════════════
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'The ultimate smartphone with S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor. Features a stunning 6.8" Dynamic AMOLED display with 120Hz refresh rate.',
    price: 324999,
    category: 'Electronics',
    brand: 'Samsung',
    countInStock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
    ratings: 4.8,
    numReviews: 32,
  },
  {
    name: 'Apple MacBook Pro 16" M3 Max',
    description: 'The most powerful MacBook ever built. M3 Max chip delivers extraordinary performance for demanding workflows. 36GB unified memory and 1TB SSD.',
    price: 749999,
    category: 'Electronics',
    brand: 'Apple',
    countInStock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    ratings: 4.9,
    numReviews: 56,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer. 30-hour battery life, crystal-clear hands-free calling, and multipoint connection.',
    price: 84999,
    category: 'Electronics',
    brand: 'Sony',
    countInStock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600',
    ratings: 4.7,
    numReviews: 89,
  },
  {
    name: 'iPad Air M2 11-inch',
    description: 'Supercharged by the M2 chip. A 11-inch Liquid Retina display, landscape camera, and support for Apple Pencil Pro.',
    price: 189999,
    category: 'Electronics',
    brand: 'Apple',
    countInStock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
    ratings: 4.6,
    numReviews: 41,
  },
  {
    name: 'JBL Charge 5 Bluetooth Speaker',
    description: 'Portable waterproof speaker with powerful JBL Pro Sound. 20 hours of playtime and IP67 waterproof & dustproof rated.',
    price: 34999,
    category: 'Electronics',
    brand: 'JBL',
    countInStock: 55,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    ratings: 4.5,
    numReviews: 67,
  },
  {
    name: 'Dell UltraSharp 27" 4K Monitor',
    description: 'Professional-grade 27-inch 4K UHD monitor with USB-C hub. 98% DCI-P3 color coverage and IPS Black technology for deeper blacks.',
    price: 119999,
    category: 'Electronics',
    brand: 'Dell',
    countInStock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600',
    ratings: 4.7,
    numReviews: 28,
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    description: 'Advanced wireless mouse with MagSpeed scroll, quiet clicks, and 8K DPI tracking on any surface. USB-C fast charging.',
    price: 24999,
    category: 'Electronics',
    brand: 'Logitech',
    countInStock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
    ratings: 4.8,
    numReviews: 105,
  },
  {
    name: 'Canon EOS R6 Mark II Camera',
    description: 'Full-frame mirrorless camera with 24.2MP sensor, up to 40fps continuous shooting, and advanced subject detection AF.',
    price: 549999,
    category: 'Electronics',
    brand: 'Canon',
    countInStock: 7,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    ratings: 4.9,
    numReviews: 19,
  },

  // ═══════════════ CLOTHING (8) ═══════════════
  {
    name: 'Classic Slim Fit Oxford Shirt',
    description: 'Premium cotton Oxford shirt with a modern slim fit. Button-down collar, chest pocket, and adjustable cuffs. Perfect for office or casual wear.',
    price: 5499,
    category: 'Clothing',
    brand: 'Brooks Brothers',
    countInStock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    ratings: 4.3,
    numReviews: 44,
  },
  {
    name: 'Premium Leather Jacket',
    description: 'Genuine lambskin leather jacket with quilted lining. Features zippered pockets and a classic biker silhouette that never goes out of style.',
    price: 34999,
    category: 'Clothing',
    brand: 'Wilson Leather',
    countInStock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    ratings: 4.6,
    numReviews: 22,
  },
  {
    name: 'Athletic Performance Joggers',
    description: 'Lightweight moisture-wicking joggers with a tapered fit. Four-way stretch fabric, zippered pockets, and elastic waistband with drawcord.',
    price: 6999,
    category: 'Clothing',
    brand: 'Nike',
    countInStock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600',
    ratings: 4.4,
    numReviews: 76,
  },
  {
    name: 'Merino Wool Crew Neck Sweater',
    description: '100% extra-fine merino wool sweater. Soft, breathable, and naturally temperature-regulating. Machine washable for easy care.',
    price: 12999,
    category: 'Clothing',
    brand: 'Uniqlo',
    countInStock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
    ratings: 4.5,
    numReviews: 38,
  },
  {
    name: 'Selvedge Denim Jeans',
    description: 'Japanese selvedge denim with a straight leg fit. Raw indigo wash that develops unique fading patterns over time. Copper rivets and leather patch.',
    price: 18999,
    category: 'Clothing',
    brand: 'Levi\'s',
    countInStock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    ratings: 4.7,
    numReviews: 53,
  },
  {
    name: 'Breathable Running Sneakers',
    description: 'Ultra-lightweight running shoes with React foam midsole and Flyknit upper. Provides responsive cushioning for daily training.',
    price: 21999,
    category: 'Clothing',
    brand: 'Nike',
    countInStock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    ratings: 4.6,
    numReviews: 91,
  },
  {
    name: 'Formal Wool Blazer',
    description: 'Tailored slim-fit blazer in super 120s wool. Half-canvas construction with natural shoulder. Perfect for business meetings.',
    price: 45999,
    category: 'Clothing',
    brand: 'Hugo Boss',
    countInStock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
    ratings: 4.4,
    numReviews: 16,
  },
  {
    name: 'Cotton Graphic T-Shirt Pack (3)',
    description: 'Set of 3 premium heavyweight cotton tees with original graphic prints. Pre-shrunk, double-stitched hems for durability.',
    price: 4999,
    category: 'Clothing',
    brand: 'H&M',
    countInStock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    ratings: 4.2,
    numReviews: 134,
  },

  // ═══════════════ HOME & KITCHEN (8) ═══════════════
  {
    name: 'Dyson V15 Detect Cordless Vacuum',
    description: 'Intelligent cordless vacuum with laser dust detection and piezo sensor. Reveals microscopic dust and auto-adjusts suction power.',
    price: 149999,
    category: 'Home & Kitchen',
    brand: 'Dyson',
    countInStock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600',
    ratings: 4.8,
    numReviews: 47,
  },
  {
    name: 'KitchenAid Artisan Stand Mixer',
    description: 'Iconic tilt-head stand mixer with 5-quart stainless steel bowl. 10 optimized speeds for nearly any task or recipe.',
    price: 89999,
    category: 'Home & Kitchen',
    brand: 'KitchenAid',
    countInStock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1594385208974-2f8bb2a36d15?w=600',
    ratings: 4.9,
    numReviews: 63,
  },
  {
    name: 'Instant Pot Duo Plus 6-Quart',
    description: '9-in-1 electric pressure cooker: pressure cook, slow cook, rice cooker, yogurt maker, steamer, sauté pan, sterilizer, and warmer.',
    price: 24999,
    category: 'Home & Kitchen',
    brand: 'Instant Pot',
    countInStock: 38,
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600',
    ratings: 4.7,
    numReviews: 156,
  },
  {
    name: 'Nespresso Vertuo Next Coffee Machine',
    description: 'One-touch brewing system for 5 cup sizes. Uses Centrifusion technology to read barcodes on each capsule for the perfect brew.',
    price: 45999,
    category: 'Home & Kitchen',
    brand: 'Nespresso',
    countInStock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    ratings: 4.5,
    numReviews: 72,
  },
  {
    name: 'Luxury Egyptian Cotton Bedsheet Set',
    description: '1000 thread count Egyptian cotton sheet set. Includes flat sheet, fitted sheet, and 2 pillowcases. Silky smooth sateen weave.',
    price: 18999,
    category: 'Home & Kitchen',
    brand: 'Brooklinen',
    countInStock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    ratings: 4.6,
    numReviews: 34,
  },
  {
    name: 'Cast Iron Dutch Oven 6.75 Qt',
    description: 'Enameled cast iron Dutch oven with tight-fitting lid. Perfect for slow cooking, braising, baking, and roasting. Oven-safe to 500°F.',
    price: 64999,
    category: 'Home & Kitchen',
    brand: 'Le Creuset',
    countInStock: 16,
    imageUrl: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=600',
    ratings: 4.9,
    numReviews: 43,
  },
  {
    name: 'Smart LED Strip Lights (10m)',
    description: 'WiFi-controlled RGBIC LED strip lights with music sync. Works with Alexa and Google Home. 16 million colors and scene modes.',
    price: 6999,
    category: 'Home & Kitchen',
    brand: 'Govee',
    countInStock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
    ratings: 4.3,
    numReviews: 89,
  },
  {
    name: 'Air Purifier with HEPA Filter',
    description: 'True HEPA air purifier covering up to 540 sq ft. Captures 99.97% of particles 0.3 microns. Ultra-quiet sleep mode.',
    price: 34999,
    category: 'Home & Kitchen',
    brand: 'Philips',
    countInStock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
    ratings: 4.5,
    numReviews: 51,
  },

  // ═══════════════ SPORTS & FITNESS (8) ═══════════════
  {
    name: 'Adjustable Dumbbell Set (5-52.5 lbs)',
    description: 'Space-saving adjustable dumbbells that replace 15 sets of weights. Dial-a-weight selection system for quick changes between exercises.',
    price: 89999,
    category: 'Sports & Fitness',
    brand: 'Bowflex',
    countInStock: 11,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    ratings: 4.7,
    numReviews: 38,
  },
  {
    name: 'Yoga Mat Premium 6mm',
    description: 'Non-slip yoga mat with alignment lines. Made from eco-friendly TPE material. Includes carrying strap. Perfect for yoga, pilates, and stretching.',
    price: 7999,
    category: 'Sports & Fitness',
    brand: 'Liforme',
    countInStock: 65,
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
    ratings: 4.6,
    numReviews: 82,
  },
  {
    name: 'Garmin Forerunner 965 GPS Watch',
    description: 'Premium GPS running smartwatch with AMOLED display. Advanced training metrics, maps, music, and up to 23 days battery life.',
    price: 139999,
    category: 'Sports & Fitness',
    brand: 'Garmin',
    countInStock: 19,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    ratings: 4.8,
    numReviews: 27,
  },
  {
    name: 'Resistance Bands Set (5 Pack)',
    description: 'Set of 5 resistance bands with different tension levels. Includes door anchor, handles, and ankle straps. Perfect for home workouts.',
    price: 4999,
    category: 'Sports & Fitness',
    brand: 'Fit Simplify',
    countInStock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600',
    ratings: 4.4,
    numReviews: 198,
  },
  {
    name: 'Indoor Cycling Bike',
    description: 'Belt-driven indoor cycling bike with magnetic resistance. Features a 22" flywheel, LCD monitor, and adjustable seat and handlebars.',
    price: 124999,
    category: 'Sports & Fitness',
    brand: 'Schwinn',
    countInStock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    ratings: 4.5,
    numReviews: 33,
  },
  {
    name: 'Protein Shaker Bottle (28oz)',
    description: 'Stainless steel protein shaker with BlenderBall wire whisk. Leak-proof, BPA-free, and dishwasher safe. Double-wall insulated.',
    price: 3499,
    category: 'Sports & Fitness',
    brand: 'BlenderBottle',
    countInStock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=600',
    ratings: 4.3,
    numReviews: 217,
  },
  {
    name: 'Foam Roller for Muscle Recovery',
    description: 'High-density EVA foam roller for deep tissue massage and muscle recovery. Textured surface for targeted therapy. 18-inch length.',
    price: 4499,
    category: 'Sports & Fitness',
    brand: 'TriggerPoint',
    countInStock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600',
    ratings: 4.5,
    numReviews: 65,
  },
  {
    name: 'Boxing Gloves 12oz',
    description: 'Premium synthetic leather boxing gloves with multi-layer foam padding. Secure wrist wrap closure and ventilated palm.',
    price: 8999,
    category: 'Sports & Fitness',
    brand: 'Everlast',
    countInStock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600',
    ratings: 4.4,
    numReviews: 42,
  },

  // ═══════════════ BOOKS & STATIONERY (8) ═══════════════
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy & proven way to build good habits & break bad ones. #1 New York Times bestseller with over 15 million copies sold worldwide.',
    price: 2499,
    category: 'Books & Stationery',
    brand: 'Penguin Random House',
    countInStock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
    ratings: 4.9,
    numReviews: 342,
  },
  {
    name: 'Moleskine Classic Notebook (Large)',
    description: 'Iconic hardcover notebook with ivory-colored acid-free paper, rounded corners, and an elastic closure. 240 ruled pages.',
    price: 4999,
    category: 'Books & Stationery',
    brand: 'Moleskine',
    countInStock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600',
    ratings: 4.6,
    numReviews: 78,
  },
  {
    name: 'The Psychology of Money',
    description: 'By Morgan Housel. Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the strange ways people think about money.',
    price: 1999,
    category: 'Books & Stationery',
    brand: 'Harriman House',
    countInStock: 160,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
    ratings: 4.8,
    numReviews: 267,
  },
  {
    name: 'Lamy Safari Fountain Pen',
    description: 'Iconic design fountain pen with ergonomic grip and polished steel nib. Includes T10 blue ink cartridge. Perfect for everyday writing.',
    price: 7999,
    category: 'Books & Stationery',
    brand: 'Lamy',
    countInStock: 55,
    imageUrl: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600',
    ratings: 4.7,
    numReviews: 49,
  },
  {
    name: 'Deep Work by Cal Newport',
    description: 'Rules for focused success in a distracted world. Learn how to develop deep work habits and transform your productivity.',
    price: 2299,
    category: 'Books & Stationery',
    brand: 'Grand Central',
    countInStock: 130,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
    ratings: 4.7,
    numReviews: 189,
  },
  {
    name: 'Bullet Journal Starter Kit',
    description: 'Complete bullet journal kit including dotted notebook, fineliner pens (6 colors), stencil ruler, and washi tape set.',
    price: 5999,
    category: 'Books & Stationery',
    brand: 'Leuchtturm1917',
    countInStock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600',
    ratings: 4.5,
    numReviews: 56,
  },
  {
    name: 'Desk Organizer Bamboo Set',
    description: 'Multi-compartment bamboo desk organizer with phone holder, pen cups, and letter sorter. Eco-friendly and sustainably sourced.',
    price: 6499,
    category: 'Books & Stationery',
    brand: 'MobileVision',
    countInStock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600',
    ratings: 4.4,
    numReviews: 31,
  },
  {
    name: 'Colored Pencil Set (48 Colors)',
    description: 'Professional-grade colored pencils with soft, wax-based cores. Rich, vibrant pigments perfect for adult coloring books and illustrations.',
    price: 3999,
    category: 'Books & Stationery',
    brand: 'Prismacolor',
    countInStock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    ratings: 4.8,
    numReviews: 94,
  },
];

// ─── SEED FUNCTION ──────────────────────────────────────────────────────
const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Existing data cleared');

    // Insert users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    console.log(`👤 ${createdUsers.length} users created`);

    // Attach admin user as createdBy on all products
    const sampleProducts = products.map((p) => ({
      ...p,
      createdBy: adminUser,
    }));

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`📦 ${createdProducts.length} products created`);

    // Summary
    const cats = [...new Set(products.map((p) => p.category))];
    console.log(`📂 Categories: ${cats.join(', ')}`);
    console.log('\n═══════════════════════════════════════════');
    console.log('  ✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════');
    console.log('\n  🔑 Admin Login Credentials:');
    console.log('     Email:    admin@shopease.com');
    console.log('     Password: admin123');
    console.log('\n  👤 Sample User Credentials:');
    console.log('     Email:    ali@example.com');
    console.log('     Password: 123456');
    console.log('═══════════════════════════════════════════\n');

    return {
      users: createdUsers.length,
      products: createdProducts.length,
      categories: cats,
    };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    throw error;
  }
};

// Run directly: node backend/seeder.js
const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith('seeder.js') || process.argv[1].includes('seeder'));

if (isDirectRun) {
  seedDB()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedDB;
