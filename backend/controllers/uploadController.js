/**
 * Upload Controller
 * Handles file uploads for events and other resources
 */

/**
 * @desc    Upload event image
 * @route   POST /api/upload/event-image
 * @access  Private/Admin
 */
export const uploadEventImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided',
            });
        }

        // Generate the public URL for the uploaded image
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            url: imageUrl,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message,
        });
    }
};
