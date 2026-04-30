const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const products = [
  { name: 'Premium Leather Jacket', price: 299.99, category: 'fashion', image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=500', rating: 4.8, reviews: 124, stock: 15 },
  { name: 'Wireless Noise Cancelling Headphones', price: 199.50, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500', rating: 4.9, reviews: 850, stock: 20 },
  { name: 'Minimalist Wall Clock', price: 45.00, category: 'home & decor', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=500', rating: 4.5, reviews: 320, stock: 50 },
  { name: 'Natural Silk Scarf', price: 89.00, category: 'fashion', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=500', rating: 4.7, reviews: 95, stock: 10 },
  { name: 'Smart Fitness Tracker', price: 129.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=500', rating: 4.6, reviews: 2100, stock: 35 },
  { name: 'Ceramic Flower Vase', price: 35.00, category: 'home & decor', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=500', rating: 4.4, reviews: 150, stock: 45 },
  { name: 'Luxury Scented Candle', price: 25.00, category: 'beauty', image: 'https://images.unsplash.com/photo-1602872030219-cbf917a8cbd0?auto=format&fit=crop&q=80&w=500', rating: 4.8, reviews: 540, stock: 100 },
  { name: 'Pro Camera Tripod', price: 75.00, category: 'electronics', image: 'https://images.unsplash.com/photo-1590605272619-3f89aa0650ef?auto=format&fit=crop&q=80&w=500', rating: 4.7, reviews: 88, stock: 12 },
  { name: 'Fashionable Jewellery Set', price: 599.00, category: 'jewellery', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=500', rating: 4.9, reviews: 45, stock: 5 },
  { name: 'Elegant Gold Bracelet', price: 1200.00, category: 'jewellery', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500', rating: 4.8, reviews: 12, stock: 8 }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
