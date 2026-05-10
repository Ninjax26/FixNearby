import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const [interacted, setInteracted] = useState({});
  const [errors, setErrors] = useState({});
  const [apiError, setApiError]=useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
    const validateFields=(name,value)=>{
    const emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    switch(name){
      case "email":
        if(!value || !emailRegex.test(value)) return "Invalid email address"
        break;
      case "password":
        if(value.length < 6) return "Password must be atleast 6 characters"
        break;
      default:
        return "";
        
    }
    return "";
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (interacted[name]) {
      const errorMsgs = validateFields(name, value);

      setErrors((prev) => ({ ...prev, [name]: errorMsgs }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setInteracted((prev) => ({ ...prev, [name]: true }));

    //validate when user leaves input
    const errorMsgs = validateFields(name, value);

    setErrors((prev) => ({ ...prev, [name]: errorMsgs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const allInteracted = {};

    // validate all fields on submit
    Object.keys(formData).forEach((key) => {
      const errorMsg = validateFields(key, formData[key]);
      if (errorMsg) newErrors[key] = errorMsg;
    });

    // mark all fields as interacted on submit
    Object.keys(formData).forEach((key) => {
      allInteracted[key] = true;
    });
    setInteracted(allInteracted);

    //stop submit if errors occur
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError(null);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Login failed. Please try again.");
        return;
      }

      // Persist user + token via AuthContext
      login(data);
      navigate("/dashboard");
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign In
        </h2>

         {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {apiError}
          </div>
        )} 

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {interacted.email && errors.email && (
              <div className="mt-1 text-red-700 text-sm">
                {errors.email}
              </div>
            )}
            
            {interacted.password && errors.password && (
              <div className="mt-1 text-red-700 text-sm">
                {errors.password}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Signing you in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{"  "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
