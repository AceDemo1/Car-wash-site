import React from 'react';
import Hero from './Hero';
import { MapPin, Leaf, Star, Clock } from 'lucide-react';

const HomePage = () => {
  const benefits = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: 'Mobile Service',
      description: 'We come to your location - home, office, or parking lot. No need to travel or wait in line.',
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: 'Eco-Friendly',
      description: 'Environmentally conscious cleaning products and water-saving techniques.',
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: 'Professional Detailing',
      description: 'Expert technicians with years of experience and attention to detail.',
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: 'Time Saving',
      description: 'Relax while we handle your car. Perfect for busy professionals and families.',
    },
  ];

  return (
    <div>
      <Hero />
      
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 px-2">
              Why Choose TBI Mobile Car Wash?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Experience the convenience of professional car detailing that comes to you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 px-2">
            Ready to Give Your Car the Shine It Deserves?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-2">
            Book your mobile car wash service today and experience the convenience of professional detailing at your location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/booking"
              className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Book Now
            </a>
            <a
              href="https://wa.me/447827092693"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;