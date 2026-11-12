import { createClient } from "@supabase/supabase-js";

// ดึงค่าจาก Environment Variables ที่ Expo/Vercel ใช้
const supabaseUrl: string =
  (process.env.EXPO_PUBLIC_SUPABASE_URL as string) ||
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_SUPABASE_URL) ||
  "";

const supabaseKey: string =
  (process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) ||
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  "";

// Guard: ถ้าไม่มี Supabase credentials จะ createClient ด้วย placeholder เพื่อป้องกัน app crash
// แอปยังเปิดได้ แต่ฟีเจอร์ที่ต้องใช้ฐานข้อมูลจะแสดงข้อความแจ้งเตือน
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-key-not-configured";

export const supabase = createClient(
  supabaseUrl || PLACEHOLDER_URL,
  supabaseKey || PLACEHOLDER_KEY
);

export const isSupabaseConfigured =
  !!supabaseUrl && !!supabaseKey && supabaseUrl !== PLACEHOLDER_URL;
