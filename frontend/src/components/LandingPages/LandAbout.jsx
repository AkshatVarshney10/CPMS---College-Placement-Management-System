import React, { useState } from 'react';
import {
  FaGraduationCap,
  FaBriefcase,
  FaUsers,
  FaUserShield,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
} from 'react-icons/fa';

function LandAbout() {
  const stats = [
    { value: '95%', label: 'Placement Rate', description: 'Students successfully placed' },
    { value: '250+', label: 'Companies Visited', description: 'Top recruiters annually' },
    { value: '18 LPA', label: 'Highest Package', description: 'Record placement offer' },
    { value: '8.5 LPA', label: 'Average Package', description: 'Across all branches' },
  ];

  const roles = [
    {
      id: 1,
      title: 'Students',
      icon: FaGraduationCap,
      description:
        'Register, explore job opportunities, apply for positions, and track your application status with a personalized dashboard.',
      features: [
        'Explore job opportunities',
        'Apply for positions seamlessly',
        'Track application status',
        'Personalized dashboard',
      ],
    },
    {
      id: 2,
      title: 'Career Development Cell',
      icon: FaBriefcase,
      description:
        'Manage student data, post job opportunities, review applications, and generate insightful reports for placement tracking.',
      features: [
        'Manage student database',
        'Post job opportunities',
        'Review applications',
        'Generate placement reports',
      ],
    },
    {
      id: 3,
      title: 'Management',
      icon: FaUsers,
      description:
        'Monitor overall placement activities, review analytics, control system access, and ensure quality assurance across the platform.',
      features: [
        'Monitor placement activities',
        'Access detailed analytics',
        'Control system access',
        'Quality assurance',
      ],
    },
    {
      id: 4,
      title: 'Super Admin',
      icon: FaUserShield,
      description:
        'Handle all roles with super privileges — manage users, configure system settings, and ensure smooth operations across all modules.',
      features: [
        'Complete system control',
        'User management',
        'System configuration',
        'Operations oversight',
      ],
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Student Registration',
      description:
        'Students create profiles with academic details, skills, and preferences. The system validates and stores all information securely.',
    },
    {
      number: '02',
      title: 'Company Onboarding',
      description:
        'Recruiters register and post job opportunities. CDC team reviews and approves company profiles and job postings.',
    },
    {
      number: '03',
      title: 'Application Process',
      description:
        'Students apply for suitable positions. The system manages eligibility criteria, application tracking, and status updates.',
    },
    {
      number: '04',
      title: 'Interview Coordination',
      description:
        'CDC schedules interviews, sends notifications, and manages the complete interview process from invitation to feedback.',
    },
    {
      number: '05',
      title: 'Offer Management',
      description:
        'Track job offers, acceptances, and final placements. Generate comprehensive reports and analytics for stakeholders.',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Placed at Google',
      package: '₹42 LPA',
      testimonial:
        'The placement portal made my job search incredibly smooth. I could track all my applications in one place and got timely notifications for every interview. Highly recommend!',
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Placed at Microsoft',
      package: '₹38 LPA',
      testimonial:
        "IIIT's placement system is world-class. The interface is intuitive, and the CDC team was always available to help. Grateful for the opportunities I received!",
    },
    {
      id: 3,
      name: 'Arjun Mehta',
      role: 'Placed at Amazon',
      package: '₹35 LPA',
      testimonial:
        'From registration to final placement, everything was transparent and efficient. The portal\'s features helped me prepare better and stay organized throughout.',
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      role: 'Placed at Flipkart',
      package: '₹28 LPA',
      testimonial:
        'The best placement portal I\'ve experienced. Real-time updates, easy application process, and excellent support from the placement cell. Thank you IIIT!',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'TPO Representative',
      package: 'Goldman Sachs',
      testimonial:
        'As a recruiter, this platform has streamlined our hiring process significantly. The quality of candidates and the system\'s efficiency is impressive.',
    },
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white">
      {/* 1. Statistics Section */}
      <section id="stats" className="py-20 bg-gradient-to-b from-white via-amber-50/20 to-stone-50 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4">
              Placement Excellence
            </h2>
            <p className="text-lg text-stone-600">
              Numbers that speak for our commitment to student success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all text-center group"
              >
                <div className="text-4xl sm:text-5xl font-extrabold text-amber-700 mb-2 group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-base font-bold text-stone-900 mb-1">{stat.label}</div>
                <div className="text-xs sm:text-sm text-stone-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Platform for Everyone (Roles) Section */}
      <section id="roles" className="py-24 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4">
              Platform for Everyone
            </h2>
            <p className="text-lg text-stone-600">
              Tailored experiences for students, administrators, and recruiters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map((role) => {
              const IconComp = role.icon;
              return (
                <div
                  key={role.id}
                  className="relative group bg-white rounded-2xl border border-stone-200 p-7 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top hover indicator line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center text-2xl mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <IconComp />
                    </div>

                    <h3 className="text-xl font-bold text-stone-900 mb-3">{role.title}</h3>
                    <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                      {role.description}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-stone-100">
                      {role.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                          <FaCheckCircle className="text-amber-600 text-xs shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="process" className="py-24 bg-gradient-to-b from-stone-50 via-amber-50/20 to-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-stone-600">
              A streamlined process from registration to placement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-5xl font-extrabold text-amber-700/20 block mb-3">
                    {step.number}
                  </span>
                  <h4 className="text-lg font-bold text-stone-900 mb-2">{step.title}</h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials / Success Stories Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-stone-600">
              Hear from our students and recruiters
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-stone-50 rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm relative overflow-hidden">
              <FaQuoteLeft className="text-4xl sm:text-6xl text-amber-600/15 absolute top-6 left-6" />

              <div className="relative z-10 text-center">
                <p className="text-lg sm:text-xl text-stone-700 italic mb-8 leading-relaxed">
                  "{testimonials[activeTestimonial].testimonial}"
                </p>

                <div className="inline-flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold text-xl flex items-center justify-center mb-3 shadow-md">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                  <h4 className="text-lg font-bold text-stone-900">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-amber-700">
                      {testimonials[activeTestimonial].role}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {testimonials[activeTestimonial].package}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                className="w-11 h-11 rounded-full bg-white border border-stone-300 text-stone-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 flex items-center justify-center transition-all shadow-xs cursor-pointer"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      activeTestimonial === idx
                        ? 'bg-amber-600 w-8'
                        : 'bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="w-11 h-11 rounded-full bg-white border border-stone-300 text-stone-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 flex items-center justify-center transition-all shadow-xs cursor-pointer"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandAbout;
