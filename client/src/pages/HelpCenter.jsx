import React from "react";
import { Link } from "react-router-dom";
import { FaQuestionCircle, FaTools, FaUser, FaPhoneAlt } from "react-icons/fa";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      
      {/* Header */}
      <div className="bg-gray-900 text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Help Center</h1>
        <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
          Find answers to common questions and learn how to use FixNearby effectively.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-6 -mt-6">
        <input
          type="text"
          placeholder="Search for help..."
          className="w-full p-4 rounded-xl shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Help Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <FaUser className="text-blue-500 text-2xl mb-3" />
          <h3 className="font-semibold text-lg">Account & Profile</h3>
          <p className="text-sm text-gray-500 mt-2">
            Learn how to create, update, and manage your account.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <FaTools className="text-green-500 text-2xl mb-3" />
          <h3 className="font-semibold text-lg">Booking Services</h3>
          <p className="text-sm text-gray-500 mt-2">
            How to find workers and book services easily.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <FaQuestionCircle className="text-purple-500 text-2xl mb-3" />
          <h3 className="font-semibold text-lg">Common Questions</h3>
          <p className="text-sm text-gray-500 mt-2">
            FAQs about payments, cancellations, and more.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <FaPhoneAlt className="text-red-500 text-2xl mb-3" />
          <h3 className="font-semibold text-lg">Contact Support</h3>
          <p className="text-sm text-gray-500 mt-2">
            Need help? Reach out to our support team.
          </p>
        </div>

      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>

        <div className="space-y-4">
          
          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="font-medium">How do I book a service?</h4>
            <p className="text-sm text-gray-500 mt-2">
              Go to the Services page, select a worker, and click on “Book Now”.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="font-medium">Can I cancel a booking?</h4>
            <p className="text-sm text-gray-500 mt-2">
              Yes, you can cancel from your bookings dashboard before the scheduled time.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="font-medium">Are workers verified?</h4>
            <p className="text-sm text-gray-500 mt-2">
              We aim to ensure trust through ratings and reviews from the community.
            </p>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white text-center py-10 px-6">
        <h3 className="text-xl font-semibold">Still need help?</h3>
        <p className="mt-2 text-blue-100">
          Our team is here to assist you anytime.
        </p>
        <Link
          to="/contact"
          className="inline-block mt-4 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default HelpCenter;