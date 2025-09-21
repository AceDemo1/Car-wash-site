import React from 'react';
import { Check, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Service {
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  popular: boolean;
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  const handleBookService = () => {
    // Map service names to form values
    const serviceMapping: { [key: string]: string } = {
      'Basic Wash': 'basicwash',
      'Deluxe': 'deluxe',
      'Premium Detailing': 'premiumdetailing'
    };
    
    const serviceValue = serviceMapping[service.name] || service.name.toLowerCase().replace(' ', '');
    
    // Navigate to booking page with service pre-selected
    navigate('/booking', { state: { selectedService: serviceValue } });
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
        service.popular ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Popular Badge */}
      {service.popular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg flex items-center space-x-1">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-semibold">Popular</span>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
          <div className="text-3xl font-bold text-blue-600 mb-1">{service.price}</div>
          <p className="text-gray-500">{service.duration}</p>
          <p className="text-gray-600 mt-2">{service.description}</p>
        </div>

        {/* Features */}
        <div className="mb-8">
          <ul className="space-y-3">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleBookService}
            className={`w-full inline-block px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              service.popular
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            Book {service.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
