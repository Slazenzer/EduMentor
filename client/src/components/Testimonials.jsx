import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ✅ Import ScrollTrigger
import { Pagination } from "swiper/modules";

// ✅ Register the plugin
gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Amit Singh",
    role: "Senior Mentor",
    message: "This platform made session tracking seamless and payouts hassle-free. Highly recommended!",
  },
  {
    name: "Riya Verma",
    role: "Admin Coordinator",
    message: "I love the analytics and control I get as an admin. Everything is smooth and efficient.",
  },
  {
    name: "Karan Patel",
    role: "Mentor",
    message: "Scheduling and getting paid is so easy now. This platform is a game-changer!",
  },
];

const Testimonials = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className="mt-24 px-4 text-center">
      <h2 className="text-3xl font-bold text-indigo-800 mb-8">What Our Users Say</h2>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1}
        className="max-w-xl mx-auto"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-700 italic mb-4">"{testimonial.message}"</p>
              <h4 className="font-semibold text-indigo-700">{testimonial.name}</h4>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
