import mongoose from "mongoose";

let isConnected = false; // Track the connection state

export async function connectDB() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in .env");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "eyes",
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
    throw error;
  }
}
