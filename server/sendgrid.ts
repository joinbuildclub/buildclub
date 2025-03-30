import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';
import type { WaitlistEntry } from '@shared/schema';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY not found, SendGrid integration will not work");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgClient.setApiKey(process.env.SENDGRID_API_KEY);
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
    await sgMail.send({
      to,
      from: process.env.ADMIN_EMAIL,
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

    const [response] = await sgClient.request(request);
    console.log(`Contact added to SendGrid: ${entry.email}`, response.statusCode);
    return response.statusCode >= 200 && response.statusCode < 300;
  } catch (error) {
    console.error('Failed to add contact to SendGrid:', error);
    return false;
  }
}

// Function to send welcome email to new waitlist subscriber
export async function sendWelcomeEmail(entry: WaitlistEntry): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thanks for joining the BuildClub waitlist!</h2>
      <p>Hi ${entry.firstName},</p>
      <p>We're excited to have you join our community of builders. We'll keep you updated on upcoming events and opportunities.</p>
      <p>Here's a summary of what you shared with us:</p>
      <ul>
        <li><strong>Name:</strong> ${entry.firstName} ${entry.lastName}</li>
        <li><strong>Email:</strong> ${entry.email}</li>
        <li><strong>Roles:</strong> ${entry.role.join(', ')}</li>
        ${entry.interests ? `<li><strong>Interests:</strong> ${entry.interests}</li>` : ''}
      </ul>
      <p>Looking forward to building together!</p>
      <p>The BuildClub Team</p>
    </div>
  `;

  return sendEmail(entry.email, "Welcome to BuildClub Waitlist!", htmlContent);
}

// Function to send admin notification of new subscriber
export async function sendAdminNotification(entry: WaitlistEntry): Promise<boolean> {
  if (!process.env.ADMIN_EMAIL) {
    console.warn("ADMIN_EMAIL not set. Admin notification not sent.");
    return false;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New BuildClub Waitlist Submission</h2>
      <p>A new user has joined the BuildClub waitlist:</p>
      <ul>
        <li><strong>Name:</strong> ${entry.firstName} ${entry.lastName}</li>
        <li><strong>Email:</strong> ${entry.email}</li>
        <li><strong>Roles:</strong> ${entry.role.join(', ')}</li>
        ${entry.interests ? `<li><strong>Interests:</strong> ${entry.interests}</li>` : ''}
      </ul>
    </div>
  `;

  return sendEmail(process.env.ADMIN_EMAIL, "New BuildClub Waitlist Submission", htmlContent);
}