import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Card from '../models/Card.js';

export const initData = async () => {
  try {
    const userCount = await User.countDocuments();
    const cardCount = await Card.countDocuments();

    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('Abc!12345', 10); 

      await User.insertMany([
        {
          name: { first: 'John', middle: '', last: 'Doe' },
          phone: '0501234567',
          email: 'user@example.com',
          password: hashedPassword,
          image: {
            url: 'https://via.placeholder.com/150',
            alt: 'User profile image'
          },
          address: {
            state: 'Tel Aviv',
            country: 'Israel',
            city: 'Tel Aviv',
            street: 'Herzl',
            houseNumber: 10,
            zip: 12345
          },
          isBusiness: false,
          isAdmin: false
        },
        {
          name: { first: 'Sarah', middle: '', last: 'Business' },
          phone: '0509876543',
          email: 'biz@example.com',
          password: hashedPassword,
          image: {
            url: 'https://via.placeholder.com/150',
            alt: 'Business user image'
          },
          address: {
            state: 'Haifa',
            country: 'Israel',
            city: 'Haifa',
            street: 'Carmel',
            houseNumber: 25,
            zip: 54321
          },
          isBusiness: true,
          isAdmin: false
        },
        {
          name: { first: 'Adam', middle: '', last: 'Admin' },
          phone: '0505555555',
          email: 'admin@example.com',
          password: hashedPassword,
          image: {
            url: 'https://via.placeholder.com/150',
            alt: 'Admin user image'
          },
          address: {
            state: 'Jerusalem',
            country: 'Israel',
            city: 'Jerusalem',
            street: 'King David',
            houseNumber: 5,
            zip: 67890
          },
          isBusiness: false,
          isAdmin: true
        }
      ]);
    }

    if (cardCount === 0) {
      const businessUser = await User.findOne({ isBusiness: true });

      if (businessUser) {
        await Card.insertMany([
          {
            title: 'Business Card 1',
            subtitle: 'Quality Service',
            description: 'We provide excellent services and customer support for all your needs.',
            phone: '0502223333',
            email: 'contact@biz1.com',
            web: 'https://biz1.com',
            image: {
              url: 'https://via.placeholder.com/300',
              alt: 'Business Card Image 1'
            },
            address: {
              state: 'Central',
              country: 'Israel',
              city: 'Ramat Gan',
              street: 'Bialik',
              houseNumber: 50,
              zip: 11223
            },
            bizNumber: 100001,
            user_id: businessUser._id
          },
          {
            title: 'Business Card 2',
            subtitle: 'Affordable Prices',
            description: 'High quality products and services at the best prices.',
            phone: '0504445555',
            email: 'contact@biz2.com',
            web: 'https://biz2.com',
            image: {
              url: 'https://via.placeholder.com/300',
              alt: 'Business Card Image 2'
            },
            address: {
              state: 'North',
              country: 'Israel',
              city: 'Nahariya',
              street: 'Weizmann',
              houseNumber: 8,
              zip: 44556
            },
            bizNumber: 100002,
            user_id: businessUser._id
          },
          {
            title: 'Business Card 3',
            subtitle: 'Trusted Services',
            description: 'Trusted by thousands of satisfied customers for years.',
            phone: '0506667777',
            email: 'contact@biz3.com',
            web: 'https://biz3.com',
            image: {
              url: 'https://via.placeholder.com/300',
              alt: 'Business Card Image 3'
            },
            address: {
              state: 'South',
              country: 'Israel',
              city: 'Eilat',
              street: 'Ocean',
              houseNumber: 12,
              zip: 77889
            },
            bizNumber: 100003,
            user_id: businessUser._id
          }
        ]);
      }
    }
  } catch (err) {
    console.error('❌ Error during initData:', err.message);
  }
};
