import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set("strictQuery", false);

async function connectDB() {
    try {  
        await mongoose.connect("mongodb+srv://dbuser:passwordManish@cluster0.wzdspll.mongodb.net/assigment", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // Exit process if DB connection fails
    }
}

export default connectDB;
