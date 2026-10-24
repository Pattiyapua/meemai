import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

        {/* Card Form */}
        <View style={styles.card}>
          <Text style={styles.label}>ชื่อ-นามสกุล</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกชื่อ-นามสกุล"
            placeholderTextColor="#C5BBAC"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>อีเมล (ใช้สำหรับรับโค้ด/แจ้งเตือน)</Text>
          <TextInput
            style={styles.input}
            placeholder="example@meemai.com"
            placeholderTextColor="#C5BBAC"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>เบอร์โทรศัพท์</Text>
          <TextInput
            style={styles.input}
            placeholder="08X-XXX-XXXX"
            placeholderTextColor="#C5BBAC"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>รหัสผ่าน</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#C5BBAC"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => router.replace("/home")}
          >
            <Text style={styles.primaryBtnText}>สมัครสมาชิก</Text>
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
  header: { alignItems: "center", marginBottom: 20 },
  logo: { width: 100, height: 100, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "900", color: COLORS.primary },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
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
    marginBottom: 6,
    marginTop: 10,
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
  tuBtn: {
    backgroundColor: "#C8102E", // สีแดง TU
    borderRadius: 16,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tuBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  googleBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  googleBtnText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: "800" },
  btnPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.borderColor },
  dividerText: { marginHorizontal: 10, fontSize: 12, color: COLORS.textMuted },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { fontSize: 13, color: COLORS.textMuted },
  linkText: { fontSize: 13, fontWeight: "800", color: COLORS.orange },
});
