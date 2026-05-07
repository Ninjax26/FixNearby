import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [interacted, setInteracted] = useState({});
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- VALIDATION ----------------

  const validateFields = (name, value) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

    switch (name) {
      case "name":
        if (!value.trim()) return "Username is required";
        break;

      case "email":
        if (!value || !emailRegex.test(value)) {
          return "Invalid email address";
        }
        break;

      case "password":
        if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
        break;

      default:
        return "";
    }

    return "";
  };

  // ---------------- HANDLE CHANGE ----------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate while typing after interaction
    if (interacted[name]) {
      const errorMsg = validateFields(name, value);

      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    }
  };

  // ---------------- HANDLE BLUR ----------------

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setInteracted((prev) => ({
      ...prev,
      [name]: true,
    }));

    const errorMsg = validateFields(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  // ---------------- HANDLE SUBMIT ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const allInteracted = {};

    Object.keys(formData).forEach((key) => {
      const errorMsg = validateFields(key, formData[key]);

      if (errorMsg) {
        newErrors[key] = errorMsg;
      }

      allInteracted[key] = true;
    });

    setInteracted(allInteracted);

    // Stop if validation errors exist
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setApiError(
          data.message ||
            "Registration failed. Please try again."
        );
        return;
      }

      // Auto login after registration
      login(data);

      alert("Registration successful! Welcome to FixNearby.");

      navigate("/dashboard");
    } catch {
      setApiError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- INPUT STYLE ----------------

  const inputStyles = (field) =>
    `appearance-none relative block w-full px-4 py-3 border rounded-xl 
    focus:outline-none transition duration-200 bg-gray-50
    ${
      interacted[field] && errors[field]
        ? "border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
    }`;

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Join FixNearby and get started
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form
          className="space-y-2"
          onSubmit={handleSubmit}
        >
          {/* Name */}
          <div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Full Name"
              className={inputStyles("name")}
            />

            {/* Reserved error space */}
            <div className="min-h-[22px] mt-1 text-sm">
              {interacted.name && errors.name && (
                <span className="text-red-600">
                  {errors.name}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email Address"
              className={inputStyles("email")}
            />

            <div className="min-h-[22px] mt-1 text-sm">
              {interacted.email && errors.email && (
                <span className="text-red-600">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className={inputStyles("phone")}
            />

            {/* Empty reserved space */}
            <div className="min-h-[22px]" />
          </div>

          {/* Password */}
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              className={inputStyles("password")}
            />

            <div className="min-h-[22px] mt-1 text-sm">
              {interacted.password && errors.password && (
                <span className="text-red-600">
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating your account..."
              : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;