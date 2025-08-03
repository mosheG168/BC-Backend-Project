import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    first: { type: String, required: true, minlength: 2, maxlength: 256 },
    middle: { type: String, default: '', maxlength: 256 },
    last: { type: String, required: true, minlength: 2, maxlength: 256 },
  },
  phone: { type: String, required: true, match: /^05\d{8}$/ },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: {
    url: { type: String, default: '' },
    alt: { type: String, default: '' },
  },
  address: {
    state: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    houseNumber: { type: Number, required: true },
    zip: { type: Number, required: true }
  },
  isBusiness: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
