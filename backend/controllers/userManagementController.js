import User from '../models/User.js';

// @desc    Get all users (pending, approved, rejected)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { status, role } = req.query;

    const filter = {};
    if (status) filter.approvalStatus = status;
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password -otp -otpExpire')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get pending users
// @route   GET /api/users/pending
// @access  Private/Admin
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      approvalStatus: 'pending',
      role: 'user'
    })
      .select('-password -otp -otpExpire')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve user
// @route   PATCH /api/users/:userId/approve
// @access  Private/Admin
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.approvalStatus = 'approved';
    user.approvedBy = req.user._id;
    user.approvedAt = Date.now();

    await user.save();

    // Send approval email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Account Approved - StageDeck',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">Welcome to StageDeck!</h2>
            <p>Hi ${user.name},</p>
            <p>Great news! Your account has been approved by our admin team.</p>
            <p>You can now access all features and start exploring amazing events.</p>
            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
              Login to Your Account
            </a>
            <p>Thank you for joining StageDeck!</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        approvalStatus: user.approvalStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject user
// @route   PATCH /api/users/:userId/reject
// @access  Private/Admin
export const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.approvalStatus = 'rejected';
    user.approvedBy = req.user._id;
    user.approvedAt = Date.now();

    await user.save();

    // Send rejection email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Account Status Update - StageDeck',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ef4444;">Account Status Update</h2>
            <p>Hi ${user.name},</p>
            <p>Thank you for your interest in StageDeck.</p>
            <p>Unfortunately, we are unable to approve your account at this time.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>If you have any questions, please contact our support team.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'User rejected',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        approvalStatus: user.approvalStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:userId
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users',
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingUsers = await User.countDocuments({ approvalStatus: 'pending', role: 'user' });
    const approvedUsers = await User.countDocuments({ approvalStatus: 'approved', role: 'user' });
    const rejectedUsers = await User.countDocuments({ approvalStatus: 'rejected', role: 'user' });

    res.status(200).json({
      success: true,
      stats: {
        total: totalUsers,
        pending: pendingUsers,
        approved: approvedUsers,
        rejected: rejectedUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update allowed fields
    const { name, phone, department, interests, profileImage, avatar } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (interests) user.interests = interests;
    if (profileImage) user.profileImage = profileImage;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        interests: user.interests,
        profileImage: user.profileImage,
        avatar: user.avatar,
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
