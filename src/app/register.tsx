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

  const handleRegister = async () => {
    if (!fullName.trim()) {
      const msg = "กรุณากรอกชื่อ-นามสกุล";
      setErrorMessage(msg);
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("แจ้งเตือน", msg);
      return;
    }

    if (!email.trim()) {
      const msg = "กรุณากรอกอีเมล";
      setErrorMessage(msg);
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("แจ้งเตือน", msg);
      return;
    }

    if (!password || password.length < 6) {
      const msg = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
      setErrorMessage(msg);
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("แจ้งเตือน", msg);
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
        // บันทึกข้อมูลเริ่มต้นลงในตาราง profiles ของ Supabase
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

      const successMsg =
        "สมัครสมาชิกสำเร็จเรียบร้อยแล้ว ยินดีต้อนรับสู่ MEEMAI!";
      if (Platform.OS === "web") {
        window.alert(successMsg);
        router.replace("/home");
      } else {
        Alert.alert("สำเร็จ", successMsg, [
          { text: "เริ่มต้นใช้งาน", onPress: () => router.replace("/home") },
        ]);
      }
    } catch (err: any) {
      console.error("Register error:", err);
      let friendlyMsg = err?.message || "ไม่สามารถสมัครสมาชิกได้";
      if (friendlyMsg.includes("User already registered")) {
        friendlyMsg = "อีเมลนี้ถูกลงทะเบียนไว้ในระบบแล้ว กรุณาเข้าสู่ระบบ";
      } else if (friendlyMsg.includes("fetch failed")) {
        friendlyMsg =
          "ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือสถานะ Supabase";
      }
      setErrorMessage(friendlyMsg);
      if (Platform.OS === "web") {
        window.alert(friendlyMsg);
      } else {
        Alert.alert("สมัครสมาชิกไม่สำเร็จ", friendlyMsg);
      }
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

        {/* Error banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={COLORS.primary} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

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
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>สมัครสมาชิก</Text>
            )}
          </Pressable>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>หรือสมัครด้วย</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ปุ่ม TU Greats */}
          <Pressable
            style={({ pressed }) => [
              styles.tuBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => router.replace("/home")}
            disabled={isLoading}
          >
            <Text style={styles.tuBtnText}>เชื่อมต่อด้วย TU Greats</Text>
          </Pressable>

          {/* ปุ่ม Google */}
          <Pressable
            style={({ pressed }) => [
              styles.googleBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => router.replace("/home")}
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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>มีบัญชีอยู่แล้ว? </Text>
          <Pressable onPress={() => router.push("/signin")}>
            <Text style={styles.linkText}>เข้าสู่ระบบ</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 24, paddingVertical: 20 },
  header: { alignItems: "center", marginBottom: 16 },
  logo: { width: 95, height: 95, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "900", color: COLORS.primary },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
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
    padding: 20,
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
    marginBottom: 4,
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
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
    paddingHorizontal: 10,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  tuBtn: {
    backgroundColor: "#FFE5E5",
    borderWidth: 1,
    borderColor: "#FFCDD2",
    borderRadius: 14,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tuBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  googleBtn: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    borderRadius: 14,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtnText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.orange,
  },
});
