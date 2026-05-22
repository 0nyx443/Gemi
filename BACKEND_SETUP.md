# AuraFit Backend Integration Guide

## Overview
This guide explains how to connect the AuraFit React Native frontend to the Express.js backend API.

## 🔧 Setup Instructions

### 1. **Backend Setup**

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

#### Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=3000
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_key
   ```

   Replace the Supabase credentials with your actual credentials from the Supabase console.

4. Start the development server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### 2. **Frontend Setup**

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

#### Configuration
1. Navigate to the frontend directory:
   ```bash
   cd AuraFit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
   ```

   - `EXPO_PUBLIC_API_URL`: The backend API base URL. For local development, use `http://localhost:3000/api`
   - Supabase credentials from the Supabase console

4. Start the Expo development server:
   ```bash
   npm start
   ```

   Then:
   - Press `w` for web
   - Press `a` for Android
   - Press `i` for iOS

### 3. **Supabase Setup**

1. Create a Supabase project at https://supabase.com
2. Create an auth table schema if needed
3. Get your credentials:
   - **URL**: Found in Project Settings → API → Project URL
   - **Anon Key**: Found in Project Settings → API → Anon key
   - **Service Key**: Found in Project Settings → API → Service role key

## 📡 API Endpoints

### Workouts
- `GET /api/workouts` - Get all workouts (requires auth)
- `GET /api/workouts/:id` - Get workout by ID (requires auth)
- `POST /api/workouts` - Create workout (requires auth)
- `PUT /api/workouts/:id` - Update workout (requires auth)
- `DELETE /api/workouts/:id` - Delete workout (requires auth)

### Diet Logs
- `GET /api/diet` - Get all diet logs (requires auth)
- `POST /api/diet` - Create diet log (requires auth)
- `PUT /api/diet/:id` - Update diet log (requires auth)
- `DELETE /api/diet/:id` - Delete diet log (requires auth)

### Progress
- `GET /api/progress` - Get progress data (requires auth)
- `POST /api/progress` - Create progress record (requires auth)

### Health
- `GET /health` - Health check (no auth required)

## 🔐 Authentication Flow

1. **User Registration**: User signs up with email and password in RegisterScreen
2. **Supabase Auth**: Credentials are sent to Supabase for authentication
3. **Token Storage**: JWT token is stored in AsyncStorage
4. **API Requests**: Token is attached to all subsequent API requests in the `Authorization` header
5. **Token Validation**: Backend validates token with Supabase before allowing access

## 📂 File Structure

### Frontend
```
src/
├── services/
│   ├── api.js          # API service for backend communication
│   └── auth.js         # Supabase authentication service
├── context/
│   └── AppContext.js   # Updated to use backend APIs
├── screens/
│   ├── LoginScreen.js  # Updated with error handling
│   └── RegisterScreen.js # Updated with error handling
```

### Backend
```
src/
├── routes/             # API route definitions
├── controllers/        # Request handlers
├── services/          # Business logic
├── middleware/        # Auth, validation, error handling
├── config/            # Supabase configuration
└── types/             # TypeScript type definitions
```

## 🚀 Data Sync

### Workouts
- App stores workouts locally in AppContext
- When user adds/updates workout, it's synced to backend
- On app load, workouts are fetched from backend
- Fallback to local mock data if backend is unavailable

### Diet Logs
- Similar sync pattern as workouts
- Data persists in backend database
- Real-time sync when logging meals

## ⚠️ Important Notes

1. **Network Connectivity**: The app works offline with mock data fallback
2. **Authentication**: All API endpoints (except health) require a valid JWT token
3. **CORS**: Backend has CORS enabled for cross-origin requests
4. **Rate Limiting**: API has rate limiting (100 requests per 15 minutes)
5. **Error Handling**: Check AsyncStorage for auth tokens if login fails

## 🔍 Troubleshooting

### Backend won't start
- Check Node.js version (v16+)
- Verify port 3000 is available
- Check `.env` file is correctly configured

### Frontend can't connect to backend
- Verify backend is running on `http://localhost:3000`
- Check network connectivity
- For mobile testing, use your machine's IP instead of `localhost`
- Check firewall settings

### Authentication fails
- Verify Supabase credentials in `.env`
- Check Supabase project is active
- Confirm user email is verified (if required in Supabase settings)

### App shows mock data instead of backend data
- Check backend availability with health endpoint: `curl http://localhost:3000/health`
- Check browser console for API errors
- Verify auth token in AsyncStorage

## 📝 Next Steps

1. Test the complete auth flow (signup/login)
2. Test creating/updating workouts
3. Test creating/updating diet logs
4. Implement offline sync strategy
5. Add error logging and monitoring
6. Deploy backend to production service (Heroku, Render, Railway, etc.)
7. Update frontend `.env` with production backend URL

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs: `npm run dev` output
3. Check frontend console: Expo development server output
4. Verify Supabase configuration and network connectivity
