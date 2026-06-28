import jwt from "jsonwebtoken";
import Worker from "../models/Worker.js";
import mongoose from "mongoose";
import { calculateKarmaScores } from "../utils/karmaScheduler.js";
import { validatePassword } from "../utils/validatePassword.js";
import Booking from "../models/Booking.js";

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

      const passwordCheck = validatePassword(password);
      if (!passwordCheck.valid) {
        return res.status(400).json({
          success: false,
          message: passwordCheck.message,
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
      location: (typeof location === "string" && location.startsWith("{")) ? JSON.parse(location) : (typeof location === "object" ? location : { type: "Point", coordinates: [0, 0] }),
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
    const workers = await Worker.find().select("name email category experience location contact availabilityStatus profilePicture lastActive");

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

export const getNearbyWorkers = async (req, res) => {
  try {
    const { lat, lng, maxDistance, category, availabilityStatus, page = 1, limit = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Please provide both lat (latitude) and lng (longitude) query parameters."
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude coordinates."
      });
    }

    const matchQuery = {};
    if (category) {
      matchQuery.category = category;
    }
    if (availabilityStatus) {
      matchQuery.availabilityStatus = availabilityStatus;
    }

    const maxDistMeters = maxDistance ? parseFloat(maxDistance) : 10000; // default 10km

    const pipeline = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          maxDistance: maxDistMeters,
          query: matchQuery
        }
      },
      {
        $sort: {
          distance: 1,
          averageRating: -1,
          availabilityStatus: 1
        }
      }
    ];

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = (pageNum - 1) * limitNum;

    pipeline.push(
      { $skip: skipNum },
      { $limit: limitNum }
    );

    const workers = await Worker.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: workers.length,
      page: pageNum,
      limit: limitNum,
      workers
    });
  } catch (error) {
    console.error("Error finding nearby workers:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

export const recalculateKarmaScoresController = async (req, res) => {
  try {
    await calculateKarmaScores();
    res.status(200).json({
      success: true,
      message: "Karma/Reliability scores recalculated successfully for all workers"
    });
  } catch (error) {
    console.error("Error recalculating karma scores:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

export const getWorkerAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const dateRange = parseInt(req.query.dateRange) || 7; // default 7 days ahead

    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Fallback to generating mock slots for mock workers with numeric/invalid IDs
      const mockSlots = [];
      const now = new Date();
      const slotHours = [9, 11, 13, 15]; // 9 AM, 11 AM, 1 PM, 3 PM
      const slotDurationMs = 2 * 3600000;
      let count = 0;
      for (let dayOffset = 0; dayOffset < dateRange; dayOffset++) {
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + dayOffset);
        for (const hour of slotHours) {
          const slotStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hour, 0, 0, 0);
          const slotEnd = new Date(slotStart.getTime() + slotDurationMs);
          if (slotStart <= now) continue;

          // Book some slots deterministically based on worker ID to look dynamic
          const isBooked = (parseInt(id || "0") + hour + dayOffset) % 3 === 0;
          if (!isBooked) {
            let label = "";
            const isToday = slotStart.toDateString() === now.toDateString();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const isTomorrow = slotStart.toDateString() === tomorrow.toDateString();
            const timeString = slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (isToday) {
              label = `Today, ${timeString}`;
            } else if (isTomorrow) {
              label = `Tomorrow, ${timeString}`;
            } else {
              const options = { weekday: 'short', month: 'short', day: 'numeric' };
              label = `${slotStart.toLocaleDateString([], options)}, ${timeString}`;
            }
            mockSlots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
              label
            });
            count++;
            if (count >= 5) break;
          }
        }
        if (count >= 5) break;
      }
      return res.status(200).json({
        success: true,
        workerId: id,
        availableSlots: mockSlots
      });
    }

    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    // Fetch active bookings in range
    const now = new Date();
    const endPeriod = new Date(now.getTime() + dateRange * 24 * 3600000);

    const bookings = await Booking.find({
      workerId: id,
      status: { $in: ['Accepted', 'In-Progress'] },
      scheduledTime: { $gte: new Date(now.getTime() - 24 * 3600000), $lte: endPeriod }
    });

    const availableSlots = [];
    const slotHours = [9, 11, 13, 15]; // 9 AM, 11 AM, 1 PM, 3 PM
    const slotDurationMs = 2 * 3600000;

    for (let dayOffset = 0; dayOffset < dateRange; dayOffset++) {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + dayOffset);

      for (const hour of slotHours) {
        const slotStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hour, 0, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + slotDurationMs);

        if (slotStart <= now) {
          continue;
        }

        // Check overlap with bookings
        const isOverlapping = bookings.some(booking => {
          const bookingStart = new Date(booking.scheduledTime).getTime();
          const bookingEnd = bookingStart + booking.durationHours * 3600000;
          return slotStart.getTime() < bookingEnd && bookingStart < slotEnd.getTime();
        });

        if (!isOverlapping) {
          let label = "";
          const isToday = slotStart.toDateString() === now.toDateString();
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const isTomorrow = slotStart.toDateString() === tomorrow.toDateString();
          const timeString = slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          if (isToday) {
            label = `Today, ${timeString}`;
          } else if (isTomorrow) {
            label = `Tomorrow, ${timeString}`;
          } else {
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            label = `${slotStart.toLocaleDateString([], options)}, ${timeString}`;
          }

          availableSlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            label
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      workerId: id,
      availableSlots: availableSlots.slice(0, 5)
    });
  } catch (error) {
    console.error("Error fetching worker availability:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};