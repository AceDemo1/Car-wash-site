import React from 'react';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-16">
      {/* About Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">About TBI Mobile Car Wash</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner for professional mobile car detailing services
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="bg-gray-50 rounded-lg p-8 text-left">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Tired of wasting time at traditional car washes? TBI Mobile Car Wash brings the shine to YOU! 
                We offer professional, eco-friendly car detailing at your home, office, or parking lot.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Book now and let your car sparkle while you relax! Our mission is to provide convenient, 
                high-quality car care services that fit into your busy lifestyle, using environmentally 
                conscious products and techniques.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>

  );
};
      
      export default AboutPage;