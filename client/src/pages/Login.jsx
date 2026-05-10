import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import useToast from '../hooks/useToast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {showToast} = useToast();
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
    if(apiError) setApiError(null);
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
      const userData = await loginUser(formData);

      // Persist user + token via AuthContext
      login(userData);
      showToast("Logged in successfully")
      navigate("/dashboard");
      setFormData({ email : "", password :""})

    } catch(error) {
      setApiError(error.message || "Login Failed , Try again");
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

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email address"
              className={inputStyles("email")}
            />
             {/* Reserved error space */}
            <div className="min-h-[22px] mt-1 text-sm">
              {interacted.email && errors.email && (<span className="text-red-600">
                  {errors.email}
                </span>
              )}
            </div>
            </div>
              
              {/* Password */}
            <div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                className={`${inputStyles("password")} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              </div>
            {/* Reserved error space */}
            <div className="min-h-[22px] mt-1 text-sm">
              {interacted.password && errors.password && (<span className="text-red-600">
                  {errors.password}
                </span>
              )}
            </div>
            </div>
               {/* submit */}
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
            className="text-blue-600 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
