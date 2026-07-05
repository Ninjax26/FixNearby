import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signupUser } from "../services/authService";
import useToast from "../hooks/useToast";
import { validateName, validateEmail, validatePassword, validatePhone } from "../utils/validation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
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
  const [showPassword, setShowPassword] = useState(false);

  const VALIDATORS = {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
    phone: validatePhone,
  };

  const validateFields = (name, value) => {
    const fn = VALIDATORS[name];
    return fn ? fn(value) : "";
  };

  // ---------------- HANDLE CHANGE ----------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // validate while typing after first interaction
    if (interacted[name]) {
      const errorMsg = validateFields(name, value);

      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    }
    if (apiError) setApiError(null);
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
    setErrors({});
    setApiError(null);

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

    // stop if there are validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError(null);
    setLoading(true);

    try {
      const userData = await signupUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      login({
        ...userData,
        phone: formData.phone,
      });
      showToast("Registration successful! Welcome to FixNearby.");

      setFormData({ name: "", email: "", phone: "", password: "" });
      navigate("/dashboard");
    } catch(error) {
      setApiError(error.message || "Registration failed. Please try again.");
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
            Create an account
          </h2>
          <p className="mt-2 text-base sm:text-sm text-gray-600">
            Join FixNearby and get started
          </p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
            <div className="min-h-[22px] mt-1 text-sm">
              {interacted.name && errors.name && (
                <span className="text-red-600">{errors.name}</span>
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
                <span className="text-red-600">{errors.email}</span>
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
              onBlur={handleBlur}
              placeholder="Phone Number"
              className={inputStyles("phone")}
            />
            <div className="min-h-[22px] mt-1 text-sm">
              {interacted.phone && errors.phone && (
                <span className="text-red-600">{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                className={`${inputStyles("password")} pr-12`}
              />
              {/* FIX #589: Added aria-label for accessibility */}
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="min-h-[22px] mt-1 text-xs text-gray-500">
              {interacted.password && errors.password ? (
                <span className="text-red-600 font-semibold">{errors.password}</span>
              ) : (
                <span>Must contain at least 6 characters, including 1 uppercase, 1 lowercase and 1 number.</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating your account..." : "Create account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;