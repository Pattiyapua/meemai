import { COLORS } from "@/constants/theme";
import { supabase } from "@/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      const msg = "กรุณากรอกอีเมลและรหัสผ่าน";
      setErrorMessage(msg);
      if (Platform.OS === "web") {
        window.alert(msg);
      } else {
        Alert.alert("แจ้งเตือน", msg);
      }
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      // เข้าสู่ระบบสำเร็จ
      router.replace("/home");
    } catch (err: any) {
      console.error("Sign in error:", err);
      let friendlyMsg = err?.message || "ไม่สามารถเข้าสู่ระบบได้";
      if (friendlyMsg.includes("Invalid login credentials")) {
        friendlyMsg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      } else if (friendlyMsg.includes("fetch failed")) {
        friendlyMsg =
          "ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือสถานะ Supabase";
      }
      setErrorMessage(friendlyMsg);
      if (Platform.OS === "web") {
        window.alert(friendlyMsg);
      } else {
        Alert.alert("เข้าสู่ระบบไม่สำเร็จ", friendlyMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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

        {/* Error message banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={COLORS.primary} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

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
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>เข้าสู่ระบบ</Text>
            )}
          </Pressable>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDECEA",
    borderWidth: 1,
    borderColor: "#F5C6CB",
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: "#59452B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  guestBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 8,
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
    textDecorationLine: "underline",
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.orange,
  },
});
