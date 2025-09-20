const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface BookingData {
  booking_id?: string;
  service_type: string;
  service_price: string;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_address: string;
  notes?: string;
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

    const { booking }: { booking: BookingData } = await req.json();

    // Validate required fields
    if (!booking.customer_name || !booking.customer_phone || !booking.service_type) {
      return new Response(
        JSON.stringify({ error: "Missing required booking information" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get API keys from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioWhatsAppNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER'); // e.g., 'whatsapp:+14155238886'
    const yourWhatsAppNumber = Deno.env.get('YOUR_WHATSAPP_NUMBER'); // e.g., 'whatsapp:+2348166751643'
    const yourEmail = Deno.env.get('YOUR_EMAIL') || 'lawal641@gmail.com';

    let emailSent = false;
    let whatsappSent = false;
    let errors: string[] = [];

    // Format email content
    const emailSubject = `🚗 New Car Wash Booking - ${booking.customer_name}`;
    
    // Create confirmation URLs
    const baseUrl = Deno.env.get('SITE_URL') || req.headers.get('origin') || 'http://localhost:5173';
    const confirmUrl = `${baseUrl}/confirm-booking?id=${booking.booking_id}&action=confirm`;
    const cancelUrl = `${baseUrl}/confirm-booking?id=${booking.booking_id}&action=cancel`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🚗 NEW BOOKING ALERT</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border: 1px solid #e5e7eb;">
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-top: 0; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">📅 Service Details</h3>
        <div style="display: grid; gap: 12px;">
          <div><strong>Service:</strong> ${booking.service_type}</div>
          <div><strong>Price:</strong> ${booking.service_price}</div>
          <div><strong>Date:</strong> ${booking.booking_date}</div>
          <div><strong>Time:</strong> ${booking.booking_time}</div>
        </div>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-top: 0; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">👤 Customer Information</h3>
        <div style="display: grid; gap: 12px;">
          <div><strong>Name:</strong> ${booking.customer_name}</div>
          <div><strong>Email:</strong> ${booking.customer_email || 'Not provided'}</div>
          <div><strong>Phone:</strong> <a href="tel:${booking.customer_phone}" style="color: #3b82f6;">${booking.customer_phone}</a></div>
          <div><strong>Address:</strong> ${booking.service_address}</div>
        </div>
        </div>

      ${booking.notes ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-top: 0;">📝 Additional Notes</h3>
        <p style="margin: 0; font-style: italic;">${booking.notes}</p>
        </div>
      ` : ''}

        <div style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 25px; margin-bottom: 30px; text-align: center;">
        <h3 style="color: #991b1b; margin-top: 0; font-size: 18px;">⚡ ACTION REQUIRED</h3>
        <p style="color: #991b1b; margin-bottom: 20px; font-size: 16px;">
          Click one of the buttons below to confirm or cancel this booking:
        </p>
        <!-- Center the button using a table for best email compatibility -->
        <table role="presentation" width="100%" style="margin: 0 auto; border-collapse: collapse;">
          <tr>
          <td align="center" style="padding: 10px 0;">
            <a href="${confirmUrl}" 
             style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            ✅ CONFIRM BOOKING
            </a>
          </td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 12px; margin: 15px 0 0 0;">
          Clicking this button will automatically confirm the booking and notify the customer.
        </p>
        </div>
      </div>

      <div style="background-color: #f8fafc; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
        TBI Mobile Car Wash - Automated Booking System
        </p>
      </div>
      </div>
    `;

    // Send Email using Resend
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'TBI Car Wash <onboarding@resend.dev>',
            to: [yourEmail],
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (emailResponse.ok) {
          emailSent = true;
          console.log('Email sent successfully via Resend');
        } else {
          const errorData = await emailResponse.text();
          errors.push(`Email failed: ${errorData}`);
          console.error('Resend email error:', errorData);
        }
      } catch (error) {
        errors.push(`Email error: ${error.message}`);
        console.error('Email sending error:', error);
      }
    } else {
      errors.push('RESEND_API_KEY not configured');
    }

    // Send WhatsApp using Twilio
    if (twilioAccountSid && twilioAuthToken && twilioWhatsAppNumber && yourWhatsAppNumber) {
      try {
        const whatsappMessage = `🚗 *NEW CAR WASH BOOKING* 🚗

*Service:* ${booking.service_type}
*Price:* ${booking.service_price}
*Date:* ${booking.booking_date}
*Time:* ${booking.booking_time}

*Customer Details:*
• *Name:* ${booking.customer_name}
• *Phone:* ${booking.customer_phone}
• *Email:* ${booking.customer_email || 'Not provided'}
• *Address:* ${booking.service_address}

${booking.notes ? `*Notes:* ${booking.notes}` : ''}

Please confirm this booking with the customer! 📅✨`;

        const whatsappResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: twilioWhatsAppNumber,
            To: yourWhatsAppNumber,
            Body: whatsappMessage,
          }),
        });

        if (whatsappResponse.ok) {
          whatsappSent = true;
          console.log('WhatsApp message sent successfully via Twilio');
        } else {
          const errorData = await whatsappResponse.text();
          errors.push(`WhatsApp failed: ${errorData}`);
          console.error('Twilio WhatsApp error:', errorData);
        }
      } catch (error) {
        errors.push(`WhatsApp error: ${error.message}`);
        console.error('WhatsApp sending error:', error);
      }
    } else {
      errors.push('Twilio WhatsApp credentials not fully configured');
    }

    // Return response
    const success = emailSent || whatsappSent;
    return new Response(
      JSON.stringify({
        success,
        emailSent,
        whatsappSent,
        message: success 
          ? "Booking notifications processed" 
          : "Failed to send notifications",
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: success ? 200 : 500,
      }
    );

  } catch (error) {
    console.error("Error in booking notification function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process booking notification",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});