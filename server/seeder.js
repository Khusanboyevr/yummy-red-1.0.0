import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';
import { menuItems } from '../src/data/index.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing items
    await MenuItem.deleteMany({});
    console.log('Existing items cleared.');

    // Prepare items (removing custom IDs if needed, but Mongoose will generate _id)
    const itemsToSeed = menuItems.map(item => ({
      name: item.name,
      ingredients: item.ingredients,
      price: item.price,
      image: item.image,
      category: item.category
    }));

    await MenuItem.insertMany(itemsToSeed);
    console.log(`${itemsToSeed.length} items seeded successfully!`);
    
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
