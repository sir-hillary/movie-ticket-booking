import mongoose from 'mongoose';

const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error("Database connection failed!", error);
        process.exit(1);
    }
}

export default connectToDB;