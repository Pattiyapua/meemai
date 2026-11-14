import { ErrorState, LoadingState } from "@/components/UIState";
import { COLORS, MaxContentWidth } from "@/constants/theme";
import { formatJoinDate, getProfile, ensureProfile, getCurrentUser } from "@/services/profileService";
import { supabase } from "@/supabase";
import { UserProfile } from "@/types/profile";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const loadProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const user = await getCurrentUser();
      if (!user) {
        setIsLoggedOut(true);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoggedOut(false);
      const userProfile = await ensureProfile(user);
      setProfile(userProfile);
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setErrorMessage(
        err?.message || "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData])
  );

  const handleSignOut = async () => {
    const doSignOut = async () => {
      try {
        await supabase.auth.signOut();
        router.replace("/signin");
      } catch (err) {
        console.error("Sign out error:", err);
        router.replace("/signin");
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("คุณต้องการออกจากระบบหรือไม่?")) {
        await doSignOut();
      }
    } else {
      Alert.alert("ออกจากระบบ", "คุณต้องการออกจากระบบหรือไม่?", [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ออกจากระบบ", style: "destructive", onPress: doSignOut },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/home");
            }
          }}
          accessibilityLabel="ย้อนกลับ"
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle}>โปรไฟล์ของฉัน</Text>

        {!isLoggedOut && profile && (
          <Pressable
            style={styles.editHeaderBtn}
            onPress={() => router.push("/edit-profile" as any)}
            accessibilityLabel="แก้ไขโปรไฟล์"
          >
            <Feather name="edit-3" size={18} color={COLORS.primary} />
            <Text style={styles.editHeaderText}>แก้ไข</Text>
          </Pressable>
        )}
        {(isLoggedOut || !profile) && <View style={{ width: 44 }} />}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveWrapper}>
          {/* Loading State */}
          {isLoading && (
            <LoadingState message="กำลังโหลดข้อมูลโปรไฟล์..." />
          )}

          {/* Error State */}
          {!isLoading && errorMessage && (
            <ErrorState
              title="เกิดข้อผิดพลาด"
              message={errorMessage}
              onRetry={loadProfileData}
            />
          )}

          {/* Not Logged In State */}
          {!isLoading && !errorMessage && isLoggedOut && (
            <View style={styles.guestCard}>
              <View style={styles.guestAvatarPlaceholder}>
                <Ionicons
                  name="person-outline"
                  size={48}
                  color={COLORS.textMuted}
                />
              </View>
              <Text style={styles.guestTitle}>ยังไม่ได้เข้าสู่ระบบ</Text>
              <Text style={styles.guestSubtitle}>
                กรุณาเข้าสู่ระบบหรือสมัครสมาชิก เพื่อจัดการข้อมูลโปรไฟล์และประกาศสิ่งของของคุณ
              </Text>
              <View style={styles.guestActionRow}>
                <Pressable
                  style={[styles.primaryBtn, { flex: 1, marginRight: 8 }]}
                  onPress={() => router.push("/signin")}
                >
                  <Text style={styles.primaryBtnText}>เข้าสู่ระบบ</Text>
                </Pressable>
                <Pressable
                  style={[styles.secondaryBtn, { flex: 1, marginLeft: 8 }]}
                  onPress={() => router.push("/register")}
                >
                  <Text style={styles.secondaryBtnText}>สมัครสมาชิก</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Profile Content State */}
          {!isLoading && !errorMessage && !isLoggedOut && profile && (
            <>
              {/* Profile Card */}
              <View style={styles.profileCard}>
                <View style={styles.avatarSection}>
                  <View style={styles.avatarContainer}>
                    {profile.avatar_url ? (
                      <Image
                        source={{ uri: profile.avatar_url }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <Text style={styles.avatarFallbackText}>
                          {(profile.full_name || profile.username || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Name & Username */}
                <Text style={styles.fullName}>
                  {profile.full_name || "ไม่มีชื่อระบุ"}
                </Text>
                <View style={styles.usernameBadge}>
                  <Text style={styles.usernameText}>
                    @{profile.username || "username"}
                  </Text>
                </View>

                {/* Bio */}
                <View style={styles.bioContainer}>
                  <Text style={styles.bioText}>
                    {profile.bio && profile.bio.trim()
                      ? profile.bio
                      : "ยังไม่มีคำแนะนำตัว คุณสามารถกดปุ่มแก้ไขเพื่อเพิ่มคำแนะนำตัวได้"}
                  </Text>
                </View>

                {/* Action Button: Edit Profile */}
                <Pressable
                  style={({ pressed }) => [
                    styles.editProfileBtn,
                    pressed && styles.btnPressed,
                  ]}
                  onPress={() => router.push("/edit-profile" as any)}
                >
                  <Feather name="edit" size={16} color="#FFFFFF" />
                  <Text style={styles.editProfileBtnText}>
                    แก้ไขข้อมูลส่วนตัว
                  </Text>
                </Pressable>
              </View>

              {/* Information Details Card */}
              <View style={styles.detailsCard}>
                <Text style={styles.cardSectionHeader}>ข้อมูลติดต่อและบัญชี</Text>

                {/* Email */}
                <View style={styles.infoRow}>
                  <View style={styles.infoIconBg}>
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>อีเมล (Email)</Text>
                    <Text style={styles.infoValue}>
                      {profile.email || "ไม่ได้ระบุ"}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Phone */}
                <View style={styles.infoRow}>
                  <View style={styles.infoIconBg}>
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>เบอร์โทรศัพท์ (Phone)</Text>
                    <Text style={styles.infoValue}>
                      {profile.phone || "ยังไม่ได้เพิ่มเบอร์โทรศัพท์"}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Joined Date */}
                <View style={styles.infoRow}>
                  <View style={styles.infoIconBg}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>วันที่สมัครสมาชิก (Joined)</Text>
                    <Text style={styles.infoValue}>
                      {formatJoinDate(profile.created_at)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Sign Out Card Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.signOutBtn,
                  pressed && styles.btnPressed,
                ]}
                onPress={handleSignOut}
              >
                <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
                <Text style={styles.signOutBtnText}>ออกจากระบบ</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
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
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  editHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundElement,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  editHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 4,
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
  errorCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginTop: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 10,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 16,
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  guestCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginTop: 20,
    shadowColor: "#59452B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  guestAvatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  guestSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  guestActionRow: {
    flexDirection: "row",
    marginTop: 24,
    width: "100%",
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryBtn: {
    backgroundColor: COLORS.backgroundElement,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "800",
  },
  profileCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: "#59452B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  avatarSection: {
    marginBottom: 14,
  },
  avatarContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: COLORS.orange,
    overflow: "hidden",
    backgroundColor: COLORS.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  fullName: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  usernameBadge: {
    backgroundColor: COLORS.backgroundElement,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  usernameText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.orange,
  },
  bioContainer: {
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
    width: "100%",
  },
  bioText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 19,
    textAlign: "center",
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    width: "100%",
    height: 46,
    borderRadius: 14,
    marginTop: 18,
  },
  editProfileBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 6,
  },
  detailsCard: {
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
    marginBottom: 16,
  },
  cardSectionHeader: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: 4,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.cardBg,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    height: 48,
    borderRadius: 16,
    marginBottom: 30,
  },
  signOutBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 6,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
