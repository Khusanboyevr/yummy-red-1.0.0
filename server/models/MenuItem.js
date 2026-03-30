import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  variants: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MenuItem', menuItemSchema);
