const mongoose = require("mongoose");

const connectDB= async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.log("Failed to connect to MongoDB",error.message);
        process.exit(1);
    }
}

module.exports=connectDB;