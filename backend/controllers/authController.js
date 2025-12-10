import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import generateOTP from '../utils/generateOTP.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register new user (regular users only)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user with 'user' role
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Request admin registration OTP
// @route   POST /api/auth/admin/request-otp
// @access  Public
export const requestAdminOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store pending admin registration in temporary collection or use a temp field
    // For simplicity, we'll create the user but mark as unverified
    const tempUser = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isVerified: false,
    });

    // Set OTP
    await tempUser.setOTP(otp);
    await tempUser.save();

    // Send OTP to hardcoded admin notification email
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@stagedeck.com';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #6366f1; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #6366f1; margin: 20px 0; border-radius: 8px; letter-spacing: 5px; }
          .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎭 StageDeck Admin</h1>
            <p>New Admin Registration Request</p>
          </div>
          <div class="content">
            <h2>Admin Registration OTP</h2>
            <div class="info-box">
              <strong>⚠️ New Admin Registration Attempt</strong><br>
              Name: ${name}<br>
              Email: ${email}
            </div>
            <p>Someone is attempting to register as an admin. If this was you, use the OTP below to complete registration:</p>
            <div class="otp-box">${otp}</div>
            <p><strong>This OTP will expire in ${process.env.OTP_EXPIRE_MINUTES || 5} minutes.</strong></p>
            <p>If you did not initiate this registration, please ignore this email and contact your system administrator.</p>
            <p>Best regards,<br>The StageDeck Security Team</p>
          </div>
          <div class="footer">
            <p>© 2025 StageDeck. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      email: adminEmail,
      subject: '🔐 StageDeck Admin Registration - OTP Verification Required',
      html,
    });

    res.json({
      success: true,
      message: 'OTP sent to admin notification email. Please check and verify.',
      email: email, // Return the email for verification step
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify admin OTP and complete registration
// @route   POST /api/auth/admin/verify-otp
// @access  Public
export const verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email, role: 'admin' }).select('+otp +otpExpire');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin registration not found',
      });
    }

    // Verify OTP
    const isValid = await user.verifyOTP(otp);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Mark as verified and clear OTP
    user.isVerified = true;
    user.clearOTP();
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Admin registration completed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpire');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Set OTP and expiration
    await user.setOTP(otp);
    await user.save();

    // Send OTP email
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #6366f1; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #6366f1; margin: 20px 0; border-radius: 8px; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎭 StageDeck</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>You requested to reset your password. Use the OTP below to proceed:</p>
            <div class="otp-box">${otp}</div>
            <p><strong>This OTP will expire in ${process.env.OTP_EXPIRE_MINUTES || 5} minutes.</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The StageDeck Team</p>
          </div>
          <div class="footer">
            <p>© 2025 StageDeck. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Reset Your Password - StageDeck Verification Code',
      html,
    });

    res.json({
      success: true,
      message: 'OTP sent to email',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpire');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify OTP
    const isValid = await user.verifyOTP(otp);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpire');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update password
    user.password = password;
    user.clearOTP();
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
