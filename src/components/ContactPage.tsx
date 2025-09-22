import React from 'react';
import ContactForm from './ContactForm';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="pt-16">
      {/* Contact Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Get in touch for quotes, bookings, or any questions about our services
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <a 
                        href="tel:+447827092693"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        +44 7827 092693
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                      <a 
                        href="https://wa.me/447827092693"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
                        Chat with us instantly
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 rounded-full p-3">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <a 
                        href="mailto:dbsadepoju@gmail.com"
                        className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                      >
                        dbsadepoju@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 rounded-full p-3">
                      <MapPin className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600">
                        46 dawson road, So19 0sq,<br />
                        Southampton, United Kingdom.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Booking */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-white text-center">
                <div className="bg-white rounded-lg p-4 inline-block mb-4 flex items-center justify-center">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/447827092693?text=Hi!%20I%27d%20like%20to%20book%20a%20car%20wash%20service.%20Please%20send%20me%20more%20details." 
                    alt="WhatsApp QR Code" 
                    className="w-32 h-32"
                    onError={(e) => {
                      // Fallback if QR service fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-32 h-32 bg-gray-200 rounded flex items-center justify-center"><span class="text-gray-600 text-sm">QR Code</span></div>';
                      }
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-4">Quick Booking</h3>
                <p className="mb-6">
                  Scan the QR code or click below for instant WhatsApp booking
                </p>
                <a
                  href="https://wa.me/447827092693?text=Hi! I'd like to book a car wash service. Please send me more details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp Booking</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;