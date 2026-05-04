import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // stops page reload    
    // TODO: add API logic here
    console.log("User registered");
    alert("Thanks for registering! Please log in to continue.");
    navigate("/login");
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Full Name"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-t-md"
            />
            <input
              id="email-address"
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-b-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;