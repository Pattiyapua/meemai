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

// ข้อมูลจำลองภายในไฟล์ป้องกัน Circular Dependency
const ITEMS_DATA = [
  {
    id: "1",
    title: "กระเป๋าผ้า Uniqlo สภาพดี",
    price: "฿120",
    type: "ขาย",
    location: "ท่าพระจันทร์ • 1.2 กม.",
    description:
      "กระเป๋าผ้า Uniqlo สีเบจ สภาพดีมาก ใช้น้อย ขนาดกำลังดีใส่โน้ตบุ๊กได้พอดีครับ",
    seller: "Nuania",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500",
    isFree: false,
  },
  {
    id: "2",
    title: "หูฟังไร้สายพร้อมกล่อง",
    price: "ฟรี",
    type: "ให้ฟรี",
    location: "รังสิต • 800 ม.",
    description:
      "หูฟังบลูทูธมือสอง สภาพยังใช้งานได้ดี เสียงดี แบตเตอรี่ยังอึด ส่งต่อฟรีสำหรับคนจำเป็นต้องใช้ครับ",
    seller: "Ploy",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    isFree: true,
  },
  {
    id: "3",
    title: "กล้องฟิล์มสไตล์วินเทจ",
    price: "฿50 / วัน",
    type: "ให้ยืม",
    location: "ท่าพระจันทร์ • 500 ม.",
    description:
      "กล้องฟิล์มพร้อมเลนส์ เหมาะสำหรับเอาไปถ่ายเล่นทริปสั้นๆ นัดรับได้หน้า มธ.",
    seller: "Tawan",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
    isFree: false,
  },
  {
    id: "4",
    title: "หนังสือออกแบบ UI/UX สภาพ 98%",
    price: "฿150",
    type: "ขาย",
    location: "รังสิต • 2.5 กม.",
    description:
      "หนังสือภาษาไทย อ่านง่าย เหมาะสำหรับผู้เริ่มต้นศึกษาด้าน Design System",
    seller: "Korn",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    isFree: false,
  },
];

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // ค้นหาสินค้าจาก id ที่ส่งเข้ามา
  const item = ITEMS_DATA.find((i) => i.id === id) || ITEMS_DATA[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>รายละเอียดสินค้า</Text>
        <Pressable style={styles.backBtn}>
          <Ionicons name="heart-outline" size={20} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image source={{ uri: item.image }} style={styles.productImg} />

        <View style={styles.contentCard}>
          <View style={styles.badgeRow}>
            <View style={[styles.typeBadge, item.isFree && styles.freeBadge]}>
              <Text style={[styles.typeText, item.isFree && styles.freeText]}>
                {item.type}
              </Text>
            </View>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>

          <Text style={styles.titleText}>{item.title}</Text>

          <View style={styles.locRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textMuted}
            />
            <Text style={styles.locText}>{item.location}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>ผู้ประกาศ</Text>
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.seller.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>{item.seller}</Text>
              <Text style={styles.sellerSub}>
                ยืนยันตัวตนด้วย TU Greats แล้ว
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>รายละเอียดสินค้า</Text>
          <Text style={styles.descText}>{item.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.contactBtn,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => alert(`เริ่มต้นพูดคุยกับคุณ ${item.seller}`)}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.contactBtnText}>ติดต่อผู้ขาย</Text>
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
  scrollContent: { paddingBottom: 100 },
  productImg: { width: "100%", height: 280 },
  contentCard: {
    backgroundColor: COLORS.cardBg,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeBadge: {
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeBadge: { backgroundColor: "#E8F5E9" },
  typeText: { fontSize: 12, fontWeight: "800", color: COLORS.textPrimary },
  freeText: { color: "#2E7D32" },
  priceText: { fontSize: 22, fontWeight: "900", color: COLORS.primary },
  titleText: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  locRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  locText: { fontSize: 13, color: COLORS.textMuted, marginLeft: 4 },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  sellerRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: "#FFFFFF", fontWeight: "900", fontSize: 18 },
  sellerName: { fontSize: 15, fontWeight: "800", color: COLORS.textPrimary },
  sellerSub: { fontSize: 11, color: "#2E7D32", marginTop: 2 },
  descText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: COLORS.borderColor,
  },
  contactBtn: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contactBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
