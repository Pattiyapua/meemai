import { COLORS } from "@/constants/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
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

const CATEGORIES = [
  {
    id: "1",
    name: "เสื้อผ้า",
    icon: "shirt-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "2",
    name: "ไอที",
    icon: "laptop-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "3",
    name: "ของใช้",
    icon: "home-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "4",
    name: "หนังสือ",
    icon: "book-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "5",
    name: "เครื่องประดับ",
    icon: "watch-outline" as keyof typeof Ionicons.glyphMap,
  },
];

// Export ข้อมูลเพื่อให้หน้า Detail นำไปดึงใช้งานได้
export const NEARBY_ITEMS = [
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

export default function HomeScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("ทั้งหมด");

  const filteredItems = NEARBY_ITEMS.filter((item) => {
    if (selectedFilter === "ให้ฟรี") return item.isFree;
    if (selectedFilter === "ให้ยืม") return item.type === "ให้ยืม";
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.smallLogo}
          resizeMode="contain"
        />
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={14} color={COLORS.primary} />
          <Text style={styles.locationText}>ท่าพระจันทร์ • มธ.</Text>
        </View>
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push("/create" as any)}
        >
          <Feather name="plus-circle" size={20} color={COLORS.primary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="ค้นหาสินค้าใกล้ตัว, ประเภทสินค้า..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
          />
        </View>

        {/* Categories Grid */}
        <Text style={styles.sectionTitle}>หมวดหมู่แนะนำ</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => (
            <Pressable key={cat.id} style={styles.categoryCard}>
              <View style={styles.categoryIconBg}>
                <Ionicons name={cat.icon} size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Banner การ์ดแนะนำ */}
        <View style={styles.bannerCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTag}>ของดีใกล้ตัว</Text>
            <Text style={styles.bannerTitle}>รอให้คุณเป็นเจ้าของ</Text>
            <Text style={styles.bannerSub}>ราคาดี - ให้ฟรี - ให้ยืม</Text>
          </View>
          <Image
            source={require("@/assets/logo.png")}
            style={styles.bannerImg}
            resizeMode="contain"
          />
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {["ทั้งหมด", "ให้ฟรี", "ให้ยืม"].map((filter) => (
            <Pressable
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Items Grid */}
        <View style={styles.grid}>
          {filteredItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.itemCard}
              onPress={() => router.push(`/detail/${item.id}` as any)}
            >
              <Image source={{ uri: item.image }} style={styles.itemImg} />
              <View style={styles.itemBody}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.itemFooter}>
                  <Text
                    style={[styles.itemPrice, item.isFree && styles.freePrice]}
                  >
                    {item.price}
                  </Text>
                  <Ionicons
                    name="heart-outline"
                    size={16}
                    color={COLORS.textMuted}
                  />
                </View>
                <Text style={styles.itemLoc}>{item.location}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button สำหรับลงประกาศ */}
      <Pressable
        style={styles.fabBtn}
        onPress={() => router.push("/create" as any)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>ลงประกาศ</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 80 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  smallLogo: { width: 50, height: 35 },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.cardBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 10,
  },
  categoriesRow: { flexDirection: "row", marginBottom: 15 },
  categoryCard: { alignItems: "center", marginRight: 16 },
  categoryIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.cardBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginBottom: 6,
  },
  categoryText: { fontSize: 11, fontWeight: "700", color: COLORS.textPrimary },
  bannerCard: {
    backgroundColor: "#FFECC8",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.yellow,
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.orange,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 2,
  },
  bannerSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  bannerImg: { width: 60, height: 60 },
  filterRow: { flexDirection: "row", marginVertical: 12 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted },
  filterTextActive: { color: "#FFFFFF" },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  itemCard: {
    width: "48%",
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  itemImg: { width: "100%", height: 130 },
  itemBody: { padding: 10 },
  itemTitle: { fontSize: 13, fontWeight: "800", color: COLORS.textPrimary },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  itemPrice: { fontSize: 14, fontWeight: "900", color: COLORS.primary },
  freePrice: { color: "#2E7D32" },
  itemLoc: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  fabBtn: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14, marginLeft: 6 },
});
