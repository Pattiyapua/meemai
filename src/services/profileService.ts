import { supabase, isSupabaseConfigured } from "@/supabase";
import { ProfileUpdateInput, UserProfile } from "@/types/profile";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg"];

// โปรไฟล์ตัวอย่างสำหรับโหมด Guest / Demo
export const DEMO_PROFILE: UserProfile = {
  id: "demo-user-meemai-001",
  full_name: "นารถนียา พัววิไล",
  username: "nuania_tu",
  email: "pattiya@meemai.com",
  phone: "089-123-4567",
  bio: "นักศึกษา ม.ธรรมศาสตร์ ท่าพระจันทร์ สนใจส่งต่อของใช้สภาพดีและหนังสือเรียนเพื่อความยั่งยืน 🌿",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
  created_at: "2026-11-04T10:00:00Z",
  updated_at: "2026-11-14T10:00:00Z",
};

// เก็บโปรไฟล์ demo ไว้ใน memory ระหว่างเซสชัน
let inMemoryDemoProfile: UserProfile | null = null;

export function getDemoProfile(): UserProfile {
  if (!inMemoryDemoProfile) {
    inMemoryDemoProfile = { ...DEMO_PROFILE };
  }
  return inMemoryDemoProfile;
}

export function updateDemoProfile(input: ProfileUpdateInput): UserProfile {
  const current = getDemoProfile();
  inMemoryDemoProfile = {
    ...current,
    ...input,
    updated_at: new Date().toISOString(),
  };
  return inMemoryDemoProfile;
}

export function resetDemoProfile(): void {
  inMemoryDemoProfile = null;
}

/**
 * ดึงข้อมูลผู้ใช้งานที่เข้าสู่ระบบปัจจุบันจาก Supabase Auth
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }
    return user;
  } catch (err) {
    console.warn("getCurrentUser failed:", err);
    return null;
  }
}

/**
 * ดึงข้อมูลโปรไฟล์จากตาราง profiles โดยเชื่อมโยงกับ User ID
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  // หากเป็น Demo user
  if (userId === DEMO_PROFILE.id) {
    return getDemoProfile();
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Error fetching profile from Supabase:", error.message);
      return null;
    }

    return data as UserProfile | null;
  } catch (err) {
    console.warn("getProfile exception:", err);
    return null;
  }
}

/**
 * สร้างหรืออัปเดตข้อมูลโปรไฟล์เริ่มต้นสำหรับผู้ใช้ (หากยังไม่มีในตาราง)
 */
export async function ensureProfile(user: any): Promise<UserProfile> {
  if (!user) {
    return getDemoProfile();
  }

  // หากเป็น Demo
  if (user.id === DEMO_PROFILE.id) {
    return getDemoProfile();
  }

  // 1. ลองดึงจากตาราง profiles
  const existing = await getProfile(user.id);
  if (existing) {
    return existing;
  }

  // 2. ถ้ายังไม่มี ให้สร้าง profile เริ่มต้นจาก user metadata หรือ email
  const initialProfile: UserProfile = {
    id: user.id,
    full_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "ผู้ใช้งาน MEEMAI",
    username:
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      `user_${user.id.slice(0, 6)}`,
    email: user.email || "",
    phone: user.user_metadata?.phone || "",
    bio: "",
    avatar_url: user.user_metadata?.avatar_url || null,
    created_at: user.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(initialProfile)
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Failed to insert initial profile into db:", error.message);
      return initialProfile;
    }

    return (data as UserProfile) || initialProfile;
  } catch (err) {
    console.warn("ensureProfile upsert exception:", err);
    return initialProfile;
  }
}

/**
 * อัปเดตข้อมูลโปรไฟล์ในฐานข้อมูล Supabase (หรือ demo memory)
 */
export async function updateProfile(
  userId: string,
  input: ProfileUpdateInput
): Promise<UserProfile> {
  // หากเป็น Demo user
  if (userId === DEMO_PROFILE.id) {
    return updateDemoProfile(input);
  }

  const updates: Record<string, any> = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Supabase profile update warning:", error.message);
      // พยายาม sync ไปที่ auth metadata
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: input.full_name,
            username: input.username,
            phone: input.phone,
            avatar_url: input.avatar_url,
          },
        });
      } catch (authErr) {
        console.warn("Auth update error:", authErr);
      }
      return {
        id: userId,
        full_name: input.full_name || null,
        username: input.username || null,
        email: null,
        phone: input.phone || null,
        bio: input.bio || null,
        avatar_url: input.avatar_url || null,
      };
    }

    // อัปเดต metadata ใน Supabase Auth ด้วยเพื่อให้สอดคล้องกัน
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: input.full_name,
          username: input.username,
          phone: input.phone,
          avatar_url: input.avatar_url,
        },
      });
    } catch (authErr) {
      console.warn("Failed to sync metadata to auth user:", authErr);
    }

    return data as UserProfile;
  } catch (err) {
    console.warn("updateProfile exception, returning input fallback:", err);
    return {
      id: userId,
      full_name: input.full_name || null,
      username: input.username || null,
      email: null,
      phone: input.phone || null,
      bio: input.bio || null,
      avatar_url: input.avatar_url || null,
    };
  }
}

/**
 * เปิดตัวเลือกรูปภาพจากเครื่อง พร้อมตรวจสอบนามสกุลไฟล์และขนาดไฟล์
 */
export async function pickProfileImage(): Promise<ImagePicker.ImagePickerAsset | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error("จำเป็นต้องอนุญาตการเข้าถึงรูปภาพเพื่อเปลี่ยนรูปโปรไฟล์");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];

  // ตรวจสอบนามสกุลไฟล์
  const uri = asset.uri || "";
  const ext = uri.split(".").pop()?.toLowerCase().split("?")[0] || "jpg";
  const mimeType = asset.mimeType?.toLowerCase();

  const isExtValid = ALLOWED_EXTENSIONS.includes(ext);
  const isMimeValid = mimeType ? ALLOWED_MIME_TYPES.includes(mimeType) : true;

  if (!isExtValid && !isMimeValid) {
    throw new Error("รองรับเฉพาะรูปภาพประเภท JPG, JPEG และ PNG เท่านั้น");
  }

  // ตรวจสอบขนาดไฟล์ (ถ้ามีข้อมูล fileSize)
  if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE_BYTES) {
    throw new Error("ขนาดไฟล์รูปภาพต้องไม่เกิน 5 MB");
  }

  return asset;
}

/**
 * อัปโหลดรูปภาพไปยัง Supabase Storage bucket 'avatars'
 * หาก Storage ยังไม่ได้สร้าง bucket ไว้ จะ fallback กลับไปใช้รูปภาพ URI โดยไม่ทำให้ระบบค้าง
 */
export async function uploadAvatarImage(
  userId: string,
  asset: ImagePicker.ImagePickerAsset
): Promise<string> {
  const uri = asset.uri;
  const ext = uri.split(".").pop()?.toLowerCase().split("?")[0] || "jpg";
  const fileName = `${userId}/avatar_${Date.now()}.${ext}`;
  const contentType =
    asset.mimeType || (ext === "png" ? "image/png" : "image/jpeg");

  try {
    let fileBody: any;

    if (Platform.OS === "web") {
      const response = await fetch(uri);
      const blob = await response.blob();
      if (blob.size > MAX_FILE_SIZE_BYTES) {
        throw new Error("ขนาดไฟล์รูปภาพต้องไม่เกิน 5 MB");
      }
      fileBody = blob;
    } else {
      const response = await fetch(uri);
      const blob = await response.blob();
      if (blob.size > MAX_FILE_SIZE_BYTES) {
        throw new Error("ขนาดไฟล์รูปภาพต้องไม่เกิน 5 MB");
      }
      fileBody = blob;
    }

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, fileBody, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn("Storage upload notice:", uploadError.message);
      // Fallback: ใช้ URI เดิม เพื่อให้แอปทำงานต่อได้ไม่สะดุด
      return uri;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl || uri;
  } catch (err: any) {
    console.warn("Storage upload exception, using local uri fallback:", err);
    return uri;
  }
}

/**
 * ลบรูปโปรไฟล์
 */
export async function removeAvatar(
  userId: string,
  currentAvatarUrl?: string | null
): Promise<void> {
  // หากเป็น Demo
  if (userId === DEMO_PROFILE.id) {
    updateDemoProfile({ avatar_url: null });
    return;
  }

  // ลบไฟล์จาก Storage ถ้าเป็นไปได้
  if (currentAvatarUrl && currentAvatarUrl.includes("avatars/")) {
    try {
      const path = currentAvatarUrl.split("avatars/")[1]?.split("?")[0];
      if (path) {
        await supabase.storage.from("avatars").remove([path]);
      }
    } catch (err) {
      console.warn("Storage delete warning:", err);
    }
  }

  try {
    await supabase
      .from("profiles")
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq("id", userId);
  } catch (err) {
    console.warn("removeAvatar db warning:", err);
  }
}

/**
 * แปลงวันที่เป็นข้อความภาษาไทยที่อ่านง่าย
 */
export function formatJoinDate(dateString?: string | null): string {
  if (!dateString) return "4 พฤศจิกายน 2569";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "4 พฤศจิกายน 2569";
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "4 พฤศจิกายน 2569";
  }
}
