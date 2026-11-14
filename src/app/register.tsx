import { StatusBanner, SuccessState } from "@/components/UIState";
import { COLORS } from "@/constants/theme";
import { supabase } from "@/supabase";
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

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async () => {
    // Empty field validations
    if (!fullName.trim()) {
      setErrorMessage("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("กรุณากรอกอีเมล");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const username = email.trim().split("@")[0];

      // สมัครสมาชิกกับ Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            username: username,
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            username: username,
            email: email.trim(),
            phone: phone.trim(),
            bio: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Auto-insert profile warning:", dbErr);
        }
      }

      // Success State
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Register error:", err);
      let friendlyMsg = err?.message || "ไม่สามารถสมัครสมาชิกได้";
      if (friendlyMsg.includes("User already registered")) {
        friendlyMsg = "อีเมลนี้ถูกลงทะเบียนไว้ในระบบแล้ว กรุณาเข้าสู่ระบบ";
      } else if (
        friendlyMsg.includes("fetch failed") ||
        friendlyMsg.includes("Network request failed")
      ) {
        friendlyMsg =
          "ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต";
      }
      setErrorMessage(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>สมัครสมาชิก</Text>
          <Text style={styles.subtitle}>
            เริ่มใช้งาน MEEMAI ง่าย ๆ เพียงไม่กี่ขั้นตอน
          </Text>
        </View>

        {/* Success State */}
        {isSuccess ? (
          <SuccessState
            title="สมัครสมาชิกสำเร็จเรียบร้อย!"
            message={`ยินดีต้อนรับคุณ ${fullName} เข้าสู่ครอบครัว MEEMAI เริ่มต้นแบ่งปันและค้นหาสิ่งของได้เลย`}
            actionLabel="เริ่มต้นใช้งานแอป"
            onAction={() => router.replace("/home")}
          />
        ) : (
          <>
            {/* Error / Empty Validation Banner */}
            {errorMessage ? (
              <StatusBanner
                type="error"
                message={errorMessage}
                onDismiss={() => setErrorMessage(null)}
              />
            ) : null}

            {/* Card Form */}
            <View style={styles.card}>
              <Text style={styles.label}>ชื่อ-นามสกุล *</Text>
              <TextInput
                style={styles.input}
                placeholder="กรอกชื่อ-นามสกุล"
                placeholderTextColor="#C5BBAC"
                value={fullName}
                onChangeText={(t) => {
                  setFullName(t);
                  if (errorMessage) setErrorMessage(null);
                }}
                editable={!isLoading}
              />

              <Text style={styles.label}>อีเมล (ใช้สำหรับรับโค้ด/แจ้งเตือน) *</Text>
              <TextInput
                style={styles.input}
                placeholder="example@meemai.com"
                placeholderTextColor="#C5BBAC"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errorMessage) setErrorMessage(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />

              <Text style={styles.label}>เบอร์โทรศัพท์</Text>
              <TextInput
                style={styles.input}
                placeholder="08X-XXX-XXXX"
                placeholderTextColor="#C5BBAC"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!isLoading}
              />

              <Text style={styles.label}>รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) *</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#C5BBAC"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
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
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.primaryBtnText}>กำลังสร้างบัญชีผู้ใช้...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryBtnText}>สมัครสมาชิก</Text>
                )}
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>มีบัญชีอยู่แล้วใช่ไหม? </Text>
              <Pressable onPress={() => router.push("/signin")}>
                <Text style={styles.signInLink}>เข้าสู่ระบบ</Text>
              </Pressable>
            </View>
          </>
        )}
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
    paddingVertical: 36,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
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
    textAlign: "center",
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
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  signInLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});
