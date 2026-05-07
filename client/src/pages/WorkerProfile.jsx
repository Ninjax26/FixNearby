import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BookingConfirmationModal from '../components/BookingConfirmationModal';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});

  // Worker data based on ID - CORRECTED
  const getWorkerById = (workerId) => {
    const workers = {
      1: { id: 1, name: "John Doe", profession: "Electrician", price: "$45/hr", rating: 4.8, bio: "Experienced electrician with 10+ years of expertise." },
      2: { id: 2, name: "Jane Smith", profession: "Plumber", price: "$50/hr", rating: 4.9, bio: "Licensed plumber with 15 years experience." },
      3: { id: 3, name: "Mike Johnson", profession: "Carpenter", price: "$35/hr", rating: 4.5, bio: "Expert carpenter specializing in custom furniture." },
      4: { id: 4, name: "Amit Sharma", profession: "AC Technician", price: "$45/hr", rating: 4.7, bio: "Certified AC technician with 8 years experience." },
      5: { id: 5, name: "Ravi Kumar", profession: "Painter", price: "$30/hr", rating: 4.6, bio: "Professional painter with 12 years experience." },
      6: { id: 6, name: "Suresh Patel", profession: "Cleaner", price: "$25/hr", rating: 4.3, bio: "Expert cleaner with attention to detail." },
    };
    
    // Convert id to number and return the worker, or default to first worker if not found
    const workerIdNum = parseInt(workerId);
    return workers[workerIdNum] || workers[1];
  };

  const worker = getWorkerById(id);

  const handleBooking = () => {
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    const newBooking = {
      id: 'BK-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      worker: worker.name,
      service: worker.profession,
      date: new Date().toLocaleDateString(),
      time: "10:00 AM",
      price: worker.price,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    
    const updatedBookings = [newBooking, ...existingBookings];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    setBookingDetails({
      service: worker.profession,
      worker: worker.name,
      date: new Date().toLocaleDateString(),
      time: "10:00 AM",
      price: worker.price,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/bookings');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BookingConfirmationModal 
        isOpen={showModal} 
        onClose={closeModal} 
        bookingDetails={bookingDetails} 
      />

      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{worker.name}</h1>
            <p className="text-xl text-blue-600 mt-2">{worker.profession}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400">★</span>
              <span className="text-gray-600">{worker.rating}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-2xl font-bold text-gray-900">{worker.price}</span>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
          <p className="text-gray-600 leading-relaxed">{worker.bio}</p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-sm font-medium text-gray-900">User A <span className="text-gray-500 font-normal ml-2">★ 5.0</span></p>
            <p className="text-sm text-gray-600 mt-1">Great service, arrived on time!</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-900">User B <span className="text-gray-500 font-normal ml-2">★ 4.5</span></p>
            <p className="text-sm text-gray-600 mt-1">Professional and knowledgeable.</p>
          </div>
        </div>

        <div className="mt-8 pt-8">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition"
            onClick={handleBooking}
          >
            Book This Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;