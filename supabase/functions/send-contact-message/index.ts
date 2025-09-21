const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ContactData {
  name: string;
  email: string;
  message: string;
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

    const { contact }: { contact: ContactData } = await req.json();

    // Validate required fields
    if (!contact.name || !contact.email || !contact.message) {
      return new Response(
        JSON.stringify({ error: "Missing required contact information" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get API key from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const yourEmail = Deno.env.get('YOUR_EMAIL') || 'lawal641@gmail.com';
    
    // Debug logging
    console.log('Environment check:', {
      hasResendKey: !!resendApiKey,
      resendKeyLength: resendApiKey ? resendApiKey.length : 0,
      yourEmail: yourEmail,
      contactData: contact
    });

    // Validate environment variables
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "RESEND_API_KEY not configured in Supabase environment variables" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!yourEmail) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "YOUR_EMAIL not configured in Supabase environment variables" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let emailSent = false;
    let errors: string[] = [];

    // Format email content
    const emailSubject = `📧 Contact Form Message - ${contact.name}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          📧 NEW CONTACT MESSAGE
        </h2>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 8px 0;"><strong>Name:</strong> ${contact.name}</li>
            <li style="margin: 8px 0;"><strong>Email:</strong> ${contact.email}</li>
          </ul>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Message</h3>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #3b82f6;">
            ${contact.message.replace(/\n/g, '<br>')}
          </div>
        </div>

        <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #166534;">
            <strong>Action Required:</strong> Please respond to this customer inquiry.
          </p>
          <p style="margin: 10px 0 0 0; color: #166534;">
            Reply directly to: <strong>${contact.email}</strong>
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          TBI Mobile Car Wash Contact System
        </p>
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
            reply_to: contact.email, // This allows you to reply directly to the customer
          }),
        });

        console.log('Email API response status:', emailResponse.status);
        
        if (emailResponse.ok) {
          emailSent = true;
          console.log('Contact email sent successfully via Resend');
          const responseData = await emailResponse.json();
          console.log('Email sent with ID:', responseData.id);
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

    // Return response
    console.log('Final response:', { success: emailSent, emailSent, errors });
    return new Response(
      JSON.stringify({
        success: emailSent,
        emailSent,
        message: emailSent 
          ? "Contact message sent successfully" 
          : "Failed to send contact message",
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: emailSent ? 200 : 500,
      }
    );

  } catch (error) {
    console.error("Error in contact message function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to send contact message",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});