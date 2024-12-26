const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables
const connectDB = async () => {
  try {
    // await mongoose.connect("mongodb+srv://mu0829332:8SNmjqED4Q1TRaJv@cluster0.bt7ub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    await mongoose.connect(process.env.MONGO_URI, { // Use environment variable
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
