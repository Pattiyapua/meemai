import { LoadingState, StatusBanner } from "@/components/UIState";
import { COLORS, MaxContentWidth } from "@/constants/theme";
import {
  ensureProfile,
  getCurrentUser,
  getDemoProfile,
  pickProfileImage,
  removeAvatar,
  updateProfile,
  uploadAvatarImage,
} from "@/services/profileService";
import { UserProfile } from "@/types/profile";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();

  // Profile data state
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);

  // Pending image state (for preview before saving)
  const [selectedAsset, setSelectedAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const user = await getCurrentUser();
        const activeProfile: UserProfile = user
          ? await ensureProfile(user)
          : getDemoProfile();

        setUserId(activeProfile.id);
        setFullName(activeProfile.full_name || "");
        setUsername(activeProfile.username || "");
        setPhone(activeProfile.phone || "");
        setBio(activeProfile.bio || "");
        setCurrentAvatarUrl(activeProfile.avatar_url || null);
      } catch (err: any) {
        console.error("Error loading user for edit:", err);
        setErrorMessage(
          err?.message || "ไม่สามารถดึงข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [router]);

  // เลือกรูปจากอุปกรณ์
  const handleSelectImage = async () => {
    try {
      setErrorMessage(null);
      const asset = await pickProfileImage();
      if (asset) {
        setSelectedAsset(asset);
        setIsAvatarRemoved(false);
      }
    } catch (err: any) {
      const msg = err?.message || "ไม่สามารถเลือกรูปภาพได้";
      setErrorMessage(msg);
      if (Platform.OS === "web") {
        window.alert(msg);
      } else {
        Alert.alert("ข้อผิดพลาด", msg);
      }
    }
  };

  // ลบรูปภาพโปรไฟล์เดิม
  const handleRemoveImage = () => {
    const confirmRemove = () => {
      setSelectedAsset(null);
      setIsAvatarRemoved(true);
    };

    if (Platform.OS === "web") {
      if (window.confirm("คุณต้องการลบรูปโปรไฟล์หรือไม่?")) {
        confirmRemove();
      }
    } else {
      Alert.alert("ลบรูปโปรไฟล์", "คุณต้องการลบรูปโปรไฟล์หรือไม่?", [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ลบรูป", style: "destructive", onPress: confirmRemove },
      ]);
    }
  };

  // บันทึกการแก้ไขข้อมูล
  const handleSave = async () => {
    if (!userId) {
      setErrorMessage("ไม่พบบัญชีผู้ใช้งาน");
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      let finalAvatarUrl = currentAvatarUrl;

      // 1. ถ้ามีการลบรูปโปรไฟล์
      if (isAvatarRemoved) {
        await removeAvatar(userId, currentAvatarUrl);
        finalAvatarUrl = null;
      }
      // 2. ถ้ามีการเลือกรูปใหม่ ให้ทำการอัปโหลดขึ้น Supabase Storage
      else if (selectedAsset) {
        finalAvatarUrl = await uploadAvatarImage(userId, selectedAsset);
      }

      // 3. บันทึกข้อมูลโปรไฟล์ลงในตาราง profiles ของ Supabase
      await updateProfile(userId, {
        full_name: fullName.trim(),
        username: username.trim() || undefined,
        phone: phone.trim() || undefined,
        bio: bio.trim(),
        avatar_url: finalAvatarUrl,
      });

      setSuccessMessage("บันทึกข้อมูลโปรไฟล์สำเร็จเรียบร้อยแล้ว!");

      if (Platform.OS === "web") {
        window.alert("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!");
        router.back();
      } else {
        Alert.alert("สำเร็จ", "บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!", [
          {
            text: "ตกลง",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (err: any) {
      console.error("Save profile error:", err);
      const msg =
        err?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง";
      setErrorMessage(msg);
      if (Platform.OS === "web") {
        window.alert(`ข้อผิดพลาด: ${msg}`);
      } else {
        Alert.alert("เกิดข้อผิดพลาด", msg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Preview รูปภาพที่จะแสดง
  const displayImageUri = isAvatarRemoved
    ? null
    : selectedAsset
    ? selectedAsset.uri
    : currentAvatarUrl;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.cancelHeaderBtn}
          onPress={handleCancel}
          disabled={isSaving}
        >
          <Text style={styles.cancelHeaderText}>ยกเลิก</Text>
        </Pressable>

        <Text style={styles.headerTitle}>แก้ไขโปรไฟล์</Text>

        <Pressable
          style={[styles.saveHeaderBtn, isSaving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveHeaderText}>บันทึก</Text>
          )}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.responsiveWrapper}>
            {/* Loading */}
            {isLoading ? (
              <LoadingState message="กำลังโหลดข้อมูลโปรไฟล์..." />
            ) : (
              <>
                {/* Alert Banners */}
                {errorMessage && (
                  <StatusBanner
                    type="error"
                    message={errorMessage}
                    onDismiss={() => setErrorMessage(null)}
                  />
                )}

                {successMessage && (
                  <StatusBanner
                    type="success"
                    message={successMessage}
                    onDismiss={() => setSuccessMessage(null)}
                  />
                )}

                {/* Avatar Section */}
                <View style={styles.avatarCard}>
                  <View style={styles.avatarWrapper}>
                    {displayImageUri ? (
                      <Image
                        source={{ uri: displayImageUri }}
                        style={styles.avatarImg}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <Text style={styles.avatarFallbackText}>
                          {(fullName || username || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </Text>
                      </View>
                    )}

                    <Pressable
                      style={styles.cameraBadge}
                      onPress={handleSelectImage}
                      disabled={isSaving}
                    >
                      <Feather name="camera" size={16} color="#FFFFFF" />
                    </Pressable>
                  </View>

                  {/* Avatar Actions */}
                  <View style={styles.avatarActionRow}>
                    <Pressable
                      style={styles.changeAvatarBtn}
                      onPress={handleSelectImage}
                      disabled={isSaving}
                    >
                      <Ionicons
                        name="image-outline"
                        size={16}
                        color={COLORS.primary}
                      />
                      <Text style={styles.changeAvatarText}>
                        {displayImageUri ? "เปลี่ยนรูปโปรไฟล์" : "อัปโหลดรูปโปรไฟล์"}
                      </Text>
                    </Pressable>

                    {displayImageUri && (
                      <Pressable
                        style={styles.removeAvatarBtn}
                        onPress={handleRemoveImage}
                        disabled={isSaving}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#D32F2F"
                        />
                        <Text style={styles.removeAvatarText}>ลบรูป</Text>
                      </Pressable>
                    )}
                  </View>

                  <Text style={styles.avatarHint}>
                    รองรับ JPG, JPEG, PNG (ขนาดไม่เกิน 5 MB)
                  </Text>
                </View>

                {/* Form Fields Card */}
                <View style={styles.formCard}>
                  {/* Full Name */}
                  <Text style={styles.label}>
                    ชื่อ-นามสกุล <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="กรอกชื่อ-นามสกุลของคุณ"
                    placeholderTextColor="#C5BBAC"
                    value={fullName}
                    onChangeText={setFullName}
                    editable={!isSaving}
                  />

                  {/* Username */}
                  <Text style={styles.label}>Username</Text>
                  <View style={styles.usernameInputContainer}>
                    <Text style={styles.atSymbol}>@</Text>
                    <TextInput
                      style={styles.usernameInput}
                      placeholder="เช่น meemai_user"
                      placeholderTextColor="#C5BBAC"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      editable={!isSaving}
                    />
                  </View>

                  {/* Phone */}
                  <Text style={styles.label}>เบอร์โทรศัพท์</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="เช่น 08X-XXX-XXXX"
                    placeholderTextColor="#C5BBAC"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    editable={!isSaving}
                  />

                  {/* Bio */}
                  <Text style={styles.label}>รายละเอียดแนะนำตัว (Bio)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="บอกเกี่ยวกับตัวคุณ สิ่งของที่ชอบส่งต่อ หรือบริเวณที่สะดวกนัดรับ..."
                    placeholderTextColor="#C5BBAC"
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={4}
                    editable={!isSaving}
                  />
                </View>

                {/* Bottom Action Buttons (Save & Cancel) */}
                <View style={styles.bottomActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.cancelBtn,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={handleCancel}
                    disabled={isSaving}
                  >
                    <Text style={styles.cancelBtnText}>ยกเลิก (Cancel)</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.saveBtn,
                      isSaving && { opacity: 0.7 },
                      pressed && styles.btnPressed,
                    ]}
                    onPress={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons
                          name="save-outline"
                          size={18}
                          color="#FFFFFF"
                        />
                        <Text style={styles.saveBtnText}>บันทึกข้อมูล (Save)</Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    backgroundColor: COLORS.cardBg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  cancelHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  cancelHeaderText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  saveHeaderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    minWidth: 64,
    alignItems: "center",
  },
  saveHeaderText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  responsiveWrapper: {
    width: "100%",
    maxWidth: MaxContentWidth,
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDECEA",
    borderWidth: 1,
    borderColor: "#F5C6CB",
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  errorBannerText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  successBannerText: {
    color: "#2E7D32",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  avatarCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: "#59452B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: "relative",
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: COLORS.orange,
    backgroundColor: COLORS.backgroundElement,
    overflow: "visible",
    marginBottom: 16,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 54,
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: 54,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },
  changeAvatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundElement,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  changeAvatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 6,
  },
  removeAvatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#FFCDD2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  removeAvatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D32F2F",
    marginLeft: 4,
  },
  avatarHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: "#59452B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  required: {
    color: COLORS.primary,
  },
  input: {
    backgroundColor: "#FFFDF9",
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  usernameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFDF9",
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  atSymbol: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.orange,
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  bottomActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.backgroundElement,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
