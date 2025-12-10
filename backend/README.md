# 🎭 StageDeck Backend API

Complete backend API for StageDeck Event Management Platform with JWT authentication, OTP password reset, and event management.

## 🚀 Features

- ✅ JWT-based authentication
- ✅ OTP password reset via email
- ✅ Role-based access control (User/Admin)
- ✅ Complete event CRUD operations
- ✅ MongoDB database with Mongoose
- ✅ Secure password hashing with bcrypt
- ✅ Email service with nodemailer
- ✅ Input validation
- ✅ Error handling middleware
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ Request logging with Morgan

## 📦 Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/stagedeck
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=StageDeck <noreply@stagedeck.com>
CLIENT_URL=http://localhost:5173
OTP_EXPIRE_MINUTES=5
```

### Gmail Setup for OTP

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS`

## 🏃 Running the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Forgot Password (Send OTP)
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "newpassword123"
}
```

### Event Routes (`/api/events`)

#### Get All Events (Public)
```http
GET /api/events
GET /api/events?category=Technology
GET /api/events?status=Scheduled
GET /api/events?search=conference
GET /api/events?featured=true
```

#### Get Single Event
```http
GET /api/events/:id
```

#### Create Event (Protected)
```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tech Conference 2025",
  "description": "Amazing tech event",
  "date": "2025-12-01",
  "time": "09:00 AM",
  "location": "San Francisco, CA",
  "category": "Technology",
  "image": "https://example.com/image.jpg",
  "attendees": 0,
  "status": "Scheduled"
}
```

#### Update Event (Protected - Owner or Admin)
```http
PUT /api/events/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Event (Protected - Owner or Admin)
```http
DELETE /api/events/:id
Authorization: Bearer {token}
```

#### Get My Events (Protected)
```http
GET /api/events/my-events
Authorization: Bearer {token}
```

#### Toggle Featured (Admin Only)
```http
PATCH /api/events/:id/featured
Authorization: Bearer {token}
```

#### Update Event Status (Admin Only)
```http
PATCH /api/events/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Completed"
}
```

## 🔐 Admin Access

To create an admin account, register with email: `admin@stagedeck.com`

This email is automatically assigned the admin role.

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  otp: String (hashed),
  otpExpire: Date,
  createdAt: Date
}
```

### Event Model
```javascript
{
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  category: String,
  image: String,
  attendees: Number,
  status: String (Scheduled/Draft/Cancelled/Completed),
  isFeatured: Boolean,
  creator: ObjectId (ref: User),
  createdBy: String,
  createdByName: String,
  createdAt: Date
}
```

## 🧪 Testing with Postman

1. Import the API endpoints into Postman
2. Create an environment with:
   - `base_url`: `http://localhost:5000`
   - `token`: (will be set after login)
3. Test authentication flow:
   - Register → Login → Get token
   - Use token in Authorization header for protected routes
4. Test event CRUD operations
5. Test OTP flow:
   - Forgot password → Check email → Verify OTP → Reset password

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- OTP hashing before storage
- OTP expiration (5 minutes default)
- Helmet for HTTP security headers
- CORS configuration
- Input validation
- Error handling middleware
- Protected routes with role-based access

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth logic
│   └── eventController.js    # Event logic
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   └── errorHandler.js       # Error handling
├── models/
│   ├── User.js               # User schema
│   └── Event.js              # Event schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   └── eventRoutes.js        # Event endpoints
├── utils/
│   ├── generateToken.js      # JWT generation
│   ├── generateOTP.js        # OTP generation
│   └── sendEmail.js          # Email service
├── .env.example              # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js                 # Entry point
```

## 🐛 Error Handling

All errors return in format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🔄 Integration with Frontend

Update your React frontend to use this API:

```javascript
// Example: Login request
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

const { token, user } = response.data;
localStorage.setItem('token', token);

// Example: Protected request
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const events = await axios.get('http://localhost:5000/api/events/my-events', config);
```

## 📊 Database Setup

### Local MongoDB
```bash
# Install MongoDB
# Start MongoDB service
mongod

# Database will be created automatically
```

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

## 🚀 Deployment

### Heroku
```bash
heroku create stagedeck-api
heroku config:set MONGO_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Render/Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy

## 📝 Notes

- OTP expires after 5 minutes (configurable)
- JWT tokens expire after 7 days (configurable)
- Admin email: `admin@stagedeck.com`
- All passwords must be at least 6 characters
- Event images use URLs (no file upload yet)

## 🤝 Support

For issues or questions, check the code comments or create an issue.

---

**Built with Node.js, Express, MongoDB, and ❤️**
