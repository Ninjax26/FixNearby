import React from "react";
import { Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaTools,
  FaUser,
  FaPhoneAlt,
} from "react-icons/fa";

const helpCards = [
  {
    icon: <FaUser className="text-blue-500 text-2xl" />,
    title: "Account & Profile",
    desc: "Learn how to create, update, and manage your account.",
  },
  {
    icon: <FaTools className="text-green-500 text-2xl" />,
    title: "Booking Services",
    desc: "Find workers and book services in just a few steps.",
  },
  {
    icon: <FaQuestionCircle className="text-purple-500 text-2xl" />,
    title: "Common Questions",
    desc: "FAQs about payments, cancellations, and usage.",
  },
  {
    icon: <FaPhoneAlt className="text-red-500 text-2xl" />,
    title: "Contact Support",
    desc: "Reach out to our support team anytime you need help.",
  },
];

const faqs = [
  {
    q: "How do I book a service?",
    a: "Go to Services, select a worker, and click 'Book Now'.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, you can cancel from your dashboard before the scheduled time.",
  },
  {
    q: "Are workers verified?",
    a: "We ensure trust using ratings, reviews, and verification checks.",
  },
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Header */}
      <header className="bg-gray-900 text-white py-14 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Help Center
        </h1>
        <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
          Find answers, guides, and support to use FixNearby smoothly.
        </p>
      </header>

      {/* Search */}
      <div className="max-w-3xl mx-auto px-6 -mt-6">
        <div className="bg-white shadow-md rounded-xl flex items-center px-4 py-3 border focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      {/* Help Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-lg font-semibold mb-6">Quick Help Topics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpCards.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100"
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 pb-14">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <h4 className="font-medium">{item.q}</h4>
              <p className="text-sm text-gray-500 mt-2">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white text-center py-12 px-6">
        <h3 className="text-xl font-semibold">Still need help?</h3>
        <p className="mt-2 text-blue-100">
          Our support team is available 24/7 to assist you.
        </p>

        <Link
          to="/contact"
          className="inline-block mt-5 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Contact Support
        </Link>
      </section>
    </div>
  );
};

export default HelpCenter;