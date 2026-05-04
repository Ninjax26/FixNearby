import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User logged in");

    // redirect
    navigate("/dashboard");
    e.preventDefault(); // stops page reload
    // TODO: add API logic here
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log({ email, password });
    alert("You are logged in now! Redirecting to homepage...");    
    navigate("/");
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-t-md"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-b-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-600 rounded-md"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;