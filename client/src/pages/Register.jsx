import { useState } from "react";
import useToast from "../hooks/useToast";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Add registration logic and API connection
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showToast('Account created successfully!', 'success');
    } catch (error) {
      console.error('Registration failed:', error);
      showToast('Registration failed. Please try again.', 'error');
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
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [errors, setErrors] = useState({});
  const [interacted, setInteracted] = useState({});

  // Indian phone number validation: 10 digits, starts with 6,7,8,9
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateFields = (name, value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    switch (name) {
      case "name":
        if (!value.trim()) return "Username is required";
        break;
      case "email":
        if (!value || !emailRegex.test(value)) return "Invalid email address";
        break;
      case "password":
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate phone number in real-time
    if (name === "phone") {
      if (value && !validatePhoneNumber(value)) {
        setPhoneError("Enter valid 10-digit mobile number starting with 6,7,8,9");
      } else {
        setPhoneError("");
      }
    }

    // Validate while typing only when user has interacted
    if (interacted[name]) {
      const errorMsgs = validateFields(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsgs }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setInteracted((prev) => ({ ...prev, [name]: true }));
    const errorMsgs = validateFields(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsgs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPhoneError("");

    // Validate phone number before submission
    if (!validatePhoneNumber(formData.phone)) {
      setPhoneError("Enter valid 10-digit mobile number starting with 6,7,8,9");
      return;
    }

    // Validate all fields
    const nameError = validateFields("name", formData.name);
    const emailError = validateFields("email", formData.email);
    const passwordError = validateFields("password", formData.password);

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      login(data);
      alert("Registration successful! Welcome to FixNearby.");
      navigate("/dashboard");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>
        {/* TODO: Add authentication logic and API connection */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input id="name" name="name" type="text" required className="input-base" placeholder="Full Name" />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
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
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name && interacted.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && interacted.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email address"
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email && interacted.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && interacted.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input id="email-address" name="email" type="email" required className="input-base" placeholder="Email address" />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Mobile Number (10 digits)"
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  phoneError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              <p className="text-gray-400 text-xs mt-1">
                Enter 10-digit mobile number starting with 6,7,8, or 9
              </p>
            </div>

            <div>
              <input id="password" name="password" type="password" required className="input-base" placeholder="Password" />
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="btn-primary btn-primary-lg btn-full">
              <span className={`btn-text ${loading ? 'hidden' : ''}`}>Register</span>
              <span className={`btn-loader ${loading ? '' : 'hidden'}`}>Loading...</span>
            </button>
          </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password && interacted.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && interacted.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;