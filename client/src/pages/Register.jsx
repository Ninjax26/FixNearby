import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [interacted, setInteracted] = useState({});
  const [errors, setErrors] = useState({});
  const [apiError, setApiError]=useState(null);
  const [loading, setLoading] = useState(false);

  const validateFields=(name,value)=>{
    const emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    switch(name){
      case "name":
        if(!value.trim()) return "username is required"
        break;
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
    const {name, value}=e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    //validate while typing only when user is interacted
    if (interacted[name]) {
      const errorMsgs = validateFields(name, value);

      setErrors((prev) => ({ ...prev, [name]: errorMsgs }));
    }

  };
  
  const handleBlur=(e)=>{
    const {name, value}=e.target;

    setInteracted((prev)=>({ ...prev, [name]:true}));

    //validate when user leaves input
    const errorMsgs= validateFields(name,value);

    setErrors((prev)=> ({...prev, [name]: errorMsgs}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors= {};
    const allInteracted= {};
    
    Object.keys(formData).forEach((key)=> {
      const errorMsg = validateFields(key,formData[key]);
      if(errorMsg) newErrors[key]= errorMsg;
    })

    //Mark all fields as interacted
     Object.keys(formData).forEach((key)=>{
        allInteracted[key]=true;
     }) 
     setInteracted(allInteracted);

     //stop submit if error occurs
    if(Object.keys(newErrors).length > 0){
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Registration failed. Please try again.");
        return;
      }

      // Automatically log the user in after registration
      login(data);
      alert("Registration successful! Welcome to FixNearby.");
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
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Create an account
          </h2>
        </div>

         {apiError && (
          <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {apiError}
          </div>
        )} 

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Full Name"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
             {interacted.name && errors.name && (
          <div className="mt-1 text-red-700 text-sm">
            {errors.name}
          </div>
        )}
            <input
              id="email-address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email address"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            />
             {interacted.email && errors.email && (
          <div className="mt-1 text-red-700 text-sm">
            {errors.email}
          </div>
        )}
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
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
            className="pt-2 w-full py-3 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating your account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{"  "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;