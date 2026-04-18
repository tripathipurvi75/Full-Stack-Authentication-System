/**
 * Seed Script — creates demo admin and user accounts
 * Run: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/auth_system";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing demo users
    await User.deleteMany({ email: { $in: ["admin@demo.com", "user@demo.com"] } });

    const salt = await bcrypt.genSalt(12);

    await User.create([
      {
        name: "Demo Admin",
        email: "admin@demo.com",
        password: await bcrypt.hash("admin123", salt),
        role: "admin",
      },
      {
        name: "Demo User",
        email: "user@demo.com",
        password: await bcrypt.hash("user123", salt),
        role: "user",
      },
    ]);

    console.log("🌱 Seeded demo accounts:");
    console.log("   Admin → admin@demo.com / admin123");
    console.log("   User  → user@demo.com  / user123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();
