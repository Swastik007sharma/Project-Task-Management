const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const SALT_ROUNDS = 10;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
};

const normalizeEmail = (email) => email?.toString().trim().toLowerCase();

// Helper: Remove sensitive data before sending to client
const toSafeUser = (user) => {
  if (!user) return null;
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  return safeUser;
};

// Helper: Set Cookie (Keeps code DRY)
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true, // Prevents XSS
    secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
    sameSite: "strict", // Prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password & create user
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      getJwtSecret(),
      { expiresIn: "7d" },
    );

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, getJwtSecret(), {
      expiresIn: "7d",
    });

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user is populated by your protect middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user: toSafeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) {
      const normalizedEmail = normalizeEmail(email);
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
      user.email = normalizedEmail;
    }
    if (password) user.password = await bcrypt.hash(password, SALT_ROUNDS);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: toSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Logout User
 * @route   POST /api/auth/logout
 */
exports.logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Instantly expires the cookie
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

/**
 * @desc    List all users (admin only)
 * @route   GET /api/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
