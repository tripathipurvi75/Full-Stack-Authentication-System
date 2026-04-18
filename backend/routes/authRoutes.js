const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (any authenticated user)
router.get("/profile", authMiddleware, getProfile);

// Admin-only routes
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

module.exports = router;
