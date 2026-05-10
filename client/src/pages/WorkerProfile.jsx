import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import BookingConfirmationModal from '../components/BookingConfirmationModal';

/* ✅ Move data outside component */
const WORKERS = {
  1: { id: 1, name: "John Doe", profession: "Electrician", price: "$45/hr", rating: 4.8, bio: "Experienced electrician with 10+ years of expertise." },
  2: { id: 2, name: "Jane Smith", profession: "Plumber", price: "$50/hr", rating: 4.9, bio: "Licensed plumber with 15 years experience." },
  3: { id: 3, name: "Mike Johnson", profession: "Carpenter", price: "$35/hr", rating: 4.5, bio: "Expert carpenter specializing in custom furniture." },
  4: { id: 4, name: "Amit Sharma", profession: "AC Technician", price: "$45/hr", rating: 4.7, bio: "Certified AC technician with 8 years experience." },
  5: { id: 5, name: "Ravi Kumar", profession: "Painter", price: "$30/hr", rating: 4.6, bio: "Professional painter with 12 years experience." },
  6: { id: 6, name: "Suresh Patel", profession: "Cleaner", price: "$25/hr", rating: 4.3, bio: "Expert cleaner with attention to detail." },
};

const getBookings = () => {
  try {
    return JSON.parse(localStorage.getItem('bookings')) || [];
  } catch {
    return [];
  }
};

const saveBookings = (bookings) => {
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});

  /* ✅ Safe worker lookup */
  const worker = useMemo(() => {
    const workerId = Number(id);
    return WORKERS[workerId] || null;
  }, [id]);

  const handleBooking = () => {
    if (!worker) return;

    const newBooking = {
      id: 'BK-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      worker: worker.name,
      service: worker.profession,
      date: new Date().toLocaleDateString(),
      time: "10:00 AM",
      price: worker.price,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...getBookings()];
    saveBookings(updated);

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

  /* ❗ Handle invalid worker */
  if (!worker) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Worker not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BookingConfirmationModal
        isOpen={showModal}
        onClose={closeModal}
        bookingDetails={bookingDetails}
      />

      <div className="bg-white shadow rounded-lg p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{worker.name}</h1>
            <p className="text-blue-600 mt-1">{worker.profession}</p>
            <p className="text-sm text-yellow-500 mt-1">★ {worker.rating}</p>
          </div>
          <div className="mt-4 md:mt-0 text-xl font-bold">
            {worker.price}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-600">{worker.bio}</p>
        </div>

        {/* Reviews */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Reviews</h2>

          {[
            { name: "User A", rating: 5.0, text: "Great service, arrived on time!" },
            { name: "User B", rating: 4.5, text: "Professional and knowledgeable." },
          ].map((r, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded mb-2">
              <p className="font-medium">
                {r.name} <span className="text-gray-500">★ {r.rating}</span>
              </p>
              <p className="text-sm text-gray-600">{r.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleBooking}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
        >
          Book This Service
        </button>
      </div>
    </div>
  );
};

export default WorkerProfile;