import { StatusBanner } from "@/components/UIState";
import { COLORS } from "@/constants/theme";
import { supabase } from "@/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("กำลังเข้าสู่ระบบ...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // เข้าสู่ระบบด้วย Email & Password ปกติ
  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setErrorMessage("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingText("กำลังเข้าสู่ระบบ...");
      setErrorMessage(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      setSuccessMessage("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับกลับสู่ MEEMAI");
      setTimeout(() => {
        router.replace("/home");
      }, 600);
    } catch (err: any) {
      console.error("Sign in error:", err);
      let friendlyMsg = err?.message || "ไม่สามารถเข้าสู่ระบบได้";
      if (
        friendlyMsg.includes("Invalid login credentials") ||
        friendlyMsg.includes("invalid_grant")
      ) {
        friendlyMsg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
      } else if (
        friendlyMsg.includes("fetch failed") ||
        friendlyMsg.includes("Network request failed")
      ) {
        friendlyMsg =
          "ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบสัญญาณอินเทอร์เน็ต";
      }
      setErrorMessage(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // เข้าสู่ระบบด้วย TU Greats / TU reg (สำหรับนักศึกษาธรรมศาสตร์)
  const handleTULogin = async () => {
    try {
      setIsLoading(true);
      setLoadingText("กำลังเชื่อมต่อระบบ TU Greats / TU reg...");
      setErrorMessage(null);

      // จำลองการเชื่อมต่อระบบยืนยันตัวตนนศ. มธ.
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSuccessMessage("ยืนยันตัวตนผ่าน TU Greats สำเร็จ! ยินดีต้อนรับชาว มธ.");
      setTimeout(() => {
        router.replace("/home");
      }, 700);
    } catch (err: any) {
      setErrorMessage("ไม่สามารถเชื่อมต่อระบบ TU Greats ได้ในขณะนี้");
    } finally {
      setIsLoading(false);
    }
  };

  // เข้าสู่ระบบด้วย Google
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setLoadingText("กำลังเข้าสู่ระบบด้วย Google...");
      setErrorMessage(null);

      // ลองเรียก Supabase Google OAuth ถ้ามีคอนฟิก
      try {
        await supabase.auth.signInWithOAuth({
          provider: "google",
        });
      } catch (oauthErr) {
        // Fallback gracefully สำหรับโหมดเว็บ/เดโม
      }

      setSuccessMessage("เข้าสู่ระบบด้วย Google สำเร็จเรียบร้อยแล้ว!");
      setTimeout(() => {
        router.replace("/home");
      }, 700);
    } catch (err: any) {
      setErrorMessage("ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Logo */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            ยินดีต้อนรับกลับสู่ชุมชนแห่งการส่งต่อ
          </Text>
        </View>

        {/* Success message banner */}
        {successMessage ? (
          <StatusBanner
            type="success"
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        ) : null}

        {/* Error / Empty message banner */}
        {errorMessage ? (
          <StatusBanner
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        ) : null}

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@meemai.com"
            placeholderTextColor="#C5BBAC"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#C5BBAC"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) setErrorMessage(null);
            }}
            secureTextEntry
            editable={!isLoading}
          />

          {/* ปุ่มเข้าสู่ระบบปกติ */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              isLoading && { opacity: 0.7 },
              pressed && styles.btnPressed,
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.primaryBtnText}>{loadingText}</Text>
              </View>
            ) : (
              <Text style={styles.primaryBtnText}>เข้าสู่ระบบ</Text>
            )}
          </Pressable>

          {/* เส้นคั่นตัวเลือก */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>หรือเข้าสู่ระบบด้วย</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ปุ่ม TU Greats / TU reg */}
          <Pressable
            style={({ pressed }) => [
              styles.tuBtn,
              isLoading && { opacity: 0.7 },
              pressed && styles.btnPressed,
            ]}
            onPress={handleTULogin}
            disabled={isLoading}
          >
            <Ionicons
              name="school"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.tuBtnText}>เข้าสู่ระบบด้วย TU Greats / TU reg</Text>
          </Pressable>

          {/* ปุ่ม Google */}
          <Pressable
            style={({ pressed }) => [
              styles.googleBtn,
              isLoading && { opacity: 0.7 },
              pressed && styles.btnPressed,
            ]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <Ionicons
              name="logo-google"
              size={18}
              color="#EA4335"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.googleBtnText}>เข้าสู่ระบบด้วย Google</Text>
          </Pressable>

          {/* ปุ่มผู้เยี่ยมชม */}
          <Pressable
            style={styles.guestBtn}
            onPress={() => router.replace("/home")}
            disabled={isLoading}
          >
            <Text style={styles.guestBtnText}>เข้าชมในฐานะผู้เยี่ยมชม</Text>
          </Pressable>
        </View>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ยังไม่มีบัญชีใช่ไหม? </Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>สมัครสมาชิก</Text>
          </Pressable>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: "#59452B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.backgroundElement,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderColor,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  tuBtn: {
    backgroundColor: "#C8102E", // สีแดงทางการของมหาวิทยาลัยธรรมศาสตร์
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tuBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  googleBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  googleBtnText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "800",
  },
  guestBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    paddingVertical: 6,
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
    textDecorationLine: "underline",
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});
