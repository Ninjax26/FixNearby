import Worker from '../models/Worker.js';

export const registerWorker = async (req, res) => {
  try {
    const { name, category, experience, location, contact } = req.body;

    // Check required fields
    if (
      name === undefined ||
      category === undefined ||
      experience === undefined ||
      location === undefined ||
      contact === undefined
    ) {
      return res.status(400).json({
        message: 'Please fill all fields'
      });
    }

    // Check types
    if (
      typeof name !== 'string' ||
      typeof category !== 'string' ||
      typeof experience !== 'string' ||
      typeof location !== 'string' ||
      typeof contact !== 'string'
    ) {
      return res.status(400).json({
        message: 'All fields must be strings'
      });
    }

    // Trim validation
    if (
      !name.trim() ||
      !category.trim() ||
      !experience.trim() ||
      !location.trim() ||
      !contact.trim()
    ) {
      return res.status(400).json({
        message: 'Fields cannot be empty'
      });
    }

    // Contact number validation ✅ NEW
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact.trim())) {
      return res.status(400).json({
        message: 'Please enter a valid 10 digit contact number'
      });
    }

    const worker = await Worker.create({
      name: name.trim(),
      category: category.trim(),
      experience: experience.trim(),
      location: location.trim(),
      contact: contact.trim()
    });

    res.status(201).json({
      message: 'Worker registered successfully',
      worker
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    });
  }
};