const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lexora')
  .then(async () => {
    console.log('Connected to MongoDB for User seeding');

    // Delete existing users for clean slate (optional, but good for testing)
    await User.deleteMany({});
    try { await User.collection.dropIndexes(); } catch (e) {}

    // Create Senior Advocate
    const senior = await User.create({
      name: 'Senior Kumar',
      username: 'senior@lexora.com',
      password: 'password123',
      role: 'Senior Advocate'
    });
    console.log('Created User:', senior.name, '-', senior.role);

    // Create Junior Advocate
    const junior = await User.create({
      name: 'Junior Sharma',
      username: 'junior@lexora.com',
      password: 'password123',
      role: 'Junior Advocate'
    });
    console.log('Created User:', junior.name, '-', junior.role);

    console.log('User Seeding complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
