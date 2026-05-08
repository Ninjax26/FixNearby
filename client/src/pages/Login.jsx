import { useState } from "react";
import useToast from "../hooks/useToast";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Add authentication logic and API connection
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showToast('Login successful! Welcome back.', 'success');
    } catch (error) {
      console.error('Login failed:', error);
      showToast('Login failed. Please try again.', 'error');
    } catch (error) {
      console.error('Login failed:', error);
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const [interacted, setInteracted] = useState({});
  const [errors, setErrors] = useState({});
  const [apiError, setApiError]=useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage]=useState(null);
  
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
     console.log(`${import.meta.env.VITE_API_URL}`)
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
    setMessage(null);
    setErrors({});
    setApiError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

      const userData = res.data;

      // Persist user + token via AuthContext
      login(userData);
      setMessage("Logged in successfully! Welcome to FixNearby.");
      navigate("/dashboard");
    } catch(error) {
      setApiError(error.response?.data?.message || "Login Failed, Please check your connection and try again.");
    } finally {
      setLoading(false);
      setFormData({email:"",password:""});
    }
    
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
        </div>
        {/* TODO: Add authentication logic and API connection */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input id="email-address" name="email" type="email" required className="input-base" placeholder="Email address" />
            </div>
            <div>
              <input id="password" name="password" type="password" required className="input-base" placeholder="Password" />
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="btn-primary btn-primary-lg btn-full">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input id="email-address" name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <input id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span className={`btn-text ${loading ? 'hidden' : ''}`}>Sign in</span>
              <span className={`btn-loader ${loading ? '' : 'hidden'}`}>Loading...</span>
            </button>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign In
        </h2>

         {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {apiError}
          </div>
        )} 
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            {message}
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
            {interacted.email && errors.email && (
              <div className="mt-1 text-red-700 text-sm">
                {errors.email}
              </div>
            )}
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
            />
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
