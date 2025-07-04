import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB: Connecting...');
        });

        mongoose.connection.on('connected', () => {
            console.log(`MongoDB: Connected to ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
        });
        
        return conn;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;