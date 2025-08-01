import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    // Use cached connection
    return;
  }

  try {
    mongoose.connection.on('connected', () =>
      console.log('✅ MongoDB connected')
    );

    mongoose.connection.on('error', (err) =>
      console.error('❌ MongoDB connection error:', err)
    );

    await mongoose.connect(`${process.env.MONGO_URI}/quickshow`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw new Error('Database connection failed');
  }
};

export default connectDB;
