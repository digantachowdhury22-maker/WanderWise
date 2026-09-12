import mongoose from 'mongoose';

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI is not set. Database connection skipped.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10_000,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        console.error(
            'If you use MongoDB Atlas, allow this computer\'s public IP in Atlas: Security > Network Access.'
        );
    }
};

export default connectDB;
