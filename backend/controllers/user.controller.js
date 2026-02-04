const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const SALT_ROUNDS = 10;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};

const toSafeUser = (user) => {
  if (!user) return null;
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  return safeUser;
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      getJwtSecret(),
      { expiresIn: "7d" },
    );
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: toSafeUser(newUser),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, getJwtSecret(), {
      expiresIn: "7d",
    });
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }) // 7 days
      .json({ message: "Login successful", token, user: toSafeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: toSafeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update current user profile
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email, password } = req.body;
    const update = {};

    if (name) update.name = name;
    if (email) update.email = email;
    if (password) {
      update.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated", user: toSafeUser(updatedUser) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
