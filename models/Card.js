import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 256 },
  subtitle: { type: String, required: true, minlength: 2, maxlength: 256 },
  description: { type: String, required: true, minlength: 2, maxlength: 1024 },
  phone: { type: String, required: true, match: /^[0-9]{9,11}$/ },
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  web: { type: String, match: /^https?:\/\/.+/ }, //* Ensure valid URL if provided

  image: {
    url: { type: String, required: true, minlength: 14, match: /^https?:\/\/.+/ },
    alt: { type: String, required: true, minlength: 2, maxlength: 256 }
  },

  address: {
    state: { type: String, required: true, minlength: 2, maxlength: 256 },
    country: { type: String, required: true, minlength: 2, maxlength: 256 },
    city: { type: String, required: true, minlength: 2, maxlength: 256 },
    street: { type: String, required: true, minlength: 2, maxlength: 256 },
    houseNumber: { type: Number, required: true, min: 1, max: 9999 },
    zip: { type: Number, required: true, min: 2 }
  },

  bizNumber: { type: Number, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

//* Automatically assign a unique random bizNumber if not present
cardSchema.pre('save', async function (next) {
  if (!this.bizNumber) {
    let unique = false;
    while (!unique) {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const existing = await mongoose.models.Card.findOne({ bizNumber: randomNumber });
      if (!existing) {
        this.bizNumber = randomNumber;
        unique = true;
      }
    }
  }
  next();
});

export default mongoose.model('Card', cardSchema);
