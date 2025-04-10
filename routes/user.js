const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrpyt = require("bcrypt");
const { validateInput } = require("../helper/validate");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

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
router.get("/:id", verifyToken, async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select("-password");
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

      // Exclude password
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

      const token = jwt.sign(
         {
            id: validUser._id,
            username: validUser.username,
         },
         process.env.ACCESS_TOKEN_SECRET
      );

      // Exclude password
      const { password: _, ...userWithoutPassword } = validUser.toObject();
      res.status(200).json({
         message: "Login successful",
         token,
         user: userWithoutPassword,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

// Follow a user
router.post("/:id/follow", verifyToken, async (req, res) => {
   try {
      if (req.params.id === req.user.id)
         return res
            .status(400)
            .json({ message: "You cannot follow yourself." });

      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);

      if (!userToFollow)
         return res.status(404).json({ message: "User not found." });

      if (!currentUser)
         return res.status(404).json({ message: "Current user not found." });

      if (currentUser.following.includes(userToFollow._id))
         return res
            .status(400)
            .json({ message: "You are already following this user." });

      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);

      await Promise.all([currentUser.save(), userToFollow.save()]);

      res.status(200).json({ message: "User followed successfully." });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

module.exports = router;
