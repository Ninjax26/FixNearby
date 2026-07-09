import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import { forgotUserPassword } from "../services/authService";
import useToast from "../hooks/useToast";

const ForgotPasswordUser = () => {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return showToast("Please enter your email.", "error");
    }
    if (!emailRegex.test(email)) {
      return showToast("Please enter a valid email address.", "error");
    }

    setLoading(true);

    try {
      const res = await forgotUserPassword(email);
      showToast(res.message);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your email to receive a reset link.
        </p>


        <form onSubmit={handleSubmit}>
          <div className="relative mb-5">
            <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="input-base pl-12"
            />
          </div>

          <button
            disabled={loading}
            className="btn-primary btn-full"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <Link
          to="/login"
          className="btn-text mt-4 text-center w-full"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordUser;