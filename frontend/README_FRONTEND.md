# 🎭 StageDeck Frontend

A modern, production-ready React + TypeScript frontend for the StageDeck Event Management Platform.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Beautiful UI**: Radix UI primitives with shadcn/ui styling
- **Authentication**: JWT-based auth with role-based access (User/Admin)
- **Admin OTP Flow**: Secure admin registration with OTP verification
- **Responsive Design**: Mobile-first, fully responsive layouts
- **Animations**: Smooth animations with Framer Motion
- **State Management**: React Context + TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Data visualization with Recharts

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Admin OTP Email Configuration
# CRITICAL: Change this to your admin notification email
VITE_ADMIN_CONFIRM_EMAIL=admin-confirm@stagedeck.test

# Optional configurations
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_MAP_KEY=your_map_api_key_here
```

### ⚠️ IMPORTANT: Admin OTP Configuration

The admin registration flow uses OTP verification for security. The OTP is sent to the email specified in `VITE_ADMIN_CONFIRM_EMAIL`.

**To change the admin confirmation email:**

1. Open `.env` file
2. Update `VITE_ADMIN_CONFIRM_EMAIL` to your desired email
3. Ensure your backend is configured to send emails to this address
4. Restart the development server

Example:
```env
VITE_ADMIN_CONFIRM_EMAIL=admin@yourcompany.com
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      
│   │   ├── ui/          # Reusable UI components
│   │   ├── layout/      # Layout components
│   │   ├── event/       # Event-specific components
│   │   └── dashboard/   # Dashboard components
│   ├── pages/           
│   │   ├── landing/     # Public landing pages
│   │   ├── auth/        # Authentication pages
│   │   ├── user/        # User dashboard pages
│   │   └── admin/       # Admin dashboard pages
│   ├── context/         # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── styles/          # Global styles and tokens
│   ├── utils/           # Utility functions
│   └── main.tsx         # Application entry point
├── public/              # Static assets
└── package.json
```

## 🔐 Authentication Flows

### User Registration/Login
1. Standard email/password registration
2. Password requirements: 12+ chars, uppercase, lowercase, number, special char
3. JWT token stored in localStorage
4. Auto-redirect to user dashboard

### Admin Registration (OTP Flow)
1. Admin fills registration form
2. OTP sent to `VITE_ADMIN_CONFIRM_EMAIL`
3. Admin enters 6-digit OTP
4. Account created upon verification
5. Redirect to admin login

### Admin Login
1. Email/password authentication
2. Role verification (must be admin)
3. JWT token with admin privileges
4. Access to admin dashboard

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page
- `/auth/user/login` - User login
- `/auth/user/register` - User registration
- `/auth/admin/login` - Admin login
- `/auth/admin/register` - Admin registration (OTP)
- `/auth/admin/verify-otp` - OTP verification

### Protected User Routes
- `/user/dashboard` - User dashboard
- `/user/events` - Browse events
- `/user/events/:id` - Event details
- `/user/bookings` - My bookings
- `/user/profile` - User profile

### Protected Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/events` - Manage events (CRUD)
- `/admin/users` - Manage users
- `/admin/bookings` - View all bookings
- `/admin/settings` - Admin settings

## 🎨 Design System

### Colors
- **Primary**: Purple (#a855f7)
- **Secondary**: Pink (#ec4899)
- **Pastel Accents**: Soft purple, pink, blue, green, yellow

### Components
- Rounded corners (xl, 2xl)
- Soft shadows
- Gradient accents
- Responsive grid layouts
- Mobile-optimized navigation

## 🔌 API Integration

### Base Configuration
The frontend expects the backend API at `http://localhost:5000` by default.

To change the API URL:
1. Update `VITE_API_BASE_URL` in `.env`
2. Restart the development server

### API Endpoints Used

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User/Admin login
- `POST /api/auth/admin/request-otp` - Request admin OTP
- `POST /api/auth/admin/verify-otp` - Verify admin OTP
- `GET /api/auth/me` - Get current user

**Events:**
- `GET /api/events` - List events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

**Bookings:**
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - User bookings
- `GET /api/bookings` - All bookings (admin)

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server on port 5173

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Environment Variables for Production
Ensure all `VITE_*` environment variables are set during build time:

```bash
VITE_API_BASE_URL=https://api.stagedeck.com \
VITE_ADMIN_CONFIRM_EMAIL=admin@stagedeck.com \
npm run build
```

### Deployment Platforms
- **Netlify**: Drop the `dist` folder or connect GitHub
- **Vercel**: Import project and set env variables
- **AWS S3 + CloudFront**: Upload `dist` contents
- **Nginx**: Serve `dist` folder with proper routing

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Failed**
- Check if backend is running on port 5000
- Verify `VITE_API_BASE_URL` in `.env`
- Check CORS configuration in backend

**2. Admin OTP Not Received**
- Verify `VITE_ADMIN_CONFIRM_EMAIL` is correct
- Check backend email configuration
- Look in spam folder
- Verify SMTP settings in backend `.env`

**3. Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check TypeScript errors: `npm run type-check`

**4. Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check PostCSS configuration
- Verify `index.css` imports Tailwind directives

## 🔄 Backend Adaptation

If your backend uses different endpoints, update the following files:

1. **Authentication**: `src/services/auth.service.ts`
   - Modify endpoint URLs
   - Adjust request/response formats

2. **Events**: `src/services/events.service.ts`
   - Update event endpoints
   - Modify data structures

3. **API Base**: `src/services/api.ts`
   - Change interceptor logic if needed
   - Adjust error handling

## 📚 Key Dependencies

- **React 19.2**: UI library
- **TypeScript 5.2**: Type safety
- **Vite 7.2**: Build tool
- **Tailwind CSS 3.x**: Utility-first CSS
- **Radix UI**: Accessible UI primitives
- **Framer Motion**: Animations
- **React Router 6**: Routing
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Axios**: HTTP client
- **Recharts**: Charts
- **Lucide React**: Icons

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend README for API details
3. Open an issue on GitHub
4. Contact the development team

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
