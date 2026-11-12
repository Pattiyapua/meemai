export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProfileUpdateInput {
  full_name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string | null;
}
