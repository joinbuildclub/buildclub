import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';
import type { WaitlistEntry, HubEventRegistration, Event, Hub } from '@shared/schema';

// Initialize SendGrid conditionally
const isSendGridConfigured = !!process.env.SENDGRID_API_KEY && !!process.env.ADMIN_EMAIL;

if (isSendGridConfigured) {
  try {
    // Type assertion to handle undefined case (we've already checked with isSendGridConfigured)
    const apiKey = process.env.SENDGRID_API_KEY as string;
    sgMail.setApiKey(apiKey);
    sgClient.setApiKey(apiKey);
    console.log("SendGrid initialized successfully");
  } catch (error) {
    console.error("Error initializing SendGrid:", error);
  }
} else {
  console.warn("SendGrid not configured. SENDGRID_API_KEY and/or ADMIN_EMAIL missing.");
}

// Function to send email with SendGrid
export async function sendEmail(
  to: string, 
  subject: string, 
  htmlContent: string
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY || !process.env.ADMIN_EMAIL) {
    console.warn("SendGrid credentials not found. Email not sent.");
    return false;
  }

  try {
    const fromEmail = process.env.ADMIN_EMAIL as string;
    await sgMail.send({
      to,
      from: fromEmail,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Function to add a contact to SendGrid
export async function addContactToSendGrid(entry: WaitlistEntry): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY not found. Contact not added to SendGrid.");
    return false;
  }

  try {
    // Format the contact data
    const data = {
      contacts: [
        {
          email: entry.email,
          first_name: entry.firstName,
          last_name: entry.lastName,
          custom_fields: {
            // You can add custom fields if needed
            // e.g. for roles: roles: entry.role.join(',')
          }
        }
      ]
    };

    // Add contact to SendGrid
    const request = {
      url: '/v3/marketing/contacts',
      method: 'PUT' as const,
      body: data
    };

    // Use the type assertion since we already checked if it exists
    const [response] = await sgClient.request(request);
    console.log(`Contact added to SendGrid: ${entry.email}`, response.statusCode);
    return response.statusCode >= 200 && response.statusCode < 300;
  } catch (error) {
    console.error('Failed to add contact to SendGrid:', error);
    return false;
  }
}

// Function to send welcome email to new BuildClub members
export async function sendWelcomeEmail(entry: WaitlistEntry): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to BuildClub!</h2>
      <p>Hi ${entry.firstName},</p>
      <p>We're excited to have you join our community of builders. We'll keep you updated on upcoming events and opportunities.</p>
      <p>Here's a summary of what you shared with us:</p>
      <ul>
        <li><strong>Name:</strong> ${entry.firstName} ${entry.lastName}</li>
        <li><strong>Email:</strong> ${entry.email}</li>
        <li><strong>Interest Areas:</strong> ${entry.interestAreas.join(', ')}</li>
        ${entry.aiInterests ? `<li><strong>AI Interests:</strong> ${entry.aiInterests}</li>` : ''}
      </ul>
      <p>Looking forward to building together!</p>
      <p>The BuildClub Team</p>
    </div>
  `;

  return sendEmail(entry.email, "Welcome to BuildClub!", htmlContent);
}

// Function to send admin notification of new community member
export async function sendAdminNotification(entry: WaitlistEntry): Promise<boolean> {
  if (!process.env.ADMIN_EMAIL) {
    console.warn("ADMIN_EMAIL not set. Admin notification not sent.");
    return false;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New BuildClub Member</h2>
      <p>A new user has joined BuildClub:</p>
      <ul>
        <li><strong>Name:</strong> ${entry.firstName} ${entry.lastName}</li>
        <li><strong>Email:</strong> ${entry.email}</li>
        <li><strong>Interest Areas:</strong> ${entry.interestAreas.join(', ')}</li>
        ${entry.aiInterests ? `<li><strong>AI Interests:</strong> ${entry.aiInterests}</li>` : ''}
      </ul>
    </div>
  `;

  const adminEmail = process.env.ADMIN_EMAIL as string;
  return sendEmail(adminEmail, "New BuildClub Member Joined", htmlContent);
}

// Function to send event registration confirmation email
export async function sendEventRegistrationConfirmation(
  registration: HubEventRegistration,
  event: Event,
  hub: Hub
): Promise<boolean> {
  // Format date and time for human readability
  const eventDate = event.startDateTime 
    ? new Date(event.startDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      })
    : (event.startDate || 'Date TBD');
    
  const eventTime = event.startDateTime
    ? new Date(event.startDateTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      })
    : (event.startTime || 'Time TBD');
  
  const eventEndTime = event.endDateTime
    ? ` - ${new Date(event.endDateTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      })}`
    : (event.endTime ? ` - ${event.endTime}` : '');
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You're Registered for ${event.title}!</h2>
      <p>Hi ${registration.firstName},</p>
      <p>Thank you for registering for the upcoming BuildClub event. We're excited to have you join us!</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #4CAF50;">${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}${eventEndTime}</p>
        <p><strong>Location:</strong> ${hub.name}</p>
      </div>
      
      <p>We recommend adding this event to your calendar to make sure you don't miss it.</p>
      <p>If you have any questions or need to cancel your registration, please reply to this email or visit your dashboard on the BuildClub website.</p>
      <p>Looking forward to seeing you there!</p>
      <p>The BuildClub Team</p>
    </div>
  `;

  return sendEmail(registration.email, `Registered: ${event.title}`, htmlContent);
}

// Function to send event reminder email (to be sent 24h before event)
export async function sendEventReminder(
  registration: HubEventRegistration,
  event: Event,
  hub: Hub
): Promise<boolean> {
  // Format date and time for human readability
  const eventDate = event.startDateTime 
    ? new Date(event.startDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      })
    : (event.startDate || 'Date TBD');
    
  const eventTime = event.startDateTime
    ? new Date(event.startDateTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      })
    : (event.startTime || 'Time TBD');
  
  const eventEndTime = event.endDateTime
    ? ` - ${new Date(event.endDateTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      })}`
    : (event.endTime ? ` - ${event.endTime}` : '');
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reminder: ${event.title} is Tomorrow!</h2>
      <p>Hi ${registration.firstName},</p>
      <p>This is a friendly reminder that you're registered for the BuildClub event happening tomorrow.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #4CAF50;">${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}${eventEndTime}</p>
        <p><strong>Location:</strong> ${hub.name}</p>
      </div>
      
      <p>If something has come up and you can't make it, please let us know by canceling your registration on your dashboard or replying to this email.</p>
      <p>We look forward to seeing you there!</p>
      <p>The BuildClub Team</p>
    </div>
  `;

  return sendEmail(registration.email, `REMINDER: ${event.title} Tomorrow`, htmlContent);
}

// Function to send cancellation confirmation
export async function sendRegistrationCancellation(
  registration: HubEventRegistration,
  event: Event
): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Registration Cancelled: ${event.title}</h2>
      <p>Hi ${registration.firstName},</p>
      <p>We've processed your request to cancel your registration for "${event.title}".</p>
      <p>We hope to see you at future BuildClub events. You can always check our upcoming events on the website and register for any that interest you.</p>
      <p>If you cancelled by mistake or have any questions, please let us know by replying to this email.</p>
      <p>The BuildClub Team</p>
    </div>
  `;

  return sendEmail(registration.email, `Registration Cancelled: ${event.title}`, htmlContent);
}