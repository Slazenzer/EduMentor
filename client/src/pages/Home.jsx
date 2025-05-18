import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { FaChalkboardTeacher, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
import Navbar from "../components/Navbar";
import StatsSection from "../components/StatsSection"
import Testimonials from "../components/Testimonials";

const Home = () => {
  const heroRef = useRef(null);
  const featureRef = useRef(null);
  const imageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(heroRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power3.out",
      })
        .from(featureRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power2.out",
        }, "-=0.5")
        .from(imageRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.7)",
        }, "-=0.7");
    });

    return () => ctx.revert(); // cleanup on unmount
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-purple-100 p-8 pt-20 overflow-x-hidden">
        {/* HERO SECTION */}
        <section ref={heroRef} className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold text-indigo-800">
            Empowering <span className="text-purple-600">Mentors</span> & <span className="text-green-600">Admins</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Track sessions, manage earnings, and streamline operations with our smart, interactive platform.
          </p>
          <button className="mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition">
            Get Started
          </button>
        </section>

        {/* FEATURE SECTION */}
        <section ref={featureRef} className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <FaChalkboardTeacher size={40} className="mx-auto text-indigo-600" />
            <h3 className="mt-4 text-lg font-semibold">Mentor Sessions</h3>
            <p className="text-sm text-gray-600">Schedule and view all your mentor sessions in one place.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <FaCalendarAlt size={40} className="mx-auto text-purple-600" />
            <h3 className="mt-4 text-lg font-semibold">Easy Scheduling</h3>
            <p className="text-sm text-gray-600">Calendar-style scheduling with time tracking and duration.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <FaRupeeSign size={40} className="mx-auto text-green-600" />
            <h3 className="mt-4 text-lg font-semibold">Track Earnings</h3>
            <p className="text-sm text-gray-600">Instantly view your earnings per session or month.</p>
          </div>
        </section>

        {/* IMAGE & CTA SECTION */}
        <section className="mt-20 flex flex-col md:flex-row items-center gap-10 justify-between">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold text-indigo-700">Why Choose Us?</h2>
            <p className="text-gray-600">
              Our platform simplifies session management for mentors and gives admins full control with detailed insights and data analytics.
            </p>
            <button className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
              Learn More
            </button>
          </div>
          <img
            ref={imageRef}
            src="https://illustrations.popsy.co/white/purple-teacher.svg"
            alt="Mentor illustration"
            className="max-w-sm md:max-w-md"
          />
        </section>
        <StatsSection/>
        <Testimonials/>
      </div>
    </>
  );
};

export default Home;
