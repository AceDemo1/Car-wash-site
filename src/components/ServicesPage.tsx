import React from 'react';
import ServiceCard from './ServiceCard';

const ServicesPage = () => {
  const services = [
    {
      name: 'Basic Wash',
      price: '£25',
      duration: '~30 mins',
      description: 'Exterior + windows',
      features: [
        'Exterior wash and rinse',
        'Window cleaning (inside & outside)',
        'Tire cleaning',
        'Quick dry and shine',
      ],
      popular: false,
    },
    {
      name: 'Deluxe',
      price: '£35',
      duration: '~45 mins',
      description: 'Exterior + interior vacuum',
      features: [
        'Everything in Basic Wash',
        'Interior vacuuming',
        'Dashboard cleaning',
        'Door panel wiping',
        'Floor mat cleaning',
      ],
      popular: true,
    },
    {
      name: 'Premium Detailing',
      price: '£45+',
      duration: '1-2 hrs',
      description: 'Clay bar, wax, upholstery',
      features: [
        'Everything in Deluxe',
        'Clay bar treatment',
        'Hand wax application',
        'Upholstery cleaning',
        'Leather conditioning',
        'Engine bay cleaning',
      ],
      popular: false,
    },
  ];

  return (
    <div className="pt-16">
      {/* Services Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Our Services & Pricing</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose the perfect service package for your vehicle's needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Service Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Professional-grade equipment and products</li>
                  <li>• Eco-friendly cleaning solutions</li>
                  <li>• Experienced and trained technicians</li>
                  <li>• Service at your preferred location</li>
                  <li>• Satisfaction guarantee</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment & Booking</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Pay on arrival (cash or card)</li>
                  <li>• Easy online booking system</li>
                  <li>• Flexible scheduling options</li>
                  <li>• Same-day service available</li>
                  <li>• Free quotes via WhatsApp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;