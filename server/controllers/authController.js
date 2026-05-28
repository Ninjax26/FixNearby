import Worker from "../models/Worker.js";
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // 2. Name validation
    if (name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const normalizedEmail = email.toLowerCase();

    // 4. Password validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain uppercase, lowercase and a number"
      });
    }

    // 5. Check existing user
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // 6. Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone ? phone.trim() : undefined,
    });

    // 7. Response 
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const normalizedEmail = email.toLowerCase();

    // 2. Find user
    const user = await User.findOne({ email: normalizedEmail });

    // 3. Check password
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    //  No extra DB call (already in req.user)
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const registerWorker = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      category,
      experience,
      location,
      contact,
      bio,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !category ||
      !experience ||
      !location ||
      !contact ||
      !bio
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const workerExists = await Worker.findOne({ email });

    if (workerExists) {
      return res.status(400).json({
        message: "Worker already exists",
      });
    }

    const worker = await Worker.create({
      name,
      email,
      password,
      category,
      experience,
      location,
      contact,
      bio,
      profilePicture: req.file?.path || "",
    });

    res.status(201).json({
      success: true,
      token: generateToken(worker._id),
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    });

  }
};

export const loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;

    const worker = await Worker.findOne({ email });

    if (
      worker &&
      (await worker.matchPassword(password))
    ) {
      res.status(200).json({
        success: true,
        token: generateToken(worker._id),
        worker: {
          id: worker._id,
          name: worker.name,
          email: worker.email,
        },
      });

    } else {

      res.status(401).json({
        message: "Invalid email or password",
      });

    }

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    });

  }
};

export const getWorkerProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    worker: req.worker,
  });
};