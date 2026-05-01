const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const targetCategories = ['home & decor', 'beauty', 'sports', 'jewellery'];

const subCategories = {
  'home & decor': ['Minimalist Vase', 'Wall Clock', 'Scented Candle', 'Abstract Wall Art', 'Throw Cushion'],
  'beauty': ['Luxury Perfume', 'Organic Skincare Serum', 'Matte Lipstick', 'Hair Care Oil', 'Bath Bomb'],
  'sports': ['Eco Yoga Mat', 'Adjustable Dumbbells', 'Tennis Racket', 'Pro Football', 'Resistance Bands'],
  'jewellery': ['Gold Necklace', 'Diamond Ring', 'Silver Bracelet', 'Pearl Earrings', 'Designer Watch']
};

const images = {
  'Minimalist Vase': 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800',
  'Wall Clock': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=800',
  'Scented Candle': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
  'Abstract Wall Art': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
  'Throw Cushion': 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&q=80&w=800',
  
  'Luxury Perfume': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
  'Organic Skincare Serum': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
  'Matte Lipstick': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800',
  'Hair Care Oil': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800',
  'Bath Bomb': 'https://images.unsplash.com/photo-1605650961819-35c82cc78de1?auto=format&fit=crop&q=80&w=800',
  
  'Eco Yoga Mat': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800',
  'Adjustable Dumbbells': 'https://images.unsplash.com/photo-1586401700818-4a619cb8ef10?auto=format&fit=crop&q=80&w=800',
  'Tennis Racket': 'https://images.unsplash.com/photo-1622279457486-640cfdc6c87c?auto=format&fit=crop&q=80&w=800',
  'Pro Football': 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&q=80&w=800',
  'Resistance Bands': 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&q=80&w=800',
  
  'Gold Necklace': 'https://images.unsplash.com/photo-1599643478524-fb66fa5320e5?auto=format&fit=crop&q=80&w=800',
  'Diamond Ring': 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&q=80&w=800',
  'Silver Bracelet': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
  'Pearl Earrings': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
  'Designer Watch': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'
};

const adjectives = ['Premium', 'Luxury', 'Minimalist', 'Elegant', 'Modern', 'Classic', 'Artisan', 'Signature', 'Exclusive', 'Authentic'];

const generateProducts = () => {
  const products = [];
  
  // 25 products per category = 100 products total
  for (const category of targetCategories) {
    for (let i = 1; i <= 25; i++) {
      const subCat = subCategories[category][Math.floor(Math.random() * subCategories[category].length)];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      
      const name = `${adj} ${subCat} ${i}`;
      // Prices vary by category for realism
      let minPrice = 499, maxPrice = 4999;
      if (category === 'jewellery') { minPrice = 2999; maxPrice = 49999; }
      if (category === 'beauty') { minPrice = 299; maxPrice = 2999; }
      
      const price = Math.floor(Math.random() * (maxPrice - minPrice)) + minPrice;
      const image = images[subCat] || images['Minimalist Vase'];
      
      products.push({
        name,
        description: `Experience the ultimate in quality with our ${name}. Carefully crafted for those who appreciate fine ${category}, this item combines superior functionality with a stunning, ${adj.toLowerCase()} design. Elevate your everyday style or enhance your space effortlessly.`,
        price,
        image,
        category: category,
        stock: Math.floor(Math.random() * 50) + 5,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
        numReviews: Math.floor(Math.random() * 300),
        sku: `PROD-${category.substring(0,3).toUpperCase()}-${Date.now()}-${Math.floor(Math.random()*1000)}`
      });
    }
  }
  return products;
};

const seedAdditionalData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vogue_db');
    console.log('Connected to MongoDB (vogue_db)');

    const products = generateProducts();
    await Product.insertMany(products);
    console.log(`Successfully added ${products.length} new products to Home & Decor, Beauty, Sports, and Jewellery!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAdditionalData();
