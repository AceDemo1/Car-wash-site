const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface BookingConfirmationData {
  bookingId: string;
  action: 'confirm' | 'cancel';
}

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { bookingId, action }: BookingConfirmationData = await req.json();

    // Validate required fields
    if (!bookingId || !action) {
      return new Response(
        JSON.stringify({ error: "Missing booking ID or action" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      hasResendKey: !!resendApiKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      bookingId,
      action
    });

    if (!resendApiKey || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required environment variables" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch booking details from database
    const bookingResponse = await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}&select=*`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
      },
    });

    if (!bookingResponse.ok) {
      throw new Error('Failed to fetch booking details');
    }

    const bookings = await bookingResponse.json();
    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const booking = bookings[0];
    console.log('Found booking:', booking);

    // Update booking status in database (only handle confirm action)
    if (action !== 'confirm') {
      return new Response(
        JSON.stringify({ error: "Only confirm action is supported" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const newStatus = 'confirmed';
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update booking status');
    }

    console.log(`Booking ${bookingId} status updated to: ${newStatus}`);

    // Send confirmation email to customer
    let emailSent = false;
    if (booking.customer_email && booking.customer_email.trim() !== '') {
      try {
        const emailSubject = `✅ Booking Confirmed - TBI Mobile Car Wash`;
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
            <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: #10b981; color: white; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 20px;">
                  ✅
                </div>
                <h1 style="color: #1f2937; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
              </div>
              <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h2 style="color: #065f46; margin-top: 0; font-size: 18px;">🎉 Great news, ${booking.customer_name}!</h2>
                <p style="color: #065f46; margin-bottom: 0;">Your car wash booking has been confirmed. We're excited to make your car shine!</p>
              </div>
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #374151; margin-top: 0; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">📅 Booking Details</h3>
                <div style="display: grid; gap: 12px;">
                  <div><strong>Service:</strong> ${booking.service_type}</div>
                  <div><strong>Date:</strong> ${booking.booking_date}</div>
                  <div><strong>Time:</strong> ${booking.booking_time}</div>
                  <div><strong>Location:</strong> ${booking.service_address}</div>
                  <div><strong>Price:</strong> ${booking.service_price}</div>
                  ${booking.notes ? `<div><strong>Notes:</strong> ${booking.notes}</div>` : ''}
                </div>
              </div>
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #92400e; margin-top: 0;">⏰ What's Next?</h3>
                <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                  <li>Our team will arrive at your location on time</li>
                  <li>We'll bring all necessary equipment and supplies</li>
                  <li>Payment is due upon completion of service</li>
                  <li>We accept both cash and card payments</li>
                </ul>
              </div>
              <div style="text-align: center; margin-bottom: 25px;">
                <a href="https://wa.me/2348166751643" style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  💬 Contact Us on WhatsApp
                </a>
              </div>
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Need to reschedule or have questions? Contact us at +234 816 675 1643
                </p>
                <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
                  TBI Mobile Car Wash - We bring the shine to you!
                </p>
              </div>
            </div>
          </div>
        `;
        // Log the email payload before sending
        console.log('Sending confirmation email to customer:', {
          to: booking.customer_email,
          subject: emailSubject,
          resendApiKey: resendApiKey ? 'SET' : 'NOT SET',
        });
        const customerEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'TBI Car Wash <onboarding@resend.dev>',
            to: [booking.customer_email],
            subject: emailSubject,
            html: emailHtml,
          }),
        });
        // Log the response status and body
        console.log('Resend API response status:', customerEmailResponse.status);
        const responseText = await customerEmailResponse.text();
        console.log('Resend API response body:', responseText);
        if (customerEmailResponse.ok) {
          emailSent = true;
          console.log('Confirmation email sent to customer');
        } else {
          console.error('Failed to send customer email:', responseText);
        }
      } catch (error) {
        console.error('Error sending customer email:', error);
      }
    } else {
      console.log('No customer email provided, skipping customer notification');
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        bookingUpdated: true,
        emailSent,
        message: `Booking confirmed successfully${emailSent ? ' and customer notified' : ''}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in booking confirmation function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process booking confirmation",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});