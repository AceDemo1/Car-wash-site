import React from 'react';
import BookingForm from './BookingForm';
import { Calendar, MapPin, CreditCard } from 'lucide-react';

const BookingPage = () => {
  const steps = [
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: 'Choose Service & Time',
      description: 'Select your preferred service and schedule a convenient time',
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: 'Provide Location',
      description: 'Enter your address where you want the service performed',
    },
    {
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      title: 'Pay on Arrival',
      description: 'No upfront payment required - pay when we complete the service',
    },
  ];

  return (
    <div className="pt-16" id="booking">
      {/* Booking Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Book Your Car Wash</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Schedule your mobile car detailing service in just a few clicks
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and convenient booking process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingForm />
        </div>
      </section>
    </div>
  );
};

export default BookingPage;