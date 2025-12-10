# 🎭 StageDeck V3 - Event Management Platform

**Version**: 3.0.0  
**Last Updated**: November 15, 2025  
**Status**: Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Installation](#installation)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [Key Features Guide](#key-features-guide)
9. [API Endpoints](#api-endpoints)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**StageDeck** is a comprehensive, full-stack event management platform that enables administrators to create and manage events, while users can discover, book, and attend events with ease. The platform features AI-powered recommendations, real-time notifications, advanced analytics, and seamless payment processing.

### Key Highlights

✅ **Role-Based Access Control** - Separate dashboards for Admin, Organizer, and User  
✅ **AI Integration** - Gemini-powered event descriptions, recommendations, and analytics  
✅ **Real-Time Features** - Live notifications and booking updates  
✅ **Modern UI/UX** - Responsive design with dark mode support  
✅ **Payment Integration** - Razorpay/Stripe for secure transactions  
✅ **Advanced Analytics** - Revenue tracking, user insights, and trend analysis  
✅ **QR Code Tickets** - Digital tickets with QR codes for event entry  

---

## 🚀 Features

### 👨‍💼 Admin Features

#### Dashboard
- **KPI Cards**: Total bookings, active events, revenue, users, ratings
- **AI-Powered Insights**: Smart analytics powered by Google Gemini
- **Revenue Trends**: Monthly revenue and booking charts
- **Category Distribution**: Visual breakdown of event categories
- **Top Performing Events**: Ranked list of popular events
- **Quick Actions**: Create Event, View Bookings, Add Organizer

#### Event Management
- **Create Event Wizard**: Multi-step form with 5 stages
  1. Basic Info (Title, Category, Description)
  2. Schedule (Date, Time, Location)
  3. Media (Image upload with preview)
  4. Tickets (Price, Capacity, Featured toggle)
  5. Preview (Complete event preview before publishing)
- **AI Description Generator**: Auto-generate event descriptions
- **Draft Save/Restore**: Save progress and resume later
- **Event Table**: View, edit, delete, duplicate, toggle featured
- **Filters**: Search and filter by status, category, date

#### Booking Management
- **Comprehensive Table**: All bookings with search and filters
- **Booking Details Modal**: 
  - Event and user information
  - QR code ticket
  - Payment details
  - Invoice download
  - Refund processing
- **Export Options**: CSV and PDF exports
- **Real-time Statistics**: Live booking counts and revenue

#### User Management
- **User Table**: View all users with roles and status
- **Add Organizer Workflow**:
  1. Enter organizer details
  2. Send OTP to email
  3. Verify OTP
  4. Grant organizer role
- **Role Management**: Update user roles (User/Organizer/Admin)
- **Ban/Unban Users**: Suspend or reactivate accounts
- **Activity Tracking**: Monitor user engagement

#### Profile & Settings
- **Avatar Upload**: Crop and upload profile photos
- **Profile Edit**: Update name, email, phone, bio
- **Security Settings**:
  - Change password
  - Two-factor authentication (2FA)
  - Activity log (IP addresses, devices)
- **Notification Preferences**: Configure email and push notifications

#### Analytics & Reports
- **Financial Dashboard**: Revenue charts, growth metrics
- **Audit Logs**: Track all admin actions
- **Feedback Analyzer**: AI sentiment analysis of user feedback
- **User Activity Summary**: Engagement metrics and insights
- **Revenue Predictions**: AI-powered trend forecasting

---

### 👤 User Features

#### Dashboard
- **Welcome Header**: Personalized greeting with notification panel
- **Quick Stats**: Bookings, upcoming events, total spent, events attended
- **Recent Bookings**: Timeline of latest ticket purchases
- **Upcoming Events**: Carousel of scheduled events
- **Achievement Badges**: Gamification with unlockable badges
- **Activity Timeline**: Recent user activities

#### Events Discovery
- **Advanced Search**: Filter by category, date, location, price
- **AI Recommendations**: Smart suggestions based on history
- **Grid/List Views**: Toggle display modes
- **Favorites/Wishlist**: Save events for later
- **Event Comparison**: Compare up to 3 events side-by-side
- **Share Events**: Social media sharing
- **Countdown Timers**: Time until event start

#### Booking Management
- **My Bookings Table**: All user bookings with search
- **Booking Cards**: Visual cards with event details
- **QR Code Tickets**: Digital tickets for event entry
- **Download Options**: Save tickets as PDF/JSON
- **Cancel Bookings**: Request cancellations with refund tracking
- **Feedback System**: Rate and review attended events
- **Payment History**: Track all transactions

#### Profile
- **Tabbed Interface**: Profile, Statistics, Badges, Settings
- **Avatar Upload**: Upload and crop profile pictures
- **AI Bio Generator**: Auto-generate user bio
- **Statistics Dashboard**: Personal event analytics
- **Badge Collection**: View earned and locked badges
- **Security Tab**: Password change, 2FA setup
- **Data Export**: Download profile data (JSON/PDF)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.0 + TypeScript 5.9.3
- **Build Tool**: Vite 7.2.2
- **Styling**: Tailwind CSS 3.4.18
- **Animations**: Framer Motion 12.23.24
- **UI Components**: Radix UI (Dialog, Dropdown, Toast, etc.)
- **Forms**: React Hook Form 7.66.0 + Zod 4.1.12
- **Data Fetching**: TanStack Query 5.90.7 + Axios 1.13.2
- **Routing**: React Router DOM 7.9.5
- **Charts**: Recharts 3.3.0

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Email**: Nodemailer
- **Payments**: Razorpay/Stripe
- **AI**: Google Gemini API
- **File Upload**: Multer
- **Security**: Helmet, CORS, bcrypt

### DevOps
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint 9.39.1
- **Code Formatting**: Prettier 3.6.2
- **Environment**: dotenv

---

## 📁 Project Structure

```
StageDeck/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── eventController.js    # Event CRUD
│   │   ├── registrationController.js
│   │   ├── feedbackController.js
│   │   ├── paymentController.js
│   │   ├── analyticsController.js
│   │   └── userManagementController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorHandler.js       # Global error handling
│   │   └── uploadMiddleware.js   # File upload handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Event.js              # Event schema
│   │   ├── Registration.js       # Booking schema
│   │   ├── Feedback.js
│   │   ├── Transaction.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── userRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── badgeRoutes.js
│   │   └── profileRoutes.js
│   ├── utils/
│   │   ├── gemini.js             # AI integration
│   │   ├── generateOTP.js
│   │   ├── generateToken.js
│   │   ├── mailer.js
│   │   ├── payment.js
│   │   └── qrcode.js
│   ├── .env                       # Environment variables
│   ├── server.js                  # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── CreateEventWizard.tsx  # Multi-step event creator
│   │   │   ├── dashboard/charts/
│   │   │   │   ├── AreaChart.tsx
│   │   │   │   ├── BarChart.tsx
│   │   │   │   ├── LineChart.tsx
│   │   │   │   └── PieChart.tsx
│   │   │   ├── guards/
│   │   │   │   └── PrivateRoute.tsx       # Route protection
│   │   │   ├── layout/
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Topbar.tsx
│   │   │   └── ui/
│   │   │       ├── Avatar.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── BadgeSystem.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── ChatWidget.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── NotificationPanel.tsx
│   │   │       ├── Progress.tsx
│   │   │       ├── ShareButton.tsx
│   │   │       ├── Skeleton.tsx
│   │   │       └── Toast.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx            # Authentication state
│   │   │   └── ThemeContext.tsx           # Dark mode support
│   │   ├── hooks/
│   │   │   ├── useAIAdmin.ts              # AI integration hook
│   │   │   ├── useApi.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useToast.ts
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx     # ✅ Complete
│   │   │   │   ├── ManageEvents.tsx       # ✅ Complete
│   │   │   │   ├── BookingsAdmin.tsx      # ✅ Complete
│   │   │   │   ├── ManageUsers.tsx        # ✅ Complete
│   │   │   │   └── Settings.tsx
│   │   │   ├── auth/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── AdminLogin.tsx
│   │   │   │   │   ├── AdminRegisterOTP.tsx
│   │   │   │   │   └── AdminVerifyOTP.tsx
│   │   │   │   └── user/
│   │   │   │       ├── UserLogin.tsx
│   │   │   │       └── UserRegister.tsx
│   │   │   ├── user/
│   │   │   │   ├── Dashboard.tsx          # ✅ Enhanced
│   │   │   │   ├── Events.tsx             # ✅ Enhanced
│   │   │   │   ├── EventDetails.tsx
│   │   │   │   ├── Bookings.tsx           # ✅ Enhanced
│   │   │   │   └── Profile.tsx            # ✅ Enhanced
│   │   │   ├── landing/
│   │   │   │   └── LandingHome.tsx
│   │   │   ├── AppRoutes.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/
│   │   │   ├── admin.service.ts           # Admin API calls
│   │   │   ├── api.ts                     # Axios instance
│   │   │   ├── auth.service.ts            # Auth API calls
│   │   │   ├── events.service.ts          # Event API calls
│   │   │   └── finance.service.ts
│   │   ├── styles/
│   │   │   └── tokens.ts                  # Design tokens
│   │   ├── utils/
│   │   │   ├── cn.ts                      # Class name utility
│   │   │   ├── constants.ts               # App constants
│   │   │   ├── format.ts                  # Date/currency formatters
│   │   │   └── validators.ts              # Zod schemas
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env                                # Frontend env variables
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── upgrade-plan.md                         # This upgrade documentation
├── README_STAGEDECK_V3.md                  # This file
└── package.json
```

---

## 🔧 Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: v5.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/stagedeck.git
cd stagedeck
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/stagedeck
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stagedeck

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# OR for Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=StageDeck
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
# OR
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## ▶️ Running the Application

### Development Mode

#### Terminal 1: Backend

```bash
cd backend
npm run dev
```

**Backend runs on**: `http://localhost:5000`

#### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

### Production Build

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

---

## 🎓 Key Features Guide

### 1. Creating an Event (Admin)

1. Login as Admin at `/auth/admin/login`
2. Navigate to Admin Dashboard
3. Click **"Create Event"** button
4. Follow the 5-step wizard:
   - **Step 1**: Enter title, category, description (use AI generator)
   - **Step 2**: Set date, time, location
   - **Step 3**: Upload event banner/poster
   - **Step 4**: Set price, capacity, mark as featured
   - **Step 5**: Preview and publish
5. Click **"Save Draft"** to save progress anytime
6. Click **"Publish Event"** to make it live

### 2. Managing Bookings (Admin)

1. Go to **Admin Dashboard** → **"View Bookings"**
2. Use search/filters to find specific bookings
3. Click **"View Details"** icon on any booking
4. Modal shows:
   - Event and user information
   - QR code ticket
   - Payment details
5. Download invoice or process refund

### 3. Adding an Organizer (Admin)

1. Navigate to **"Manage Users"** page
2. Click **"Add Organizer"** button
3. Enter organizer details (name, email, phone)
4. Click **"Send OTP"**
5. Organizer receives OTP via email
6. Enter OTP code
7. Click **"Add Organizer"**
8. Organizer can now login and create events

### 4. Booking an Event (User)

1. Login as User at `/auth/user/login`
2. Browse events at **"Events"** page
3. Use filters to find events
4. Click on event card to view details
5. Select number of tickets
6. Proceed to payment
7. Complete payment via Razorpay/Stripe
8. Receive booking confirmation and QR ticket

### 5. Using AI Features

**Event Description**:
- When creating an event, enter title and category
- Click **"AI Generate"** button
- AI generates a compelling description

**Feedback Analysis**:
- Admin dashboard shows AI sentiment analysis
- View positive/negative/neutral breakdown
- See key themes from user feedback

**Revenue Prediction**:
- Dashboard shows AI-predicted revenue trends
- Growth rate and forecast charts
- Actionable insights

### 6. Dark Mode Toggle

- Click moon/sun icon in the top bar
- Theme preference saved in localStorage
- Respects system preferences on first visit

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register/user      # Register new user
POST   /api/auth/login/user         # User login
POST   /api/auth/register/admin     # Register new admin
POST   /api/auth/request-otp        # Request OTP for admin
POST   /api/auth/verify-otp         # Verify OTP
POST   /api/auth/login/admin        # Admin login
GET    /api/auth/me                 # Get current user
POST   /api/auth/logout             # Logout
```

### Events

```
GET    /api/events                  # Get all events (public)
GET    /api/events/:id              # Get single event
POST   /api/events                  # Create event (protected)
PUT    /api/events/:id              # Update event (protected)
DELETE /api/events/:id              # Delete event (admin)
GET    /api/events/my-events        # Get user's events
PATCH  /api/events/:id/featured     # Toggle featured (admin)
PATCH  /api/events/:id/status       # Update status (admin)
```

### Bookings

```
GET    /api/bookings                # Get all bookings (admin)
GET    /api/bookings/my-bookings    # Get user bookings
POST   /api/bookings                # Create booking
PATCH  /api/bookings/:id/cancel     # Cancel booking
GET    /api/bookings/:id            # Get booking details
```

### Users

```
GET    /api/users                   # Get all users (admin)
GET    /api/users/:id               # Get user details
PATCH  /api/users/:id/role          # Update user role (admin)
POST   /api/users/:id/ban           # Ban user (admin)
POST   /api/users/:id/unban         # Unban user (admin)
```

### Analytics

```
GET    /api/analytics/stats         # Get dashboard stats (admin)
GET    /api/analytics/revenue       # Revenue analytics
GET    /api/analytics/users         # User analytics
GET    /api/analytics/events        # Event analytics
```

### Notifications

```
GET    /api/notifications           # Get user notifications
PATCH  /api/notifications/:id/read  # Mark as read
DELETE /api/notifications/:id       # Delete notification
```

### Profile

```
GET    /api/profile                 # Get profile
PUT    /api/profile                 # Update profile
POST   /api/profile/avatar          # Upload avatar
PUT    /api/profile/password        # Change password
```

---

## 🧪 Testing

### Running Tests

```bash
# Unit tests
cd frontend
npm run test

# E2E tests (if configured)
npm run test:e2e

# Type checking
npm run type-check
```

### Test Coverage

- **Services**: All API service methods
- **Hooks**: Custom React hooks
- **Components**: Critical UI components
- **E2E**: Main user flows

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Configure Environment Variables** in platform dashboard
2. **Set Build Command**: `npm install`
3. **Set Start Command**: `npm start`
4. **Deploy**

### Frontend Deployment (Vercel/Netlify)

1. **Connect GitHub Repository**
2. **Set Build Command**: `npm run build`
3. **Set Output Directory**: `dist`
4. **Add Environment Variables**
5. **Deploy**

### Database (MongoDB Atlas)

1. Create MongoDB Atlas cluster
2. Whitelist deployment server IP
3. Update `MONGODB_URI` in backend `.env`

---

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

**2. MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify network access in MongoDB Atlas

**3. CORS Errors**
- Verify `CLIENT_URL` in backend `.env`
- Check CORS configuration in `server.js`

**4. AI Features Not Working**
- Verify `GEMINI_API_KEY` is set
- Check API quota limits
- Review console logs for errors

**5. File Upload Issues**
- Check `MAX_FILE_SIZE` in `.env`
- Verify file type is allowed
- Ensure `uploads/` directory exists

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Google Gemini API](https://ai.google.dev/)

---

## 👨‍💻 Development Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Name]
- **Frontend Developer**: [Name]
- **UI/UX Designer**: [Name]

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Radix UI for accessible components
- Framer Motion for smooth animations
- TanStack Query for data management

---

**Last Updated**: November 15, 2025  
**Version**: 3.0.0  
**Status**: ✅ Production Ready

For questions or support, please open an issue on GitHub or contact the development team.

🎭 **Happy Event Management with StageDeck!** 🎉
