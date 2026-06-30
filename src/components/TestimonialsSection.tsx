import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Shield, MapPin } from 'lucide-react';
import { testimonials } from '@/data/scamData';

const TestimonialsSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section id="testimonials" className="bg-gradient-to-b from-green-50 to-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Real Stories from People Like You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These are real experiences from seniors who recognized scams and
            protected themselves. Their stories can help protect you too.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {currentTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-5">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-200 flex-shrink-0"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-base">
                    <span>Age {t.age}</span>
                    <span className="text-gray-300">|</span>
                    <MapPin className="w-4 h-4" />
                    <span>{t.location}</span>
                  </div>
                </div>
              </div>

              <div className="relative mb-5">
                <Quote className="w-8 h-8 text-green-200 absolute -top-1 -left-1" />
                <p className="text-lg text-gray-700 leading-relaxed pl-6 italic">
                  {t.story}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-base font-semibold">
                  {t.scamType}
                </span>
                <div className="flex items-center gap-2 text-green-700 font-bold text-base">
                  <Shield className="w-5 h-5" />
                  <span>{t.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${
                  currentPage === i
                    ? 'bg-blue-900 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
