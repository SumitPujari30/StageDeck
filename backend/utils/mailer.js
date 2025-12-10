import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send registration confirmation email
 */
export const sendRegistrationConfirmation = async (userEmail, userName, eventDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'StageDeck <noreply@stagedeck.com>',
      to: userEmail,
      subject: `Registration Confirmed: ${eventDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Registration Confirmed! 🎉</h2>
          <p>Hi ${userName},</p>
          <p>Your registration for <strong>${eventDetails.title}</strong> has been confirmed!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Event Details:</h3>
            <p><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${eventDetails.time}</p>
            <p><strong>Venue:</strong> ${eventDetails.venue}</p>
            <p><strong>Location:</strong> ${eventDetails.location}</p>
          </div>
          
          <p>Please keep this email for your records. You'll need to show your QR code at the event entrance.</p>
          
          <p>Looking forward to seeing you there!</p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated email from StageDeck Event Management System.
          </p>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send event reminder email
 */
export const sendEventReminder = async (userEmail, userName, eventDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'StageDeck <noreply@stagedeck.com>',
      to: userEmail,
      subject: `Reminder: ${eventDetails.title} is Tomorrow!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Event Reminder ⏰</h2>
          <p>Hi ${userName},</p>
          <p>This is a friendly reminder that <strong>${eventDetails.title}</strong> is happening tomorrow!</p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0;">Event Details:</h3>
            <p><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${eventDetails.time}</p>
            <p><strong>Venue:</strong> ${eventDetails.venue}</p>
            <p><strong>Location:</strong> ${eventDetails.location}</p>
          </div>
          
          <p>Don't forget to bring your QR code for check-in!</p>
          
          <p>See you soon!</p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated email from StageDeck Event Management System.
          </p>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send payment confirmation email
 */
export const sendPaymentConfirmation = async (userEmail, userName, eventDetails, paymentInfo) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'StageDeck <noreply@stagedeck.com>',
      to: userEmail,
      subject: `Payment Confirmed: ${eventDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Payment Successful! ✅</h2>
          <p>Hi ${userName},</p>
          <p>Your payment for <strong>${eventDetails.title}</strong> has been confirmed.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Payment Details:</h3>
            <p><strong>Amount:</strong> ₹${paymentInfo.amount}</p>
            <p><strong>Transaction ID:</strong> ${paymentInfo.transactionId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Event Details:</h3>
            <p><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${eventDetails.time}</p>
            <p><strong>Venue:</strong> ${eventDetails.venue}</p>
          </div>
          
          <p>Your registration is now complete. See you at the event!</p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated email from StageDeck Event Management System.
          </p>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send feedback thank you email
 */
export const sendFeedbackThankYou = async (userEmail, userName, eventTitle) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'StageDeck <noreply@stagedeck.com>',
      to: userEmail,
      subject: `Thank You for Your Feedback!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Thank You! 🙏</h2>
          <p>Hi ${userName},</p>
          <p>Thank you for taking the time to share your feedback about <strong>${eventTitle}</strong>.</p>
          
          <p>Your input helps us improve and create better events for our community.</p>
          
          <p>We hope to see you at our future events!</p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated email from StageDeck Event Management System.
          </p>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send registration status update email
 */
export const sendRegistrationStatusUpdate = async (userEmail, userName, eventTitle, status) => {
  try {
    const transporter = createTransporter();
    
    const statusMessages = {
      approved: {
        subject: 'Registration Approved',
        color: '#10b981',
        message: 'Your registration has been approved! We look forward to seeing you at the event.',
      },
      rejected: {
        subject: 'Registration Update',
        color: '#ef4444',
        message: 'Unfortunately, your registration could not be approved at this time. Please contact us for more information.',
      },
    };
    
    const statusInfo = statusMessages[status] || statusMessages.approved;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'StageDeck <noreply@stagedeck.com>',
      to: userEmail,
      subject: `${statusInfo.subject}: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${statusInfo.color};">Registration ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
          <p>Hi ${userName},</p>
          <p>${statusInfo.message}</p>
          
          <p><strong>Event:</strong> ${eventTitle}</p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated email from StageDeck Event Management System.
          </p>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendRegistrationConfirmation,
  sendEventReminder,
  sendPaymentConfirmation,
  sendFeedbackThankYou,
  sendRegistrationStatusUpdate,
};
