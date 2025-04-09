const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrpyt = require("bcrypt");
const { validateInput } = require("../middleware/validate");

// Get all users
router.get("/", async (req, res) => {
   try {
      const users = await User.find();
      res.json(users);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

// Get a user profile
router.get("/:id", async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

// Create a user
router.post("/register", async (req, res) => {
   try {
      const { username, fullName, email, password, bio, avatar } = req.body;

      const existingUser = await User.findOne({
         $or: [{ username }, { email }],
      });
      if (existingUser)
         return res
            .status(400)
            .json({ message: "Username or email already exists" });

      const hashedPassword = await bcrpyt.hash(password, 10);

      const newUser = new User({
         username,
         fullName: fullName || "",
         email,
         password: hashedPassword,
         bio: bio || "",
         avatar: avatar || "",
      });
      const savedUser = await newUser.save();
      const { password: _, ...userWithoutPassword } = savedUser.toObject();

      res.status(201).json({
         message: "User created successfully",
         user: userWithoutPassword,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

// Login
router.post("/login", validateInput, async (req, res) => {
   try {
      const { username, email, password } = req.body;

      const validUser = await User.findOne({ $or: [{ username }, { email }] });
      if (!validUser)
         return res.status(404).json({ message: "User not found" });

      const isPasswordValid = await bcrpyt.compare(
         password,
         validUser.password
      );
      if (!isPasswordValid)
         return res.status(401).json({ message: "Password is invalid" });

      const { password: _, ...userWithoutPassword } = validUser.toObject();
      res.status(200).json({
         message: "Login successful",
         user: userWithoutPassword,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

module.exports = router;
