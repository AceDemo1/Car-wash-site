import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BookingForm = () => {
  const location = useLocation();
  const preSelectedService = location.state?.selectedService || '';
  
  const [formData, setFormData] = useState({
    service: preSelectedService,
    date: '',
    time: '',
    name: '',
    email: '',
    address: '',
    contact: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const services = [
    { value: 'basicwash', label: 'Basic Wash - £25 (~30 mins)', price: '£25' },
    { value: 'deluxe', label: 'Deluxe - £35 (~45 mins)', price: '£35' },
    { value: 'premiumdetailing', label: 'Premium Detailing - £45+ (1-2 hrs)', price: '£45+' },
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const selectedService = services.find(s => s.value === formData.service);
      
      // Create booking data
      const bookingData = {
        service_type: selectedService?.label || formData.service,
        service_price: Number(selectedService?.price.replace(/[^0-9.]/g, '')) || 0,
        booking_date: formData.date,
        booking_time: formData.time,
        customer_name: formData.name,
        customer_email: formData.email || '',
        customer_phone: formData.contact,
        service_address: formData.address,
        notes: formData.notes || '',
        status: 'pending' as const
      };

      console.log('Submitting booking:', bookingData);

      // Save booking to database
      const { data: booking, error: insertError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Failed to save booking: ${insertError.message}`);
      }

      console.log('Booking saved successfully:', booking);

      // Try to send notifications via edge function
      try {
        const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-booking-notification`;
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            booking: {
              ...bookingData,
              booking_id: booking.id // Add the actual booking ID from database
            }
          }),
        });

        if (!response.ok) {
          console.warn('Edge function failed, using fallback method');
          // Fallback: Open email and WhatsApp manually
          await sendNotificationsFallback(bookingData);
        } else {
          const result = await response.json();
          console.log('Notifications sent via edge function:', result);
        }
      } catch (functionError) {
        console.warn('Edge function error, using fallback:', functionError);
        // Fallback: Open email and WhatsApp manually
        await sendNotificationsFallback(bookingData);
      }

      // Show success message
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form only when user clicks "Book another service"
      setFormData({
        service: '',
        date: '',
        time: '',
        name: '',
        email: '',
        address: '',
        contact: '',
        notes: '',
      });

      
    } catch (error) {
      console.error('Booking submission error:', error);
      setIsSubmitting(false);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const sendNotificationsFallback = async (bookingData: any) => {
    // Format email
    const emailSubject = `New Car Wash Booking - ${bookingData.customer_name}`;
    const emailBody = `🚗 NEW BOOKING ALERT 🚗

Service Details:
• Service: ${bookingData.service_type}
• Price: ${bookingData.service_price}
• Date: ${bookingData.booking_date}
• Time: ${bookingData.booking_time}

Customer Information:
• Name: ${bookingData.customer_name}
• Email: ${bookingData.customer_email || 'Not provided'}
• Phone: ${bookingData.customer_phone}
• Address: ${bookingData.service_address}

${bookingData.notes ? `Additional Notes:\n${bookingData.notes}` : 'No additional notes'}

---
Please contact the customer to confirm this booking.
TBI Mobile Car Wash Booking System`;

    // Format WhatsApp message
    const whatsappMessage = `🚗 *NEW CAR WASH BOOKING* 🚗

*Service:* ${bookingData.service_type}
*Price:* ${bookingData.service_price}
*Date:* ${bookingData.booking_date}
*Time:* ${bookingData.booking_time}

*Customer Details:*
• *Name:* ${bookingData.customer_name}
• *Phone:* ${bookingData.customer_phone}
• *Email:* ${bookingData.customer_email || 'Not provided'}
• *Address:* ${bookingData.service_address}

${bookingData.notes ? `*Notes:* ${bookingData.notes}` : ''}

Please confirm this booking with the customer! 📅✨`;

    // Open email client
    const mailtoUrl = `mailto:lawal641@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/2348166751643?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const isFormValid = formData.service && formData.date && formData.time && formData.name && formData.address && formData.contact;

  // Success Popup
  if (showSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Submitted Successfully!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your booking has been saved and notifications have been sent to our team automatically.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>What's Next:</strong> Our team will contact you within 30 minutes to confirm your appointment and provide any additional details.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Contact us for further details
            </a>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Book another service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Service</h2>
        <p className="text-gray-600">
          Fill out the form below and we'll process your booking automatically
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-2" />
            Select Service
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a service...</option>
            {services.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-2" />
              Preferred Time
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select time...</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-2" />
              Email Address (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-2" />
            Contact Number
          </label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your phone number"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-2" />
            Service Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter the full address where you want the service performed"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special instructions or requests..."
          />
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Payment Information</h4>
          <p className="text-blue-800 text-sm">
            Payment is due upon completion of service. We accept cash and card payments.
            No upfront payment required - book with confidence!
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            isFormValid && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing Booking...</span>
            </>
          ) : (
            <>
              <Calendar className="h-5 w-5" />
              <span>Book Now</span>
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Your booking will be saved and notifications sent automatically to our team
        </p>
      </form>
    </div>
  );
};

export default BookingForm;