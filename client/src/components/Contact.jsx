import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-white">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium backdrop-blur">
            💬 We're Here To Help
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight">
            Contact Us
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed">
            Have questions, feedback, or need support? Reach out to the
            FixNearby team anytime — we’d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

          {/* Left Info */}
          <div>

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              Get In Touch
            </div>

            <h2 className="mt-5 text-4xl font-extrabold text-gray-900 leading-tight">
              We'd Love To <span className="text-blue-600">Hear From You</span>
            </h2>

            <p className="mt-5 text-gray-600 leading-relaxed text-lg">
              Whether you're looking for support, partnership opportunities,
              worker registration help, or general inquiries — our team is
              always ready to assist you.
            </p>

            {/* Contact Cards */}
            <div className="mt-10 space-y-5">

              <div className="flex items-start gap-5 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  <FaEnvelope />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Email Us
                  </h3>
                  <p className="text-gray-500 mt-1">
                    support@fixnearby.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
                  <FaPhoneAlt />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Call Us
                  </h3>
                  <p className="text-gray-500 mt-1">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Office Address
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Siliguri, West Bengal, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                  <FaClock />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Working Hours
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Mon - Sat : 9:00 AM - 7:00 PM
                  </p>
                </div>
              </div>

            </div>

            {/* Social Links */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Follow Us
              </h3>

              <div className="flex gap-4">
                {[
                  { icon: <FaFacebookF />, color: "hover:bg-blue-600" },
                  { icon: <FaTwitter />, color: "hover:bg-sky-500" },
                  { icon: <FaLinkedinIn />, color: "hover:bg-blue-700" },
                  { icon: <FaGithub />, color: "hover:bg-gray-900" },
                ].map((item, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 transition-all duration-300 hover:text-white hover:scale-105 ${item.color}`}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 lg:p-10">

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Send a Message
              </h2>

              <p className="mt-2 text-gray-500">
                Fill out the form and our team will get back to you shortly.
              </p>
            </div>

            <form className="space-y-6">

              <div className="grid sm:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                  />
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Enter subject"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>

                <textarea
                  rows="6"
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Send Message
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">

          <h2 className="text-4xl font-extrabold">
            Need Immediate Assistance?
          </h2>

          <p className="mt-4 text-gray-400 text-lg">
            Browse trusted professionals near you and book services instantly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/services"
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
            >
              Browse Services
            </Link>

            <Link
              to="/register"
              className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition font-semibold"
            >
              Become a Pro
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;