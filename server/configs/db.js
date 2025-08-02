import mongoose from 'mongoose';

const connectToDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://sirhillary:sirhillary15@cluster0.rn44mg1.mongodb.net/`)
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error("Database connection failed!", error);
        process.exit(1);
    }
}

export default connectToDB;