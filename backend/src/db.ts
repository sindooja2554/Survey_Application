import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try{
        console.log("env", process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch(error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;