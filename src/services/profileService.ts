import { supabase } from "@/supabase";
import { ProfileUpdateInput, UserProfile } from "@/types/profile";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg"];

/**
 * ดึงข้อมูลผู้ใช้งานที่เข้าสู่ระบบปัจจุบัน
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }
  return user;
}

/**
 * ดึงข้อมูลโปรไฟล์จากตาราง profiles โดยเชื่อมโยงกับ User ID
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("Error fetching profile:", error.message);
    throw error;
  }

  return data as UserProfile | null;
}

/**
 * สร้างหรืออัปเดตข้อมูลโปรไฟล์เริ่มต้นสำหรับผู้ใช้ (หากยังไม่มีในตาราง)
 */
export async function ensureProfile(user: any): Promise<UserProfile> {
  const existing = await getProfile(user.id);
  if (existing) {
    return existing;
  }

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

  const { data, error } = await supabase
    .from("profiles")
    .upsert(initialProfile)
    .select()
    .single();

  if (error) {
    console.warn("Failed to insert initial profile:", error.message);
    return initialProfile;
  }

  return data as UserProfile;
}

/**
 * อัปเดตข้อมูลโปรไฟล์ในฐานข้อมูล Supabase
 */
export async function updateProfile(
  userId: string,
  input: ProfileUpdateInput
): Promise<UserProfile> {
  const updates: Record<string, any> = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  // อัปเดต metadata ใน Supabase Auth ด้วยเพื่อให้สอดคล้องกัน
  try {
    await supabase.auth.updateUser({
      data: {
        full_name: input.full_name,
        username: input.username,
        phone: input.phone,
      },
    });
  } catch (authErr) {
    console.warn("Failed to sync metadata to auth user:", authErr);
  }

  return data as UserProfile;
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

  let fileBody: any;

  if (Platform.OS === "web") {
    // บน Web สามารถ fetch URI เป็น Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    if (blob.size > MAX_FILE_SIZE_BYTES) {
      throw new Error("ขนาดไฟล์รูปภาพต้องไม่เกิน 5 MB");
    }
    fileBody = blob;
  } else {
    // บน Mobile (iOS / Android)
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
    console.error("Storage upload error:", uploadError);
    throw new Error(`อัปโหลดรูปภาพไม่สำเร็จ: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

/**
 * ลบรูปโปรไฟล์
 */
export async function removeAvatar(userId: string, currentAvatarUrl?: string | null): Promise<void> {
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

  // อัปเดตในตาราง profiles ให้ avatar_url เป็น null
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

/**
 * แปลงวันที่เป็นข้อความภาษาไทยที่อ่านง่าย
 */
export function formatJoinDate(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "-";
  }
}
