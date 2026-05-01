const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const categories = ['Electronics', 'Fashion', 'Home Decor', 'Lifestyle', 'Accessories'];
const subCategories = {
  'Electronics': ['Headphones', 'Smartwatches', 'Cameras', 'Speakers', 'Accessories'],
  'Fashion': ['Shirts', 'Dresses', 'Jackets', 'Shoes', 'Bags'],
  'Home Decor': ['Vases', 'Clocks', 'Candles', 'Wall Art', 'Cushions'],
  'Lifestyle': ['Water Bottles', 'Notebooks', 'Fitness Gear', 'Travel Bags'],
  'Accessories': ['Sunglasses', 'Wallets', 'Jewelry', 'Belts']
};

const images = {
  'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
  'Smartwatches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
  'Cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
  'Speakers': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
  'Shirts': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
  'Dresses': 'https://images.unsplash.com/photo-1539008835270-117568568479?auto=format&fit=crop&q=80&w=800',
  'Jackets': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
  'Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  'Bags': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
  'Vases': 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800',
  'Clocks': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=800',
  'Candles': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
  'Sunglasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
  'Wallets': 'https://images.unsplash.com/photo-1627123430984-7137e736a291?auto=format&fit=crop&q=80&w=800',
  'Jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
};

const adjectives = ['Premium', 'Luxury', 'Minimalist', 'Elegant', 'Modern', 'Classic', 'Vintage', 'Artisan', 'Urban', 'Smart'];

const generateProducts = () => {
  const products = [];
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCat = subCategories[category][Math.floor(Math.random() * subCategories[category].length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    const name = `${adj} ${subCat} ${i}`;
    const price = Math.floor(Math.random() * 9500) + 499; // 499 to 9999
    const image = images[subCat] || images['Headphones'];
    
    products.push({
      name,
      description: `Experience the ultimate in quality with our ${name}. Designed for the modern individual, this ${subCat.toLowerCase()} combines functionality with a sleek, ${adj.toLowerCase()} aesthetic. Perfect for everyday use or as a special gift.`,
      price,
      image,
      category: category,
      stock: Math.floor(Math.random() * 100) + 10,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
      numReviews: Math.floor(Math.random() * 500),
      sku: `PROD-${Date.now()}-${i}`
    });
  }
  return products;
};

const seedLargeData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vogue_db');
    console.log('Connected to MongoDB');

    // Drop indexes to avoid stale unique constraint errors
    try {
      await Product.collection.dropIndexes();
      console.log('Dropped existing indexes');
    } catch (e) {
      console.log('No indexes to drop or collection does not exist');
    }

    const products = generateProducts();
    await Product.insertMany(products);
    console.log('Successfully added 100 new products!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedLargeData();
