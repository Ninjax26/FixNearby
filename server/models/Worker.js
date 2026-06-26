import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    averageRating: {
      type: Number,
      default: 0
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "offline",
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    responsiveness: {
      type: Number,
      default: 100,
    },
    karmaScore: {
      type: Number,
      default: 100,
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
  },
  {
    timestamps: true,
  }
);

// HASH PASSWORD BEFORE SAVE
workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();

  } catch (error) {
    next(error);
  }
});

// PASSWORD MATCH METHOD
workerSchema.methods.matchPassword =
  async function (enteredPassword) {

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

workerSchema.index({ location: "2dsphere" });
workerSchema.index({ category: 1, availabilityStatus: 1 });

const Worker = mongoose.model(
  "Worker",
  workerSchema
);

export default Worker;