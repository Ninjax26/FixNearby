import { useState } from "react";
import { workerSignup } from "../services/workerService";
import useToast from "../hooks/useToast";

const WorkerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    experience: "",
    location: "",
    contact: "",
  });
  const {showToast}=useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if(error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const workerData = await workerSignup(formData);

      showToast("Worker registered successfully!");

      setFormData({
        name: "",
        category: "",
        experience: "",
        location: "",
        contact: "",
      });

    } catch (err) {
      setError(err.message || "Worker Registration failed, Try again");
    } finally {
      setLoading(false);
    }
  };
     //                 INPUT STYLE
   const inputStyles = (field) =>
    `appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md`;

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Become a Worker
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Register your service profile
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

          <div className="rounded-md shadow-sm space-y-4">

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputStyles["name"]}
            />

            {/* Category */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={inputStyles["category"]}
            >
              <option value="">Select Service Category</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Painter">Painter</option>
              <option value="AC Technician">AC Technician</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Gardener">Gardener</option>
              <option value="Appliance Repair">Appliance Repair</option>
              <option value="Pest Control">Pest Control</option>
            </select>

            {/* Experience */}
            <input
              type="number"
              min="0"
              name="experience"
              placeholder="Experience (e.g. 3 years)"
              value={formData.experience}
              onChange={handleChange}
              required
              className={inputStyles["experience"]}
            />

            {/* Location */}
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              className={inputStyles["location"]}
            />

            {/* Contact */}
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              required
              className={inputStyles["contact"]}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="text-green-600 text-sm text-center">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Registering..." : "Register as Worker"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default WorkerRegister;