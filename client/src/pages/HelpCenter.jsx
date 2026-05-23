import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaTools,
  FaUser,
  FaPhoneAlt,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaHeadset,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";

const helpCards = [
  {
    icon: <FaUser className="text-sky-500 text-3xl" />,
    title: "Account & Profile",
    desc: "Manage your account settings, update your profile, and keep your information secure.",
    link: "/profile",
  },
  {
    icon: <FaTools className="text-emerald-500 text-3xl" />,
    title: "Booking Services",
    desc: "Book trusted workers quickly and track all your services in one place.",
    link: "/services",
  },
  {
    icon: <FaQuestionCircle className="text-violet-500 text-3xl" />,
    title: "Common Questions",
    desc: "Find answers about payments, cancellations, refunds, and app usage.",
    link: "/faq",
  },
  {
    icon: <FaPhoneAlt className="text-rose-500 text-3xl" />,
    title: "Contact Support",
    desc: "Get help from our support team anytime you need assistance.",
    link: "/contact",
  },
];

const faqs = [
  {
    q: "How do I book a service?",
    a: "Go to the Services page, select a worker based on ratings and availability, then click 'Book Now' to confirm your service request.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. You can cancel your booking from your dashboard before the scheduled service time.",
  },
  {
    q: "Are workers verified?",
    a: "Yes. Workers go through verification checks and are reviewed by customers through ratings and feedback.",
  },
  {
    q: "How do I make payments?",
    a: "You can securely pay online using cards, UPI, wallets, or other supported payment methods.",
  },
  {
    q: "How do I contact support?",
    a: "Visit the Contact Support section below or navigate to the Contact page for direct assistance.",
  },
];

const supportStats = [
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    desc: "Always available",
  },
  {
    icon: <FaClock />,
    title: "Quick Response",
    desc: "Average reply in minutes",
  },
  {
    icon: <FaShieldAlt />,
    title: "Trusted Platform",
    desc: "Safe & secure services",
  },
];

const HelpCenter = () => {
  const [search, setSearch] = useState("");
  const [activeFAQ, setActiveFAQ] = useState(null);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-gray-800 overflow-hidden">
      
      {/* Hero Section */}
      <header className="relative bg-gray-950 text-white py-20 px-6">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#3b82f6,_transparent_40%)]"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center px-4 py-1 rounded-full border border-white/20 bg-white/10 text-sm backdrop-blur">
            Support Center
          </span>

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            How can we help you today?
          </h1>

          <p className="mt-5 text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
            Browse FAQs, discover quick solutions, and get expert support for
            all your FixNearby needs.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mt-10">
            <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl flex items-center px-5 py-4 shadow-2xl">
              <FaSearch className="text-gray-300 mr-3" />

              <input
                type="text"
                placeholder="Search help articles, FAQs, support..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Support Stats */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {supportStats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                {item.icon}
              </div>

              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Help Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold">Quick Help Topics</h2>
            <p className="text-gray-500 mt-2">
              Explore guides and support resources instantly.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition"
          >
            Explore Services <FaArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">
          {helpCards.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="group bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                {item.icon}
              </div>

              <h3 className="font-bold text-xl mb-3">{item.title}</h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-blue-600 font-medium text-sm">
                Learn More
                <FaArrowRight
                  size={11}
                  className="group-hover:translate-x-1 transition"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
            FAQs
          </span>

          <h2 className="text-4xl font-bold mt-3">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Find quick answers to the most common questions about bookings,
            payments, support, and account management.
          </p>
        </div>

        <div className="space-y-5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, idx) => {
              const isOpen = activeFAQ === idx;

              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActiveFAQ(isOpen ? null : idx)
                    }
                    className="w-full flex items-center justify-between text-left p-6 hover:bg-gray-50 transition"
                  >
                    <span className="font-semibold text-base md:text-lg">
                      {item.q}
                    </span>

                    <span className="text-blue-600">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
              <h3 className="font-semibold text-lg">
                No matching results found
              </h3>

              <p className="text-gray-500 mt-2">
                Try searching with different keywords.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_white,_transparent_35%)]"></div>

        <div className="relative max-w-5xl mx-auto py-20 px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold">
            Still need assistance?
          </h3>

          <p className="mt-5 text-blue-100 text-lg max-w-2xl mx-auto">
            Our dedicated support team is here to help you anytime with your
            bookings, account issues, or technical support.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/contact"
              className="px-7 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Contact Support
            </Link>

            <Link
              to="/faq"
              className="px-7 py-3 border border-white/30 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Browse FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;