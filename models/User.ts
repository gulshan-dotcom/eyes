import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      accuracy: { type: [String] },
      lan: { type: [String] },
      lon: { type: [String] },
    },
    videos: {
      type: [String], // Array of video src URLs
      default: [],
    },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
