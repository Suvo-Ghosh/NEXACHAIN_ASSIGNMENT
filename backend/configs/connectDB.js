import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
}

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI);
        console.log(
            `MongoDB Connected: ${connection.connection.host}, ${connection.connection.name}`
        );

        return connection;
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;