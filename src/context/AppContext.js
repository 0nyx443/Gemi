import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

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
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [meals, setMeals] = useState(initialMeals);
  const [stats, setStats] = useState(initialStats);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const addWorkout = (workout) => {
    setWorkouts((prev) => [...prev, { ...workout, id: Date.now() }]);
  };

  const updateSet = (workoutId, setIndex, data) => {
    setWorkouts((prev) =>
      prev.map((w) => {
        if (w.id !== workoutId) return w;
        const newSets = [...w.sets];
        newSets[setIndex] = { ...newSets[setIndex], ...data };
        return { ...w, sets: newSets };
      })
    );
  };

  const addSet = (workoutId) => {
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
  };

  const logMeal = (mealId, calories, description) => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id !== mealId) return m;
        return { ...m, calories, description, logged: true };
      })
    );
    setStats((prev) => ({
      ...prev,
      caloriesEaten: prev.caloriesEaten + calories,
      caloriesRemaining: prev.caloriesRemaining - calories,
    }));
  };

  const addChatMessage = (msg) => {
    setChatHistory((prev) => [...prev, msg]);
  };

  const login = (email, password) => {
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => setIsLoggedIn(false);

  return (
    <AppContext.Provider
      value={{
        user, setUser,
        workouts, addWorkout, updateSet, addSet,
        meals, logMeal,
        stats, setStats,
        isLoggedIn, login, logout,
        chatHistory, addChatMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
