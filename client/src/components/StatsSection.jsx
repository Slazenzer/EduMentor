import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StatsSection = () => {
  const statsRef = useRef(null);
  const [counters, setCounters] = useState({
    mentors: 0,
    sessions: 0,
    payouts: 0,
  });

  useEffect(() => {
    const targets = { mentors: 0, sessions: 0, payouts: 0 };

    ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.to(targets, {
          mentors: 200,
          sessions: 5000,
          payouts: 120000,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => {
            setCounters({
              mentors: Math.floor(targets.mentors),
              sessions: Math.floor(targets.sessions),
              payouts: Math.floor(targets.payouts),
            });
          },
        });
      },
    });
  }, []);

  return (
    <section ref={statsRef} className="mt-24 bg-white py-12 rounded-xl shadow-inner text-center">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Our Impact</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div>
          <p className="text-5xl font-extrabold text-purple-600">{counters.mentors}+</p>
          <p className="text-lg text-gray-600 mt-2">Mentors Onboarded</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold text-indigo-600">{counters.sessions}+</p>
          <p className="text-lg text-gray-600 mt-2">Sessions Completed</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold text-green-600">₹{counters.payouts.toLocaleString()}</p>
          <p className="text-lg text-gray-600 mt-2">Total Payouts Processed</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;