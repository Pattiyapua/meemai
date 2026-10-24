import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LandingScreen() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ป้องกัน SSR Hydration Mismatch บน Web แบบปลอดภัย
  if (Platform.OS === "web" && !isClient) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* Top Brand Header */}
        <View style={styles.topSection}>
          <Text style={styles.eyebrow}>A LITTLE THING, A BIG CHANGE</Text>

          <Image
            source={require("../../assets/top.png")}
            style={styles.topHeaderImage}
            resizeMode="contain"
          />

          <View style={styles.brandLine} />

          <Text style={styles.tagline}>Share more, waste less.</Text>

          <Text style={styles.description} accessibilityLanguage="th">
            {"ส่งต่อสิ่งของที่มีคุณค่า\nค้นพบสิ่งใหม่ในแบบของคุณ"}
          </Text>
        </View>

        {/* Illustration Card Area */}
        <View style={styles.illustration}>
          <View style={styles.yellowBlob} />
          <View style={styles.coralBlob} />
          <View style={styles.orangeBlob} />

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardDot} />
              <Text style={styles.cardLabel}>GIVE IT A NEW LIFE</Text>
            </View>

            <Image
              source={require("../../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Text style={styles.cardTitle}>Good things,</Text>
            <Text style={styles.cardTitleAccent}>shared again.</Text>

            <View style={styles.cardFooter}>
              <View style={styles.footerLine} />
              <Text style={styles.footerLabel}>MEEMAI COMMUNITY</Text>
            </View>
          </View>

          <View style={styles.floatingCircle} />
          <View style={styles.floatingSquare} />
        </View>

        {/* Action Button */}
        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/signin" as any)}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <View style={styles.arrowCircle}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </Pressable>

          <Text style={styles.footer}>FIND IT. SHARE IT. LOVE IT AGAIN.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9ED",
  },
  content: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: 18,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#9B8D7A",
  },
  topHeaderImage: {
    width: 200,
    height: 70,
    marginTop: 20,
  },
  brandLine: {
    width: 35,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFD600",
    marginTop: 8,
  },
  tagline: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#292522",
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: "#776B5D",
  },
  illustration: {
    width: "100%",
    maxWidth: 330,
    height: 300,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  yellowBlob: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#FFD600",
    top: 5,
    left: 3,
  },
  coralBlob: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#B90000",
    bottom: 8,
    right: 0,
  },
  orangeBlob: {
    position: "absolute",
    width: 75,
    height: 75,
    borderRadius: 24,
    backgroundColor: "#FF7952",
    top: 28,
    right: 12,
    transform: [{ rotate: "18deg" }],
  },
  card: {
    width: "78%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 19,
    paddingVertical: 19,
    borderWidth: 1,
    borderColor: "#F0E5D2",
    elevation: 8,
    shadowColor: "#59452B",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    transform: [{ rotate: "-3deg" }],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF7952",
    marginRight: 8,
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#9B8D7A",
  },
  logoImage: {
    width: 120,
    height: 110,
    alignSelf: "center",
    marginVertical: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#292522",
    letterSpacing: -0.5,
  },
  cardTitleAccent: {
    marginTop: 1,
    fontSize: 18,
    fontWeight: "900",
    color: "#B90000",
    letterSpacing: -0.5,
  },
  cardFooter: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  footerLine: {
    width: 25,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFD600",
    marginRight: 8,
  },
  footerLabel: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#9B8D7A",
  },
  floatingCircle: {
    position: "absolute",
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#FF7952",
    top: 36,
    left: 20,
  },
  floatingSquare: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#FFD600",
    bottom: 25,
    left: 36,
    transform: [{ rotate: "18deg" }],
  },
  bottomSection: {
    alignItems: "center",
  },
  button: {
    width: "100%",
    maxWidth: 330,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#B90000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    elevation: 4,
    shadowColor: "#B90000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  arrowCircle: {
    position: "absolute",
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFD600",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    color: "#292522",
    fontSize: 22,
    fontWeight: "600",
    marginTop: -2,
  },
  footer: {
    marginTop: 14,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#9B8D7A",
  },
});
