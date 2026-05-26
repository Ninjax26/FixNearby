import jwt from "jsonwebtoken";
import Worker from "../models/Worker.js";
import mongoose from "mongoose";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
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
        success: false,
        message: "Please fill all fields",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;

        if (!emailRegex.test(normalizedEmail)) {
          return res.status(400).json({
            success: false,
            message: "Invalid email format",
          });
        }

      const existingWorker =
        await Worker.findOne({
          email: normalizedEmail,
     });

    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: "Worker already exists",
      });
    }

    const worker = await Worker.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      category: category.trim(),
      experience: experience.trim(),
      location: location.trim(),
      contact: contact.trim(),
      bio: bio.trim(),
      profilePicture: req.file?.path || "",
    });

    res.status(201).json({
      success: true,
      message: "Worker registered successfully",
      token: generateToken(worker._id),
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

export const loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const worker = await Worker.findOne({email: normalizedEmail,});

    if (
      !worker ||
      !(await worker.matchPassword(password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(worker._id),
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

export const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select("-password");

    res.status(200).json({
      success: true,
      workers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

export const getWorkerById = async (req, res) => {
  try {

    // CHECK INVALID OBJECT ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid worker ID",
      });
    }

    const worker = await Worker.findById(req.params.id)
      .select("-password");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    res.status(200).json({
      success: true,
      worker,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
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