# 🚀 Backend Integration Checklist

Use this checklist to verify all components are properly connected and working.

## Phase 1: Environment Setup

- [ ] Backend `.env` file created with:
  - [ ] `PORT=3000`
  - [ ] `NODE_ENV=development`
  - [ ] `SUPABASE_URL` populated
  - [ ] `SUPABASE_KEY` populated

- [ ] Frontend `.env` file created with:
  - [ ] `EXPO_PUBLIC_API_URL=http://localhost:3000/api`
  - [ ] `EXPO_PUBLIC_SUPABASE_URL` populated
  - [ ] `EXPO_PUBLIC_SUPABASE_KEY` populated

- [ ] Supabase project created at supabase.com
- [ ] Supabase credentials copied correctly

## Phase 2: Backend Setup

- [ ] `cd backend && npm install` completed successfully
- [ ] No dependency installation errors
- [ ] TypeScript configuration exists (tsconfig.json)
- [ ] Backend starts with `npm run dev` without errors
- [ ] Backend listens on `http://localhost:3000`
- [ ] Health check passes: `curl http://localhost:3000/health`

## Phase 3: Frontend Setup

- [ ] `cd AuraFit && npm install` completed successfully
- [ ] No dependency installation errors
- [ ] Supabase package installed: `@supabase/supabase-js`
- [ ] AsyncStorage package installed: `@react-native-async-storage/async-storage`
- [ ] All services exist:
  - [ ] `src/services/api.js`
  - [ ] `src/services/auth.js`
  - [ ] `src/services/index.js`

## Phase 4: AppContext Integration

- [ ] `src/context/AppContext.js` updated with:
  - [ ] `useEffect` hook for initialization
  - [ ] `loadUserData()` function
  - [ ] `addWorkout()` syncs to backend
  - [ ] `logMeal()` syncs to backend
  - [ ] `login()` and `signup()` use auth service
  - [ ] `logout()` clears auth state

- [ ] AppContext exports new functions:
  - [ ] `isLoading` state
  - [ ] `backendAvailable` state
  - [ ] `signup` function
  - [ ] `logout` function

## Phase 5: Authentication Screens

- [ ] LoginScreen updated:
  - [ ] Error message display
  - [ ] Loading spinner during login
  - [ ] Input validation
  - [ ] Error handling for auth failures

- [ ] RegisterScreen updated:
  - [ ] Full name field added
  - [ ] Error message display
  - [ ] Loading spinner during signup
  - [ ] Password validation (min 8 chars)
  - [ ] Password match validation
  - [ ] Terms acceptance required

## Phase 6: API Testing

### Health Check
- [ ] `GET http://localhost:3000/health` returns `{"status":"ok"}`

### Authentication
- [ ] User can register with email/password
- [ ] User receives JWT token after signup
- [ ] Token stored in AsyncStorage
- [ ] User can login with existing credentials
- [ ] Invalid credentials show error message

### Workouts
- [ ] `POST /api/workouts` creates workout successfully
- [ ] Workout data saved in backend database
- [ ] `GET /api/workouts` returns user's workouts
- [ ] Workout updates sync to backend
- [ ] Can delete workouts via API

### Diet
- [ ] `POST /api/diet` creates diet log
- [ ] Diet data saved in backend database
- [ ] `GET /api/diet` returns user's diet logs
- [ ] Can update diet logs
- [ ] Can delete diet logs

### Progress
- [ ] `GET /api/progress` returns progress data
- [ ] `POST /api/progress` creates progress record

## Phase 7: Frontend Data Sync

- [ ] On app startup:
  - [ ] User data loads from backend
  - [ ] Workouts load from backend
  - [ ] Diet logs load from backend

- [ ] On user action:
  - [ ] Adding workout syncs to backend immediately
  - [ ] Logging meal updates stats and syncs
  - [ ] Updates reflected in local state

- [ ] Error handling:
  - [ ] Failed sync shows error message
  - [ ] Data stored locally as fallback
  - [ ] Retry mechanism works

## Phase 8: Fallback & Offline Mode

- [ ] If backend unavailable:
  - [ ] App displays mock data
  - [ ] Local changes stored
  - [ ] Error messages shown to user
  - [ ] `backendAvailable` state is false

- [ ] When backend comes back:
  - [ ] Pending changes attempt to sync
  - [ ] Fresh data fetches from backend

## Phase 9: Security Verification

- [ ] JWT tokens validated on backend
- [ ] Expired tokens rejected with 401 error
- [ ] Only authenticated users access protected endpoints
- [ ] CORS properly configured
- [ ] Rate limiting active (100 req/15min)
- [ ] Passwords never stored in AsyncStorage
- [ ] Sensitive data not logged

## Phase 10: Testing Checklist

### Authentication Flow
- [ ] Signup → Receive token → Auto-login → Navigate to Main
- [ ] Login → Token validated → Load user data
- [ ] Logout → Token cleared → Navigate to Login
- [ ] Invalid credentials → Show error
- [ ] Weak password → Show validation error

### Workout Tracking
- [ ] Add workout → Sync to backend
- [ ] View workouts → List from backend
- [ ] Update set → Change reflected
- [ ] Delete workout → Backend confirmation

### Diet Tracking
- [ ] Log meal → Sync to backend
- [ ] View meals → List from backend
- [ ] Update meal → Backend updated
- [ ] Delete meal → Backend updated

### AI Coach
- [ ] Receives real user data
- [ ] Makes context-aware suggestions
- [ ] Data from backend, not mock data

### Data Persistence
- [ ] Close app → Reopen → Data still there
- [ ] Navigate screens → Data consistent
- [ ] Force sync → Backend updated

## Phase 11: Error Handling

- [ ] Network error shows user message
- [ ] Invalid token redirects to login
- [ ] Server errors logged and handled
- [ ] Validation errors shown to user
- [ ] Timeout errors handled gracefully
- [ ] No crashes or unhandled promises

## Phase 12: Performance

- [ ] API requests under 2 seconds
- [ ] App responds quickly to user input
- [ ] No memory leaks on navigation
- [ ] Images load efficiently
- [ ] Database queries optimized

## Phase 13: Documentation

- [ ] BACKEND_SETUP.md complete and accurate
- [ ] DATA_MODELS.md explains all models
- [ ] QUICKSTART.md easy to follow
- [ ] Code comments explain complex logic
- [ ] Error messages are helpful

## Phase 14: Pre-Production

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] No sensitive data in logs
- [ ] Error logging implemented
- [ ] Analytics events tracked
- [ ] Performance monitored

## Phase 15: Deployment Prep

- [ ] Backend deployment strategy decided
- [ ] Frontend build configured
- [ ] Environment variables for production set
- [ ] Database backups automated
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

## Sign-Off Checklist

- [ ] Frontend developer: _____________________ Date: _______
- [ ] Backend developer: _____________________ Date: _______
- [ ] QA tester: _________________________ Date: _______
- [ ] Project manager: _____________________ Date: _______

---

## Common Issues & Solutions

### Issue: Workouts not syncing
**Solution**: 
- [ ] Check network connectivity
- [ ] Verify JWT token in AsyncStorage
- [ ] Check backend logs for errors
- [ ] Verify API URL in .env

### Issue: Login screen shows "Cannot connect to server"
**Solution**:
- [ ] Start backend: `npm run dev` in backend folder
- [ ] Check Supabase credentials
- [ ] Verify port 3000 is open
- [ ] Check firewall settings

### Issue: Undefined is not an object (evaluating 'useApp')
**Solution**:
- [ ] Verify AppProvider wraps app in navigation
- [ ] Check AppContext.js has useApp export
- [ ] Import useApp from context correctly

### Issue: AsyncStorage keeps returning null
**Solution**:
- [ ] Check AsyncStorage installation
- [ ] Verify token is saved after login
- [ ] Check permissions on device
- [ ] Clear app cache and try again

---

## Next Steps After Checklist

1. ✅ All items checked? → Ready for testing
2. ❌ Some items failed? → Debug and fix those items
3. ⚠️ Some items unsure? → Test and verify

Continue to Phase 16: User Testing & Feedback
