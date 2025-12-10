import Event from '../models/Event.js';
import { generateEventDescription, generateEventRecommendations } from '../utils/gemini.js';

const parseNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const parseBoolean = (value, defaultValue = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return defaultValue;
};

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;

  try {
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean);
    }
  } catch (error) {
    // fall back to comma separated parsing
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  return [];
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      venue,
      category,
      image,
      attendees,
      status,
      isFeatured,
      price,
      eventType,
      maxAttendees,
      tags,
      rules,
      contactEmail,
      contactPhone,
    } = req.body;

    const uploadedImageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : image;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      venue: venue || location,
      category,
      image: uploadedImageUrl,
      price: parseNumber(price),
      eventType: eventType || 'free',
      maxAttendees: parseNumber(maxAttendees),
      attendees: parseNumber(attendees),
      status: status || 'Scheduled',
      isFeatured: parseBoolean(isFeatured),
      tags: parseTags(tags),
      rules,
      contactEmail,
      contactPhone,
      creator: req.user._id,
      createdBy: req.user.email,
      createdByName: req.user.name,
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const { category, status, search, featured, startDate, endDate } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (featured) {
      query.isFeatured = featured === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const events = await Event.find(query).sort({ createdAt: -1 }).populate('creator', 'name email');

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (event.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    const updates = { ...req.body };

    if (req.file) {
      updates.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (updates.image === '' || updates.image === undefined) {
      delete updates.image;
    }

    if (updates.price !== undefined) {
      updates.price = parseNumber(updates.price, event.price);
    }

    if (updates.maxAttendees !== undefined) {
      updates.maxAttendees = parseNumber(updates.maxAttendees, event.maxAttendees);
    }

    if (updates.attendees !== undefined) {
      updates.attendees = parseNumber(updates.attendees, event.attendees);
    }

    if (updates.isFeatured !== undefined) {
      updates.isFeatured = parseBoolean(updates.isFeatured, event.isFeatured);
    }

    if (updates.tags !== undefined) {
      updates.tags = parseTags(updates.tags);
    }

    if (!updates.venue && updates.location) {
      updates.venue = updates.location;
    }

    event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (event.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's events
// @route   GET /api/events/my-events
// @access  Private
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle featured status (Admin only)
// @route   PATCH /api/events/:id/featured
// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    event.isFeatured = !event.isFeatured;
    await event.save();

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update event status (Admin only)
// @route   PATCH /api/events/:id/status
// @access  Private/Admin
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    event.status = status;
    await event.save();

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Generate event description using AI
// @route   POST /api/events/generate-description
// @access  Private
export const generateDescription = async (req, res) => {
  try {
    const { keywords } = req.body;
    
    if (!keywords) {
      return res.status(400).json({
        success: false,
        message: 'Keywords are required',
      });
    }
    
    const description = await generateEventDescription(keywords);
    
    res.json({
      success: true,
      description,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate description',
      error: error.message,
    });
  }
};

// @desc    Clone an event
// @route   POST /api/events/:id/clone
// @access  Private
export const cloneEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    // Create a copy with new title
    const clonedEvent = await Event.create({
      title: `${event.title} (Copy)`,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      venue: event.venue,
      category: event.category,
      image: event.image,
      price: event.price,
      eventType: event.eventType,
      maxAttendees: event.maxAttendees,
      status: 'Draft',
      tags: event.tags,
      rules: event.rules,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      creator: req.user._id,
      createdBy: req.user.email,
      createdByName: req.user.name,
    });
    
    res.status(201).json({
      success: true,
      message: 'Event cloned successfully',
      event: clonedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get event recommendations for user
// @route   GET /api/events/recommendations
// @access  Private
export const getRecommendations = async (req, res) => {
  try {
    const user = await req.user.populate('registeredEvents', 'category tags');
    
    // Get user's interests and history
    const userInterests = user.interests || [];
    const userHistory = user.registeredEvents.map(e => e.category);
    
    // Get available upcoming events
    const availableEvents = await Event.find({
      date: { $gte: new Date() },
      status: 'Scheduled',
    }).limit(20);
    
    if (availableEvents.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No events available for recommendations',
      });
    }
    
    // Get AI recommendations
    const recommendedIndices = await generateEventRecommendations(
      userInterests,
      userHistory,
      availableEvents
    );
    
    const recommendations = recommendedIndices
      .map(i => availableEvents[i])
      .filter(e => e !== undefined);
    
    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: error.message,
    });
  }
};
