import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-bold text-blue-500">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-500 mt-2">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;