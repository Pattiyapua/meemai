import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
// 📍 ดึงข้อมูลสินค้าตัวล่าสุดจากหน้า Home มาใช้งาน
import { NEARBY_ITEMS } from "../home";

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 📍 ค้นหาสินค้าจาก ID ที่ถูกส่งมาจากหน้า Home
  const item = NEARBY_ITEMS.find((i) => i.id === id) || NEARBY_ITEMS[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>รายละเอียดสินค้า</Text>
        <Pressable style={styles.backBtn}>
          <Ionicons
            name="share-social-outline"
            size={20}
            color={COLORS.textPrimary}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* รูปภาพสินค้า */}
        <Image
          source={
            typeof item.image === "string" ? { uri: item.image } : item.image
          }
          style={styles.image}
          resizeMode="cover"
        />

        {/* ข้อมูลสินค้า */}
        <View style={styles.detailsCard}>
          <View style={styles.tagRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{item.type}</Text>
            </View>
            <Text style={styles.categoryText}>
              หมวดหมู่: {item.category || "ทั่วไป"}
            </Text>
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={[styles.price, item.isFree && styles.freePrice]}>
            {item.price}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textMuted}
            />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>

          <View style={styles.divider} />

          {/* ข้อมูลผู้ขาย */}
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.seller ? item.seller[0].toUpperCase() : "U"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>
                {item.seller || "ผู้ใช้งาน MEEMAI"}
              </Text>
              <Text style={styles.sellerSub}>นักศึกษา • มธรรมศาสตร์</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* รายละเอียด */}
          <Text style={styles.sectionHeader}>รายละเอียดสิ่งของ</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </ScrollView>

      {/* ปุ่มกดทักแชท */}
      <View style={styles.footer}>
        <Pressable
          style={styles.chatBtn}
          onPress={() => router.push(`/chat/${item.id}` as any)}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.chatBtnText}>ส่งข้อความพูดคุย / นัดรับ</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.cardBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textPrimary },
  content: { paddingBottom: 100 },
  image: { width: "100%", height: 260 },
  detailsCard: {
    backgroundColor: COLORS.cardBg,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  categoryText: { fontSize: 12, color: COLORS.textMuted, fontWeight: "700" },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 8,
  },
  freePrice: { color: "#2E7D32" },
  locationRow: { flexDirection: "row", alignItems: "center" },
  locationText: { fontSize: 12, color: COLORS.textMuted, marginLeft: 4 },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: 16,
  },
  sellerRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  sellerName: { fontSize: 14, fontWeight: "800", color: COLORS.textPrimary },
  sellerSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  description: { fontSize: 13, color: COLORS.textMuted, lineHeight: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: COLORS.borderColor,
  },
  chatBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chatBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
  },
});
