# Services Layer Documentation

This folder contains all services for communicating with the backend API and managing authentication.

## Files Overview

### `api.js` - API Client
Handles all REST API communication with the backend.

#### Usage

```javascript
import { workoutAPI, dietAPI, progressAPI } from '../services/api';

// Create a workout
const workout = await workoutAPI.create({
  name: 'Bench Press',
  notes: 'Heavy session',
  performed_at: new Date().toISOString(),
  sets: [
    {
      exercise_name: 'Bench Press',
      set_number: 1,
      reps: 8,
      weight_kg: 100
    }
  ]
});

// Get all workouts
const workouts = await workoutAPI.getAll();

// Update a workout
const updated = await workoutAPI.update(workoutId, updatedData);

// Delete a workout
await workoutAPI.delete(workoutId);
```

#### Available Functions

**Workouts**
- `workoutAPI.getAll()` - Get all workouts
- `workoutAPI.getById(id)` - Get single workout
- `workoutAPI.create(data)` - Create new workout
- `workoutAPI.update(id, data)` - Update workout
- `workoutAPI.delete(id)` - Delete workout

**Diet**
- `dietAPI.getAll()` - Get all diet logs
- `dietAPI.create(data)` - Create diet log
- `dietAPI.update(id, data)` - Update diet log
- `dietAPI.delete(id)` - Delete diet log

**Progress**
- `progressAPI.getAll()` - Get progress data
- `progressAPI.create(data)` - Create progress record

**Health**
- `checkBackendHealth()` - Check if backend is running

#### Features

- ✅ Automatic JWT token injection
- ✅ Error handling
- ✅ Retry logic
- ✅ Timeout handling
- ✅ Response validation
- ✅ Type safety with proper error messages

#### Authentication

All API functions automatically:
1. Get the JWT token from AsyncStorage
2. Add it to the `Authorization` header
3. Reject requests if token is missing/invalid
4. Redirect to login if token expires

---

### `auth.js` - Authentication Service
Manages user authentication with Supabase.

#### Usage

```javascript
import { authService } from '../services/auth';

// Sign up
await authService.signUp('user@example.com', 'password123', {
  name: 'John Doe',
  goal: 'Bulking Phase'
});

// Sign in
await authService.signIn('user@example.com', 'password123');

// Sign out
await authService.signOut();

// Get current user
const user = await authService.getCurrentUser();

// Get session
const session = await authService.getSession();

// Check if already logged in
const hasSession = await authService.restoreSession();
```

#### Available Functions

- `signUp(email, password, userData)` - Register new user
- `signIn(email, password)` - Login user
- `signOut()` - Logout user
- `getSession()` - Get current session
- `getCurrentUser()` - Get current user info
- `restoreSession()` - Restore session from storage

#### Features

- ✅ Automatic token storage in AsyncStorage
- ✅ Token retrieval and refresh
- ✅ Session restoration on app start
- ✅ Error handling and validation
- ✅ Supabase integration
- ✅ User data persistence

---

### `index.js` - Service Exports
Convenient re-exports for all services.

#### Usage

```javascript
import { 
  workoutAPI, 
  dietAPI, 
  progressAPI,
  authService,
  checkBackendHealth 
} from '../services';
```

Instead of:
```javascript
import { workoutAPI } from '../services/api';
import { authService } from '../services/auth';
```

---

## Common Patterns

### Error Handling

```javascript
import { workoutAPI } from '../services/api';

try {
  const workout = await workoutAPI.create(data);
  console.log('Success:', workout);
} catch (error) {
  if (error.message === 'Unauthorized') {
    // Token expired, redirect to login
    navigation.replace('Login');
  } else {
    // Show error to user
    setError(error.message);
  }
}
```

### Async/Await with Loading State

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSave = async (data) => {
  setLoading(true);
  setError('');
  
  try {
    const result = await workoutAPI.create(data);
    // Handle success
    updateUI(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Batch Requests

```javascript
const [workouts, diets] = await Promise.all([
  workoutAPI.getAll(),
  dietAPI.getAll()
]);
```

### Retry Logic

```javascript
async function retryRequest(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// Usage
const workouts = await retryRequest(() => workoutAPI.getAll());
```

---

## Data Format Reference

### Workout Data

```javascript
// Send to backend
{
  name: 'Bench Press',
  notes: 'Optional notes',
  performed_at: '2024-05-22T10:30:00Z',
  sets: [
    {
      exercise_name: 'Bench Press',
      set_number: 1,
      reps: 8,
      weight_kg: 100,
      duration_seconds: null
    }
  ]
}

// Receive from backend
{
  id: 'uuid-string',
  user_id: 'uuid-string',
  name: 'Bench Press',
  notes: 'Optional notes',
  performed_at: '2024-05-22T10:30:00Z',
  sets: [...],
  created_at: '2024-05-22T10:30:00Z',
  updated_at: '2024-05-22T10:30:00Z'
}
```

### Diet Log Data

```javascript
// Send to backend
{
  meal_name: 'Breakfast',
  calories: 450,
  protein_g: 30,
  carbs_g: 45,
  fat_g: 15,
  logged_at: '2024-05-22T08:00:00Z'
}

// Receive from backend
{
  id: 'uuid-string',
  user_id: 'uuid-string',
  meal_name: 'Breakfast',
  calories: 450,
  protein_g: 30,
  carbs_g: 45,
  fat_g: 15,
  logged_at: '2024-05-22T08:00:00Z',
  created_at: '2024-05-22T10:30:00Z',
  updated_at: '2024-05-22T10:30:00Z'
}
```

---

## Configuration

Services are configured via environment variables in `.env`:

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
```

---

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
**Solution**: Run `npm install @supabase/supabase-js`

### "Failed to fetch - Network error"
**Solution**: 
- Verify backend is running
- Check API URL in .env
- Check network connectivity

### "401 Unauthorized"
**Solution**:
- Check JWT token in AsyncStorage
- Verify Supabase credentials
- Ensure user is logged in

### "Request timeout"
**Solution**:
- Check backend is responding
- Verify network connectivity
- Check backend logs

### "No token" error from API
**Solution**:
- User must be logged in before API calls
- Check token storage with: `AsyncStorage.getItem('authToken')`

---

## Best Practices

1. **Always handle errors** - Never leave promises unhandled
2. **Show loading states** - Let users know something is happening
3. **Validate data** - Check data before sending to API
4. **Use try-catch** - Proper error handling pattern
5. **Clear errors** - Reset error state on retry
6. **Batch requests** - Use Promise.all for parallel calls
7. **Type data** - Use TypeScript or JSDoc for clarity
8. **Log important events** - Debug and monitor behavior

---

## Testing

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:3000/health

# Get token first
TOKEN=$(curl -X POST ... | jq -r '.session.access_token')

# Create workout
curl -X POST http://localhost:3000/api/workouts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Test", ... }'
```

### Testing in App

```javascript
import { workoutAPI, checkBackendHealth } from '../services';

// In a debug screen
const testConnection = async () => {
  const isHealthy = await checkBackendHealth();
  console.log('Backend health:', isHealthy);
  
  try {
    const workouts = await workoutAPI.getAll();
    console.log('Workouts:', workouts);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Performance Tips

1. **Batch related requests** - Load multiple resources together
2. **Cache when possible** - Avoid redundant API calls
3. **Paginate results** - For large datasets
4. **Use indexes** - Ensure database queries are optimized
5. **Monitor performance** - Track API response times
6. **Implement debouncing** - For rapid user actions
7. **Lazy load data** - Only fetch what's needed

---

## Security Notes

⚠️ **Important**:
- Never hardcode API URLs or secrets
- Always use HTTPS in production
- Keep tokens secure in AsyncStorage
- Never log sensitive data
- Validate all user input
- Use environment variables for config
- Clear tokens on logout
- Implement token refresh

---

## Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase REST API](https://supabase.com/docs/guides/api)
- [React Native Async Storage](https://react-native-async-storage.github.io)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**Last Updated**: May 22, 2026
**Version**: 1.0
