import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Briefcase,
  Phone,
  MessageCircle,
} from "lucide-react";

import BookingConfirmationModal from "../components/BookingConfirmationModal";

/* ✅ Move data outside component */
const WORKERS = {
  1: {
    id: 1,
    name: "John Doe",
    profession: "Electrician",
    price: "$45/hr",
    rating: 4.8,
    experience: "10+ Years",
    location: "New York, USA",
    completedJobs: 240,
    bio: "Experienced electrician with 10+ years of expertise in residential and commercial projects.",
  },
  2: {
    id: 2,
    name: "Jane Smith",
    profession: "Plumber",
    price: "$50/hr",
    rating: 4.9,
    experience: "15 Years",
    location: "California, USA",
    completedJobs: 310,
    bio: "Licensed plumber with extensive expertise in leak fixing and pipeline installation.",
  },
  3: {
    id: 3,
    name: "Mike Johnson",
    profession: "Carpenter",
    price: "$35/hr",
    rating: 4.5,
    experience: "7 Years",
    location: "Texas, USA",
    completedJobs: 180,
    bio: "Expert carpenter specializing in custom furniture and interior woodwork.",
  },
};

const REVIEWS = [
  {
    name: "User A",
    rating: 5,
    text: "Great service, arrived on time and fixed everything perfectly.",
  },
  {
    name: "User B",
    rating: 4.5,
    text: "Professional, polite, and highly knowledgeable.",
  },
  {
    name: "User C",
    rating: 4.8,
    text: "Affordable pricing and excellent work quality.",
  },
];

const getBookings = () => {
  try {
    return JSON.parse(localStorage.getItem("bookings")) || [];
  } catch {
    return [];
  }
};

const saveBookings = (bookings) => {
  localStorage.setItem("bookings", JSON.stringify(bookings));
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
      id: "BK-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
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
    navigate("/bookings");
  };

  /* ❗ Invalid Worker */
  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Worker not found
        </h2>

        <p className="text-gray-500 mt-2">
          The worker profile you're looking for does not exist.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <BookingConfirmationModal
        isOpen={showModal}
        onClose={closeModal}
        bookingDetails={bookingDetails}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT PROFILE CARD */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-6">

            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-700">
                {worker.name.charAt(0)}
              </div>

              <h1 className="text-2xl font-bold mt-4">
                {worker.name}
              </h1>

              <p className="text-blue-600 font-medium">
                {worker.profession}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-3 bg-yellow-50 px-3 py-1 rounded-full">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {worker.rating}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase size={18} />
                <span>{worker.completedJobs}+ Jobs Completed</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Clock size={18} />
                <span>{worker.experience} Experience</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <MapPin size={18} />
                <span>{worker.location}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <ShieldCheck size={18} />
                <span>Verified Professional</span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-8 bg-blue-50 rounded-2xl p-5 text-center">
              <p className="text-sm text-gray-500">
                Starting From
              </p>

              <h2 className="text-3xl font-bold text-blue-700 mt-1">
                {worker.price}
              </h2>
            </div>

            {/* CTA */}
            <button
              onClick={handleBooking}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-2xl shadow-md"
            >
              Book This Service
            </button>

            {/* Contact */}
            <div className="flex gap-3 mt-4">
              <button className="flex-1 border border-gray-200 hover:bg-gray-100 py-3 rounded-2xl flex items-center justify-center gap-2 transition">
                <Phone size={18} />
                Call
              </button>

              <button className="flex-1 border border-gray-200 hover:bg-gray-100 py-3 rounded-2xl flex items-center justify-center gap-2 transition">
                <MessageCircle size={18} />
                Chat
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2 space-y-8">

          {/* About */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-4">
              About Worker
            </h2>

            <p className="text-gray-600 leading-8">
              {worker.bio}
            </p>
          </div>

          {/* Services */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6">
              Services Offered
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Installation",
                "Maintenance",
                "Repair",
                "Emergency Service",
              ].map((service, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-4 hover:border-blue-500 transition"
                >
                  <h3 className="font-semibold text-gray-800">
                    {service}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Professional {worker.profession.toLowerCase()} service.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Customer Reviews
              </h2>

              <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                <Star size={18} className="fill-yellow-400" />
                {worker.rating}
              </div>
            </div>

            <div className="space-y-5">
              {REVIEWS.map((review, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {review.name}
                    </h3>

                    <span className="text-yellow-500 text-sm font-medium">
                      ★ {review.rating}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-2 leading-7">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold">
              Need urgent service?
            </h2>

            <p className="mt-2 text-blue-100">
              This worker is available for emergency bookings and same-day service.
            </p>

            <button
              onClick={handleBooking}
              className="mt-6 bg-white text-blue-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-2xl transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;