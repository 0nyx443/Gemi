import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// Check if credentials are valid (not placeholder values)
const isValidSupabaseConfig = () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  if (SUPABASE_URL.includes('your_') || SUPABASE_KEY.includes('your_')) return false;
  if (!SUPABASE_URL.startsWith('http')) return false;
  return true;
};

let supabase = null;

if (!isValidSupabaseConfig()) {
  console.warn(
    'Supabase credentials not configured. Auth features will be disabled.\n' +
    'To enable authentication:\n' +
    '1. Create a project at https://supabase.com\n' +
    '2. Get your URL and Anon Key from Project Settings > API\n' +
    '3. Update .env with your credentials'
  );
} else {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (error) {
    console.error('Failed to initialize Supabase:', error.message);
  }
}

export const authService = {
  // Sign up
  signUp: async (email, password, userData) => {
    if (!supabase) {
      throw new Error(
        'Authentication is not configured. Please set SUPABASE_URL and SUPABASE_KEY in your .env file. ' +
        'For development, you can test with mock data.'
      );
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;

    // Store token
    if (data.session?.access_token) {
      await AsyncStorage.setItem('authToken', data.session.access_token);
    }

    return data;
  },

  // Sign in
  signIn: async (email, password) => {
    if (!supabase) {
      throw new Error(
        'Authentication is not configured. Please set SUPABASE_URL and SUPABASE_KEY in your .env file. ' +
        'For development, you can test with mock data.'
      );
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Store token
    if (data.session?.access_token) {
      await AsyncStorage.setItem('authToken', data.session.access_token);
    }

    return data;
  },

  // Sign out
  signOut: async () => {
    if (!supabase) return;
    
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('authToken');
  },

  // Get current session
  getSession: async () => {
    if (!supabase) return null;
    
    const { data, error } = await supabase.auth.getSession();
    if (error) console.error('Error getting session:', error);
    return data?.session || null;
  },

  // Get current user
  getCurrentUser: async () => {
    if (!supabase) return null;
    
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error('Error getting user:', error);
    return data?.user || null;
  },

  // Restore session from storage
  restoreSession: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Error restoring session:', error);
      return false;
    }
  },
};
