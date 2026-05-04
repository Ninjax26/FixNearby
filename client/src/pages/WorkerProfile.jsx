import { useParams, Link } from 'react-router-dom';
import { useState } from "react";

const WorkerProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    try {
      // TODO: Open booking form/modal
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // TODO: (50% built) Fetch specific worker details using the `id` parameter from the URL.
  // const [worker, setWorker] = useState(null);
  // useEffect(() => { fetchWorkerDetails(id) }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worker Profile (ID: {id})</h1>
            <p className="text-xl text-blue-600 mt-2">Profession Name (TODO: Dynamic)</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-2xl font-bold text-gray-900">$XX/hr</span>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
          <p className="text-gray-600 leading-relaxed">
            {/* TODO: Load actual worker bio here */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
          {/* TODO: Map through real reviews fetched from backend */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-sm font-medium text-gray-900">User A <span className="text-gray-500 font-normal ml-2">⭐ 5.0</span></p>
            <p className="text-sm text-gray-600 mt-1">Great service, arrived on time!</p>
          </div>
        </div>

        <div className="mt-8 pt-8">
          {/* TODO: Implement booking modal or redirect to a booking flow */}
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBook}
            disabled={loading}
          >
            <span className={`btn-text ${loading ? 'hidden' : ''}`}>Book This Service</span>
            <span className={`btn-loader ${loading ? '' : 'hidden'}`}>Loading...</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
