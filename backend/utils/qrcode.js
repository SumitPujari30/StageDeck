import QRCode from 'qrcode';

/**
 * Generate QR code for event registration
 */
export const generateRegistrationQR = async (registrationData) => {
  try {
    const qrData = JSON.stringify({
      registrationId: registrationData._id,
      eventId: registrationData.event,
      userId: registrationData.user,
      userName: registrationData.userName,
      timestamp: new Date().toISOString(),
    });
    
    // Generate QR code as base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR Code Generation Error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Verify QR code data
 */
export const verifyQRCode = (qrData) => {
  try {
    const data = JSON.parse(qrData);
    
    // Validate required fields
    if (!data.registrationId || !data.eventId || !data.userId) {
      return { valid: false, message: 'Invalid QR code data' };
    }
    
    return { valid: true, data };
  } catch (error) {
    return { valid: false, message: 'Invalid QR code format' };
  }
};

export default {
  generateRegistrationQR,
  verifyQRCode,
};
