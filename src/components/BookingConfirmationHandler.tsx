import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const BookingConfirmationHandler = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<any>(null);

  const bookingId = searchParams.get('id');
  const action = searchParams.get('action');

  useEffect(() => {
    const processConfirmation = async () => {
      if (!bookingId || !action || action !== 'confirm') {
        setStatus('error');
        setMessage('Invalid confirmation link - only confirm action is supported');
        return;
      }

      try {
        const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirm-booking`;
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            action,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setStatus('success');
          setMessage(result.message);
          setDetails(result);
        } else {
          setStatus('error');
          setMessage(result.error || 'Failed to process confirmation');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('An error occurred while processing the confirmation');
      }
    };

    processConfirmation();
  }, [bookingId, action]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing...</h2>
          <p className="text-gray-600">
            {action === 'confirm' ? 'Confirming' : 'Cancelling'} booking...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className={`rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center ${
          status === 'success' 
            ? 'bg-green-100' 
            : 'bg-red-100'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="h-12 w-12 text-green-600" />
          ) : (
            <XCircle className="h-12 w-12 text-red-600" />
          )}
        </div>

        <h2 className={`text-3xl font-bold mb-4 ${
          status === 'success' ? 'text-green-900' : 'text-red-900'
        }`}>
          {status === 'success' 
            ? 'Booking Confirmed!'
            : 'Error Occurred'
          }
        </h2>

        <p className="text-gray-600 mb-6 text-lg">
          {message}
        </p>

        {status === 'success' && details?.emailSent && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              ✅ Customer has been automatically notified via email
            </p>
          </div>
        )}

        <div className="space-y-3">
          <a
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Home
          </a>
          
          <a
            href="https://wa.me/+447827092693"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Contact Customer via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationHandler;