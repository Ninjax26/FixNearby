import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLock, FaSpinner, FaEye, FaEyeSlash, } from "react-icons/fa";
import { resetWorkerPassword } from "../services/authService";
import useToast from "../hooks/useToast";


const ResetPasswordWorker = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      return showToast(
        "Password is required.", "error"
      );
    }

    if (password.length < 6) {
      return showToast(
        "Password must be at least 6 characters.", "error"
      );
    }

    if (password !== confirmPassword) {
      return showToast(
        "Passwords do not match.", "error"
      );
    }

    try {
      setLoading(true);

      await resetWorkerPassword(
        token,
        password
      );

      showToast(
        "Password reset successfully"
      );

      navigate("/worker/login");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          Reset Password
        </h2>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="relative">
            <FaLock className="absolute left-4 top-4 text-gray-400" />

            <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) =>
                setPassword(e.target.value)
                }
                className="input-base pl-12 pr-12"
            />

            <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() =>
                setShowPassword(!showPassword)
                }
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
                {showPassword ? (
                <FaEyeSlash />
                ) : (
                <FaEye />
                )}
            </button>
            </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-4 text-gray-400" />

            <input
                type={
                showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                setConfirmPassword(
                    e.target.value
                )
                }
                className="input-base pl-12 pr-12"
            />

            <button
                type="button"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                onClick={() =>
                setShowConfirmPassword(
                    !showConfirmPassword
                )
                }
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
                {showConfirmPassword ? (
                <FaEyeSlash />
                ) : (
                <FaEye />
                )}
            </button>
            </div>

          <button
            disabled={loading}
            className="btn-primary btn-full"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordWorker;