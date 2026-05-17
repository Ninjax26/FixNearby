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
  CalendarCheck,
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
    portfolio: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop",
        description: "Full apartment rewiring with safety inspection",
        completionDate: "March 2025",
        customerRating: 4.9,
        review: "Excellent work, very professional and clean.",
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
        description: "Installed new electrical panel and circuit breakers",
        completionDate: "January 2025",
        customerRating: 4.8,
        review: "Quick and efficient, highly recommend.",
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop",
        description: "Outdoor lighting setup for residential garden",
        completionDate: "November 2024",
        customerRating: 5.0,
        review: "Transformed our garden, amazing attention to detail.",
      },
    ],
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
    portfolio: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=250&fit=crop",
        description: "Full bathroom pipeline replacement and waterproofing",
        completionDate: "April 2025",
        customerRating: 5.0,
        review: "No leaks at all, superb finish and very tidy work.",
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=250&fit=crop",
        description: "Kitchen sink installation and drain unclogging",
        completionDate: "February 2025",
        customerRating: 4.9,
        review: "Fast response and clean job, would hire again.",
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=250&fit=crop",
        description: "Water heater installation for a 3-bedroom home",
        completionDate: "December 2024",
        customerRating: 4.8,
        review: "Professional and straightforward, great value.",
      },
    ],
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
    portfolio: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=250&fit=crop",
        description: "Custom built-in bookshelf for a home library",
        completionDate: "April 2025",
        customerRating: 4.7,
        review: "Beautiful craftsmanship, exactly what I envisioned.",
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=250&fit=crop",
        description: "Living room wooden furniture set — sofa frame and table",
        completionDate: "January 2025",
        customerRating: 4.5,
        review: "Solid build quality, very happy with the result.",
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=400&h=250&fit=crop",
        description: "Bedroom wardrobe with sliding doors and interior shelving",
        completionDate: "October 2024",
        customerRating: 4.6,
        review: "Fits perfectly and looks amazing, great attention to detail.",
      },
    ],
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
              <h1 className="text-2xl font-bold mt-4">{worker.name}</h1>
              <p className="text-blue-600 font-medium">{worker.profession}</p>
              <div className="flex items-center gap-1 mt-3 bg-yellow-50 px-3 py-1 rounded-full">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{worker.rating}</span>
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

            {/* PORTFOLIO / PREVIOUS WORKS SECTION */}
          {worker.portfolio && worker.portfolio.length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-2">Previous Works</h2>
              <p className="text-gray-500 mb-6">
                A snapshot of completed projects by this professional.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {worker.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition group"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
 
                    {/* Details */}
                    <div className="p-5">
                      <p className="font-semibold text-gray-900 text-sm leading-snug mb-2">
                        {item.description}
                      </p>
 
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                        <CalendarCheck size={13} />
                        <span>{item.completionDate}</span>
                      </div>
 
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={13} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-800">
                          {item.customerRating}
                        </span>
                      </div>
 
                      {/* Review */}
                      <p className="text-xs text-gray-500 italic leading-relaxed">
                        "{item.review}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


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