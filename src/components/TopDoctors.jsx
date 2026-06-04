import React, { useState, useRef, useEffect, memo } from "react";
import { doctors } from "../assets/assets";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const TOP_DOCTORS = doctors.slice(0, 10);

const DoctorCard = memo(({ doctor, visible, index }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      to={`/doctorprofile/${doctor._id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.45s ease ${index * 55}ms, transform 0.45s ease ${index * 55}ms, box-shadow 0.3s`,
      }}
      aria-label={`View ${doctor.name}'s profile`}
    >
      {/* Fixed height + width keeps space reserved before image loads — prevents CLS */}
      <div
        className="relative overflow-hidden bg-blue-50 dark:bg-gray-700"
        style={{ height: "176px" }}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
        )}
        <img
          src={doctor.image}
          alt={`Dr. ${doctor.name}`}
          width="280"
          height="176"
          className={`w-full h-full object-cover hover:scale-105 transition-transform duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
        />
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium mb-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" aria-hidden="true" />
          Available
        </div>
        <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{doctor.name}</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{doctor.speciality}</p>
      </div>
    </Link>
  );
});

DoctorCard.displayName = "DoctorCard";

const TopDoctors = () => {
  const [visible, setVisible] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (gridRef.current) obs.observe(gridRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="sm:mx-[10%] pt-12 pb-6" aria-labelledby="top-doctors-heading">
      <div className="text-center mb-8">
        <h2 id="top-doctors-heading" className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          Top Doctors to Book
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
      >
        {TOP_DOCTORS.map((doctor, index) => (
          <DoctorCard key={doctor._id} doctor={doctor} index={index} visible={visible} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/alldoctors"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
        >
          View All Doctors <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default TopDoctors;