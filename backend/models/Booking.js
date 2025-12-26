import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tickets: {
            type: Number,
            required: true,
            min: 1,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'confirmed',
        },
        paymentId: {
            type: String,
        },
        paymentMethod: {
            type: String,
            enum: ['card', 'upi', 'wallet'],
            default: 'card',
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
bookingSchema.index({ userId: 1, eventId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: 1 });

// Populate event and user details by default
bookingSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'eventId',
        select: 'title description date time location category image price status',
    }).populate({
        path: 'userId',
        select: 'name email',
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
