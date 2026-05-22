import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { workoutAPI, dietAPI, progressAPI } from '../services/api';
import { authService } from '../services/auth';

const AppContext = createContext();

// Mock data fallback
const initialWorkouts = [
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
    date: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Lat Pulldown (Cable)',
    muscle: 'Back',
    sets: [
      { set: 1, weight: 65, reps: 12, rpe: null },
      { set: 2, weight: 70, reps: 10, rpe: null },
      { set: 3, weight: 75, reps: 8, rpe: null },
    ],
    completed: true,
    date: new Date().toISOString(),
  },
];

const initialMeals = [
  { id: 1, name: 'Breakfast', description: 'Oatmeal, Black Coffee', calories: 320, logged: true },
  { id: 2, name: 'Lunch', description: 'Grilled Chicken Salad', calories: 450, logged: true },
  { id: 3, name: 'Dinner', description: 'Tap to log', calories: 0, logged: false },
];

const initialStats = {
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
};

const initialUser = {
  name: 'Cloyd',
  email: 'john@example.com',
  goal: 'Bulking Phase',
  height: 180,
  weight: 75,
  heightUnit: 'CM',
  weightUnit: 'KG',
  sex: 'Male',
  isPro: true,
  weeklyLog: [true, true, true, true, true, false, false],
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [meals, setMeals] = useState(initialMeals);
  const [stats, setStats] = useState(initialStats);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      text: "Your strength was down slightly today during your compound lifts. Let's look at your carb intake over the last 24 hours to see if we can optimize your energy for tomorrow's session.",
      time: 'Today, 3:45 PM',
    },
    {
      role: 'assistant',
      text: 'Have you logged all your meals for the morning?',
      time: '',
    },
  ]);

  // Initialize - check auth and load data
  useEffect(() => {
    const init = async () => {
      try {
        const hasSession = await authService.restoreSession();
        setIsLoggedIn(hasSession);

        if (hasSession) {
          await loadUserData();
        }
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Fetch data from backend
  const loadUserData = useCallback(async () => {
    try {
      // Load workouts
      const workoutData = await workoutAPI.getAll();
      if (workoutData && Array.isArray(workoutData)) {
        setWorkouts(workoutData);
      }

      // Load diet logs
      const dietData = await dietAPI.getAll();
      if (dietData && Array.isArray(dietData)) {
        setMeals(dietData);
      }

      setBackendAvailable(true);
    } catch (error) {
      console.error('Error loading user data:', error);
      setBackendAvailable(false);
      // Keep mock data as fallback
    }
  }, []);

  // Add workout to backend and local state
  const addWorkout = useCallback(async (workout) => {
    try {
      const newWorkout = {
        name: workout.name,
        notes: workout.notes || '',
        performed_at: workout.date || new Date().toISOString(),
        sets: (workout.sets || []).map((s) => ({
          exercise_name: workout.name,
          set_number: s.set,
          reps: s.reps,
          weight_kg: s.weight,
        })),
      };

      if (backendAvailable && isLoggedIn) {
        const result = await workoutAPI.create(newWorkout);
        setWorkouts((prev) => [...prev, result]);
      } else {
        // Fallback: add to local state
        setWorkouts((prev) => [...prev, { ...workout, id: Date.now() }]);
      }
    } catch (error) {
      console.error('Error adding workout:', error);
      // Add to local state as fallback
      setWorkouts((prev) => [...prev, { ...workout, id: Date.now() }]);
    }
  }, [backendAvailable, isLoggedIn]);

  // Update set in a workout
  const updateSet = useCallback((workoutId, setIndex, data) => {
    setWorkouts((prev) =>
      prev.map((w) => {
        if (w.id !== workoutId) return w;
        const newSets = [...w.sets];
        newSets[setIndex] = { ...newSets[setIndex], ...data };
        return { ...w, sets: newSets };
      })
    );

    // Sync to backend if available
    if (backendAvailable && isLoggedIn) {
      const workout = workouts.find((w) => w.id === workoutId);
      if (workout) {
        workoutAPI.update(workoutId, {
          name: workout.name,
          notes: workout.notes || '',
          performed_at: workout.date || new Date().toISOString(),
          sets: workout.sets,
        }).catch((error) => console.error('Error updating workout:', error));
      }
    }
  }, [workouts, backendAvailable, isLoggedIn]);

  // Add a set to a workout
  const addSet = useCallback((workoutId) => {
    setWorkouts((prev) =>
      prev.map((w) => {
        if (w.id !== workoutId) return w;
        const lastSet = w.sets[w.sets.length - 1];
        return {
          ...w,
          sets: [
            ...w.sets,
            { set: w.sets.length + 1, weight: lastSet.weight, reps: lastSet.reps, rpe: null },
          ],
        };
      })
    );
  }, []);

  // Log meal to backend
  const logMeal = useCallback(async (mealId, calories, description) => {
    try {
      const mealData = {
        meal_name: description || 'Meal',
        calories: calories || 0,
        logged_at: new Date().toISOString(),
      };

      if (backendAvailable && isLoggedIn) {
        await dietAPI.create(mealData);
      }

      // Update local state
      setMeals((prev) =>
        prev.map((m) => {
          if (m.id !== mealId) return m;
          return { ...m, calories, description, logged: true };
        })
      );

      setStats((prev) => ({
        ...prev,
        caloriesEaten: prev.caloriesEaten + (calories || 0),
        caloriesRemaining: prev.caloriesRemaining - (calories || 0),
      }));
    } catch (error) {
      console.error('Error logging meal:', error);
      // Update local state as fallback
      setMeals((prev) =>
        prev.map((m) => {
          if (m.id !== mealId) return m;
          return { ...m, calories, description, logged: true };
        })
      );
    }
  }, [backendAvailable, isLoggedIn]);

  const addChatMessage = useCallback((msg) => {
    setChatHistory((prev) => [...prev, msg]);
  }, []);

  // Authentication functions
  const login = useCallback(async (email, password) => {
    try {
      const data = await authService.signIn(email, password);
      setIsLoggedIn(true);
      setUser((prev) => ({
        ...prev,
        email: data.user.email,
      }));
      await loadUserData();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [loadUserData]);

  const signup = useCallback(async (email, password, userData) => {
    try {
      await authService.signUp(email, password, userData);
      setIsLoggedIn(true);
      setUser((prev) => ({
        ...prev,
        ...userData,
        email,
      }));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.signOut();
      setIsLoggedIn(false);
      setUser(initialUser);
      setWorkouts(initialWorkouts);
      setMeals(initialMeals);
      setStats(initialStats);
      setChatHistory([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        // User
        user,
        setUser,
        // Workouts
        workouts,
        addWorkout,
        updateSet,
        addSet,
        // Meals
        meals,
        logMeal,
        // Stats
        stats,
        setStats,
        // Auth
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        login,
        signup,
        logout,
        // Chat
        chatHistory,
        addChatMessage,
        // Backend
        backendAvailable,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
