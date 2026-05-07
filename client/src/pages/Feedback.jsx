import { useState } from "react";

const Feedback = () => {
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Send to backend / Firebase later
    console.log("Feedback submitted:", form);

    setSubmitted(true);
    setForm({ name: "", rating: 5, message: "" });

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Give Your Feedback
        </h2>

        {submitted && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            Thank you for your feedback!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
            <option value="2">⭐⭐ (2)</option>
            <option value="1">⭐ (1)</option>
          </select>

          <textarea
            name="message"
            placeholder="Your feedback..."
            value={form.message}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg h-32"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Feedback
          </button>

        </form>
      </div>
    </div>
  );
};

export default Feedback;