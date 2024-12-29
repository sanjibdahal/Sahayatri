import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://graetfetdvajtneaoxnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyYWV0ZmV0ZHZhanRuZWFveG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NDIxNjcsImV4cCI6MjA0OTUxODE2N30.679gndyuSAvXV9hpLMhNn5A9_rzashRofaijguU0Sl8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
