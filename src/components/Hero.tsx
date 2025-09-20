import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const scrollToBooking = () => {
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/booking';
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 min-h-screen flex items-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[url('https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center text-white w-full">
        
      
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight px-2">
          We bring the shine to
          <span className="text-yellow-400"> YOU!</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed px-2">
          Professional mobile car detailing at your home, office, or parking lot. 
          Skip the car wash - we come to you!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16 px-2">
          <button
            onClick={scrollToBooking}
            className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <span>Book Now</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Mobile Service</h3>
            <p className="text-blue-100">We come to you wherever you are</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-blue-100">Environmentally conscious cleaning</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Professional</h3>
            <p className="text-blue-100">Expert detailing you can trust</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;