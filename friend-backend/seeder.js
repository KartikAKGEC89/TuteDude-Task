const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userSchema'); 
const dotenv = require('dotenv');
dotenv.config();

const users = [
  {
    username: 'john_doe',
    password: 'password123',
    interests: ['coding', 'music', 'reading'],
  },
  {
    username: 'jane_doe',
    password: 'password456',
    interests: ['traveling', 'photography', 'sports'],
  },
  {
    username: 'alice',
    password: 'alice2023',
    interests: ['gaming', 'cooking', 'hiking'],
  },
  {
    username: 'bob',
    password: 'bob2023',
    interests: ['fitness', 'movies', 'gardening'],
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    const userDocs = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;

      const newUser = new User(user);
      const savedUser = await newUser.save();
      userDocs.push(savedUser); 
      console.log(`Created user: ${user.username}`);
    }


    if (userDocs.length > 1) {
   
      await User.findByIdAndUpdate(userDocs[0]._id, {
        $push: { friends: userDocs[1]._id },
      });
      await User.findByIdAndUpdate(userDocs[1]._id, {
        $push: { friends: userDocs[0]._id },
      });

      
      await User.findByIdAndUpdate(userDocs[2]._id, {
        $push: { friends: userDocs[3]._id },
      });
      await User.findByIdAndUpdate(userDocs[3]._id, {
        $push: { friends: userDocs[2]._id },
      });

      console.log('Added friends between users');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();