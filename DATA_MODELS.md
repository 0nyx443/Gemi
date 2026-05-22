# AuraFit API Data Models

## Overview
This document describes the data models used in the AuraFit backend API and how to map frontend data to backend data structures.

## Workout Model

### Frontend Format (AppContext)
```javascript
{
  id: 1,
  name: 'Back Squat',
  muscle: 'Lower Body',
  sets: [
    { set: 1, weight: 225, reps: 10, rpe: null },
    { set: 2, weight: 225, reps: 9, rpe: null },
    { set: 3, weight: 225, reps: 8, rpe: null },
  ],
  completed: true,
  date: '2024-05-22T10:30:00.000Z',
}
```

### Backend Format (API)
```json
{
  "name": "Back Squat",
  "notes": "Optional notes about the workout",
  "performed_at": "2024-05-22T10:30:00.000Z",
  "sets": [
    {
      "exercise_name": "Back Squat",
      "set_number": 1,
      "reps": 10,
      "weight_kg": 225,
      "duration_seconds": null
    },
    {
      "exercise_name": "Back Squat",
      "set_number": 2,
      "reps": 9,
      "weight_kg": 225,
      "duration_seconds": null
    },
    {
      "exercise_name": "Back Squat",
      "set_number": 3,
      "reps": 8,
      "weight_kg": 225,
      "duration_seconds": null
    }
  ]
}
```

### Mapping Function
```javascript
// Frontend to Backend
function mapWorkoutToBackend(frontendWorkout) {
  return {
    name: frontendWorkout.name,
    notes: frontendWorkout.notes || '',
    performed_at: frontendWorkout.date || new Date().toISOString(),
    sets: frontendWorkout.sets.map(s => ({
      exercise_name: frontendWorkout.name,
      set_number: s.set,
      reps: s.reps,
      weight_kg: s.weight,
      duration_seconds: s.duration || null,
    }))
  };
}

// Backend to Frontend
function mapWorkoutToFrontend(backendWorkout) {
  // Group sets by exercise
  const setsByExercise = {};
  backendWorkout.sets.forEach(set => {
    if (!setsByExercise[set.exercise_name]) {
      setsByExercise[set.exercise_name] = [];
    }
    setsByExercise[set.exercise_name].push({
      set: set.set_number,
      weight: set.weight_kg,
      reps: set.reps,
      rpe: null,
    });
  });

  return {
    id: backendWorkout.id,
    name: backendWorkout.name,
    muscle: 'Unknown', // Need to infer or add to backend
    sets: setsByExercise[backendWorkout.name] || [],
    completed: true,
    date: backendWorkout.performed_at,
  };
}
```

## Diet Log Model

### Frontend Format (AppContext)
```javascript
{
  id: 1,
  name: 'Breakfast',
  description: 'Oatmeal, Black Coffee',
  calories: 320,
  logged: true,
}
```

### Backend Format (API)
```json
{
  "meal_name": "Breakfast",
  "calories": 320,
  "protein_g": null,
  "carbs_g": null,
  "fat_g": null,
  "logged_at": "2024-05-22T08:00:00.000Z"
}
```

### Mapping Function
```javascript
// Frontend to Backend
function mapMealToBackend(frontendMeal) {
  return {
    meal_name: frontendMeal.description || frontendMeal.name,
    calories: frontendMeal.calories || 0,
    protein_g: frontendMeal.protein || null,
    carbs_g: frontendMeal.carbs || null,
    fat_g: frontendMeal.fat || null,
    logged_at: new Date().toISOString(),
  };
}

// Backend to Frontend
function mapMealToFrontend(backendMeal) {
  return {
    id: backendMeal.id,
    name: backendMeal.meal_name,
    description: backendMeal.meal_name,
    calories: backendMeal.calories || 0,
    protein: backendMeal.protein_g,
    carbs: backendMeal.carbs_g,
    fat: backendMeal.fat_g,
    logged: true,
  };
}
```

## User Profile Model

### Frontend Format (AppContext)
```javascript
{
  name: 'John Benedict Reyes',
  email: 'john@example.com',
  goal: 'Bulking Phase',
  height: 180,
  weight: 75,
  heightUnit: 'CM',
  weightUnit: 'KG',
  sex: 'Male',
  isPro: true,
  weeklyLog: [true, true, true, true, true, false, false],
}
```

### Backend Considerations
- User data is stored in Supabase Auth by default
- Additional profile data should be stored in a separate `profiles` table
- Suggested structure:
```json
{
  "user_id": "uuid",
  "name": "John Benedict Reyes",
  "goal": "Bulking Phase",
  "height_cm": 180,
  "weight_kg": 75,
  "sex": "Male",
  "is_pro": true,
  "updated_at": "2024-05-22T10:30:00.000Z"
}
```

## Progress Tracking Model

### Frontend Format (AppContext)
```javascript
{
  caloriesEaten: 770,
  caloriesRemaining: 850,
  caloriesGoal: 2800,
  protein: { eaten: 80, goal: 150 },
  carbs: { eaten: 120, goal: 200 },
  fats: { eaten: 45, goal: 65 },
  waterIntake: 4,
  waterGoal: 8,
  sleepHours: 7.5,
  weekStreak: 12,
  totalVolume: 14520,
  sessionTime: '00:42:15',
}
```

### Backend Format (API)
```json
{
  "user_id": "uuid",
  "date": "2024-05-22",
  "calories_eaten": 770,
  "calories_goal": 2800,
  "protein_eaten_g": 80,
  "protein_goal_g": 150,
  "carbs_eaten_g": 120,
  "carbs_goal_g": 200,
  "fat_eaten_g": 45,
  "fat_goal_g": 65,
  "water_intake_ml": 1000,
  "water_goal_ml": 2000,
  "sleep_hours": 7.5,
  "workout_streak_days": 12,
  "total_volume_kg": 14520
}
```

## API Request/Response Cycle

### Creating a Workout Example

#### Frontend Code
```javascript
import { workoutAPI } from '../services/api';

const handleSaveWorkout = async (workoutData) => {
  const backendFormat = {
    name: workoutData.name,
    notes: workoutData.notes || '',
    performed_at: workoutData.date || new Date().toISOString(),
    sets: workoutData.sets.map(s => ({
      exercise_name: workoutData.name,
      set_number: s.set,
      reps: s.reps,
      weight_kg: s.weight,
    })),
  };

  try {
    const response = await workoutAPI.create(backendFormat);
    // response contains the created workout with ID
    console.log('Workout saved:', response);
  } catch (error) {
    console.error('Error saving workout:', error);
  }
};
```

#### Backend Processing
1. Request arrives at `POST /api/workouts`
2. Authentication middleware validates JWT token
3. Validation middleware checks request body against schema
4. Controller receives request and calls service
5. Service creates workout record and exercise sets
6. Response is sent back with created data

#### Frontend Reception
```javascript
// Workout is created and stored in AppContext
addWorkout(response);
```

## Validation Rules

### Workout Creation
- `name`: Required, 1-100 characters
- `performed_at`: Required, ISO datetime string
- `sets`: Required, must be array with at least 1 set
  - `exercise_name`: Required, string
  - `set_number`: Required, positive integer
  - `reps`: Optional, positive integer
  - `weight_kg`: Optional, positive number
  - `duration_seconds`: Optional, positive integer

### Diet Log Creation
- `meal_name`: Required, 1-100 characters
- `logged_at`: Required, ISO datetime string
- `calories`: Optional, positive number
- `protein_g`, `carbs_g`, `fat_g`: Optional, non-negative numbers

## Error Handling

### Common Errors

#### 401 Unauthorized
```javascript
{
  error: "No token"
}
```
**Cause**: Missing or invalid authentication token
**Solution**: Ensure user is logged in and token is stored in AsyncStorage

#### 400 Bad Request
```javascript
{
  error: "Validation error details"
}
```
**Cause**: Invalid request data format
**Solution**: Check data types and required fields match schema

#### 500 Internal Server Error
```javascript
{
  error: "Server error message"
}
```
**Cause**: Backend error
**Solution**: Check backend logs, verify database connection

## Testing the Integration

### Using Postman or cURL

#### Create Workout
```bash
curl -X POST http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Bench Press",
    "notes": "Heavy session",
    "performed_at": "2024-05-22T10:30:00Z",
    "sets": [
      {
        "exercise_name": "Bench Press",
        "set_number": 1,
        "reps": 8,
        "weight_kg": 100
      }
    ]
  }'
```

#### Get All Workouts
```bash
curl http://localhost:3000/api/workouts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Diet Log
```bash
curl -X POST http://localhost:3000/api/diet \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "meal_name": "Lunch",
    "calories": 450,
    "protein_g": 30,
    "carbs_g": 45,
    "fat_g": 15,
    "logged_at": "2024-05-22T12:00:00Z"
  }'
```

## Frontend Integration Best Practices

1. **Always handle errors**: Wrap API calls in try-catch
2. **Provide user feedback**: Show loading states and error messages
3. **Validate local data**: Check data before sending to backend
4. **Handle offline mode**: Fall back to local storage if network unavailable
5. **Use proper TypeScript types**: Define interfaces for all models
6. **Consistent date formatting**: Always use ISO 8601 format
7. **Clear state management**: Use AppContext or Redux properly
8. **Rate limiting awareness**: Don't make excessive API calls

## Extending the Models

To add new fields to models:

1. **Backend**: Add to TypeScript types and validation schemas
2. **Database**: Create migration to add columns (if using SQL)
3. **API**: Update controllers and services
4. **Frontend**: Update mapping functions and AppContext
5. **Tests**: Add test cases for new fields
