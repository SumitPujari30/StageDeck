# ⚡ StageDeck Backend - Quick Start

## 🚀 Get Running in 3 Minutes

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
```

**Minimum required settings:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stagedeck
JWT_SECRET=mysecretkey123
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

### Step 3: Start Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

✅ Server running at: **http://localhost:5000**

---

## 📧 Gmail Setup (for OTP emails)

1. Go to your Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification → Enable it
3. Security → App passwords → Generate new
4. Select "Mail" and "Other (Custom name)"
5. Copy the 16-character password
6. Paste in `.env` as `EMAIL_PASS`

---

## 🧪 Test the API

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Copy the `token` from response.

### 4. Create Event (Protected)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title":"My Event",
    "description":"Great event",
    "date":"2025-12-01",
    "time":"10:00 AM",
    "location":"New York",
    "category":"Technology"
  }'
```

### 5. Get All Events
```bash
curl http://localhost:5000/api/events
```

---

## 🔐 Admin Access

Register with email: `admin@stagedeck.com` to get admin role automatically.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@stagedeck.com","password":"admin123"}'
```

---

## 🗄️ MongoDB Options

### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB
mongod

# Database 'stagedeck' will be created automatically
```

### Option 2: MongoDB Atlas (Cloud - Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Get connection string
5. Update `MONGO_URI` in `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stagedeck
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Protected | Get current user |
| POST | `/api/auth/forgot-password` | Public | Send OTP |
| POST | `/api/auth/verify-otp` | Public | Verify OTP |
| POST | `/api/auth/reset-password` | Public | Reset password |
| GET | `/api/events` | Public | Get all events |
| POST | `/api/events` | Protected | Create event |
| GET | `/api/events/:id` | Public | Get single event |
| PUT | `/api/events/:id` | Protected | Update event |
| DELETE | `/api/events/:id` | Protected | Delete event |
| GET | `/api/events/my-events` | Protected | Get user's events |
| PATCH | `/api/events/:id/featured` | Admin | Toggle featured |
| PATCH | `/api/events/:id/status` | Admin | Update status |

---

## 🔗 Connect to Frontend

Update your React frontend API base URL:

```javascript
// In your frontend
const API_URL = 'http://localhost:5000/api';

// Example: Login
const response = await axios.post(`${API_URL}/auth/login`, {
  email: 'user@example.com',
  password: 'password123'
});

// Store token
localStorage.setItem('token', response.data.token);

// Use token for protected requests
const config = {
  headers: { Authorization: `Bearer ${token}` }
};
await axios.get(`${API_URL}/events/my-events`, config);
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env`
- For Atlas: whitelist your IP address

### Email Not Sending
- Verify Gmail credentials in `.env`
- Make sure 2FA is enabled
- Use App Password, not regular password
- Check spam folder

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill` (Mac/Linux)

### JWT Error
- Make sure `JWT_SECRET` is set in `.env`
- Token format: `Bearer <token>`

---

## 📝 Next Steps

1. ✅ Test all auth endpoints
2. ✅ Test event CRUD operations
3. ✅ Test OTP flow with real email
4. ✅ Connect frontend to backend
5. ✅ Test admin features
6. ✅ Deploy to production

---

**Ready to build amazing events! 🎭**
