# 🚀 AuraFit Backend Connection - Quick Start

## What Was Connected?

Your AuraFit React Native app is now fully connected to the backend API! Here's what's been set up:

### ✅ Frontend Changes
- **API Service Layer** (`src/services/api.js`) - Handles all backend communication
- **Auth Service** (`src/services/auth.js`) - Manages Supabase authentication
- **Updated AppContext** - Now fetches data from backend and syncs workouts/meals
- **Enhanced Login Screen** - Better error handling and loading states
- **Enhanced Register Screen** - Proper auth integration with backend
- **Environment Configuration** - `.env` file for backend URL and Supabase credentials

### ✅ Backend Ready
Your backend is already configured and waiting for connection:
- Express.js API with TypeScript
- Supabase JWT authentication
- Workout management endpoints
- Diet tracking endpoints
- Progress tracking endpoints

## 📋 To Get Started

### Step 1: Configure Backend
```bash
cd backend
npm install
# Edit .env with your Supabase credentials
npm run dev
```

### Step 2: Configure Frontend
```bash
cd AuraFit
npm install
# Edit .env with your Supabase credentials and backend URL
npm start
```

### Step 3: Test the Connection
1. Open the app (web, iOS, or Android)
2. Click "Register Now" on Login Screen
3. Create an account with test data
4. Check browser console for any API errors
5. Start logging workouts and meals

## 🔧 Configuration Files

### Backend `.env`
```
PORT=3000
NODE_ENV=development
SUPABASE_URL=your_url
SUPABASE_KEY=your_service_key
```

### Frontend `.env`
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_KEY=your_anon_key
```

## 📊 Data Sync Overview

### How It Works:
1. **User authenticates** → Token saved to AsyncStorage
2. **User logs workout** → Sent to backend API with JWT token
3. **Backend validates** → Checks JWT with Supabase
4. **Data saved** → Stored in backend database
5. **State updated** → Local AppContext reflects new data

### Fallback Mode:
- If backend is unreachable, app uses mock data
- Changes are stored locally
- Syncs when backend comes back online

## 🎯 Key Features Implemented

### Authentication
- ✅ Sign up with email/password
- ✅ Sign in with Supabase
- ✅ Automatic token management
- ✅ Error handling for auth failures

### Workouts
- ✅ Create workouts via API
- ✅ Update sets in real-time
- ✅ Sync to backend automatically
- ✅ Fetch on app startup

### Diet Tracking
- ✅ Log meals to backend
- ✅ Calculate macros
- ✅ Track daily progress
- ✅ Persist in database

### AI Coach
- ✅ Accesses real user data
- ✅ Provides personalized coaching
- ✅ Context-aware suggestions

## 📚 Documentation

- **BACKEND_SETUP.md** - Complete setup instructions
- **DATA_MODELS.md** - API data structures and mapping
- **This file** - Quick reference guide

## 🆘 Troubleshooting

### Backend won't start?
```bash
# Check Node version
node --version  # Should be v16+

# Check port 3000 is free
# On Windows: netstat -ano | findstr :3000
# On Mac/Linux: lsof -i :3000

# Verify .env file exists and has credentials
```

### Frontend can't connect?
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check `.env` in frontend has correct URLs
3. Look for errors in Expo console
4. For mobile: Use your machine's IP instead of localhost

### Auth keeps failing?
1. Check Supabase credentials in both `.env` files
2. Verify user email in Supabase console
3. Check AsyncStorage has token: Add debug log in auth.js

## 🎨 Next Steps

1. **Test everything** - Try signup, login, add workout, log meal
2. **Check data** - Verify data appears in Supabase dashboard
3. **Customize** - Add more fields to workouts/meals as needed
4. **Deploy backend** - Use Heroku, Render, Railway, or Fly.io
5. **Build app** - Use Expo Prebuild for native apps
6. **Test on devices** - Install on iOS/Android devices
7. **Monitor** - Set up error logging and analytics

## 📞 Need Help?

### Common Issues:

**"Cannot find module '@supabase/supabase-js'"**
→ Run `npm install` in AuraFit folder

**"Backend health check failed"**
→ Make sure `npm run dev` is running in backend folder

**"Invalid JWT token"**
→ Check Supabase credentials in `.env` files

**"Workouts not syncing"**
→ Check network tab in browser dev tools for API errors

## 🎉 You're Ready!

Your fitness app is now connected to a real backend! Users can:
- Create accounts securely
- Log workouts and meals
- Get AI coaching based on real data
- Track progress over time
- All data persists in the database

Start testing and let me know if you hit any issues!
