import { EmptyState, ErrorState, LoadingState, StatusBanner } from "@/components/UIState";
import { COLORS } from "@/constants/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORIES = [
  {
    id: "all",
    name: "ทั้งหมด",
    icon: "grid-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "เสื้อผ้า",
    name: "เสื้อผ้า",
    icon: "shirt-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "ไอที",
    name: "ไอที",
    icon: "laptop-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "ของใช้",
    name: "ของใช้",
    icon: "home-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "หนังสือ",
    name: "หนังสือ",
    icon: "book-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "เครื่องประดับ",
    name: "เครื่องประดับ",
    icon: "watch-outline" as keyof typeof Ionicons.glyphMap,
  },
];

export const NEARBY_ITEMS = [
  {
    id: "1",
    title: "กระเป๋าผ้า Uniqlo สภาพดี",
    price: "฿120",
    type: "ขาย",
    category: "ของใช้",
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
    category: "ไอที",
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
    category: "ไอที",
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
    category: "หนังสือ",
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemList, setItemList] = useState([...NEARBY_ITEMS]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadItems = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      // จำลองการโหลดข้อมูลให้เห็นสถานะและพร้อมดึงข้อมูลล่าสุด
      await new Promise((resolve) => setTimeout(resolve, 600));

      setItemList([...NEARBY_ITEMS]);
      if (isRefresh) {
        setSuccessMessage("อัปเดตรายการสินค้าล่าสุดเรียบร้อยแล้ว");
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || "ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setItemList([...NEARBY_ITEMS]);
    }, []),
  );

  const filteredItems = itemList.filter((item) => {
    // กรองคำค้นหา
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }

    // 📍 กรองประเภท "ขาย", "ให้ฟรี", และ "ให้ยืม"
    if (selectedFilter === "ขาย") return item.type === "ขาย";
    if (selectedFilter === "ให้ฟรี")
      return item.isFree || item.type === "ให้ฟรี";
    if (selectedFilter === "ให้ยืม") return item.type === "ให้ยืม";
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.smallLogo}
          resizeMode="contain"
        />
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={14} color={COLORS.primary} />
          <Text style={styles.locationText}>ท่าพระจันทร์ • มธ.</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => loadItems(true)}
            accessibilityLabel="รีเฟรชข้อมูล"
          >
            <Ionicons name="refresh" size={18} color={COLORS.primary} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { marginLeft: 8 }]}
            onPress={() => router.push("/explore" as any)}
            accessibilityLabel="สำรวจสิ่งของ"
          >
            <Ionicons name="compass-outline" size={20} color={COLORS.primary} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { marginLeft: 8 }]}
            onPress={() => router.push("/create" as any)}
            accessibilityLabel="ลงประกาศ"
          >
            <Feather name="plus-circle" size={20} color={COLORS.primary} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { marginLeft: 8 }]}
            onPress={() => router.push("/profile" as any)}
            accessibilityLabel="โปรไฟล์ผู้ใช้งาน"
          >
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadItems(true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Status Banner เมื่อทำรายการสำเร็จหรือแจ้งเตือน */}
        {successMessage ? (
          <StatusBanner
            type="success"
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
            style={{ marginTop: 12 }}
          />
        ) : null}

        {/* Error Banner */}
        {errorMessage ? (
          <StatusBanner
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            style={{ marginTop: 12 }}
          />
        ) : null}

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="ค้นหาสินค้าใกล้ตัว, ประเภทสินค้า..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>หมวดหมู่แนะนำ</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <View
                  style={[
                    styles.categoryIconBg,
                    isActive && styles.categoryIconBgActive,
                  ]}
                >
                  <Ionicons
                    name={cat.icon}
                    size={22}
                    color={isActive ? "#FFFFFF" : COLORS.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.bannerCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTag}>ของดีใกล้ตัว</Text>
            <Text style={styles.bannerTitle}>รอให้คุณเป็นเจ้าของ</Text>
            <Text style={styles.bannerSub}>ราคาดี - ให้ฟรี - ให้ยืม</Text>
          </View>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.bannerImg}
            resizeMode="contain"
          />
        </View>

        {/* 📍 เพิ่ม "ขาย" เข้าในแถบปุ่มกดกรองประเภท */}
        <View style={styles.filterRow}>
          {["ทั้งหมด", "ขาย", "ให้ฟรี", "ให้ยืม"].map((filter) => (
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

        <View style={styles.grid}>
          {isLoading ? (
            <LoadingState
              message="กำลังโหลดรายการสินค้าใกล้ตัว..."
              subMessage="รอสักครู่ ระบบกำลังค้นหาของดีรอบตัวคุณ"
            />
          ) : errorMessage ? (
            <ErrorState
              title="โหลดรายการสินค้าไม่สำเร็จ"
              message={errorMessage}
              onRetry={() => loadItems(false)}
            />
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Pressable
                key={item.id}
                style={styles.itemCard}
                onPress={() => router.push(`/detail/${item.id}` as any)}
              >
                <Image
                  source={
                    typeof item.image === "string"
                      ? { uri: item.image }
                      : item.image
                  }
                  style={styles.itemImg}
                />
                <View style={styles.itemBody}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.itemFooter}>
                    <Text
                      style={[
                        styles.itemPrice,
                        item.isFree && styles.freePrice,
                      ]}
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
            ))
          ) : (
            <EmptyState
              icon="cube-outline"
              title="ไม่มีข้อมูลสินค้า"
              message={
                searchQuery
                  ? `ไม่พบสินค้าที่ตรงกับคำว่า "${searchQuery}"`
                  : "ยังไม่มีสินค้าในหมวดหมู่ที่เลือก ลองล้างตัวกรองหรือลงประกาศส่งต่อสิ่งของเป็นคนแรก"
              }
              actionLabel="ล้างตัวกรองทั้งหมด"
              onAction={() => {
                setSelectedCategory("all");
                setSelectedFilter("ทั้งหมด");
                setSearchQuery("");
              }}
              secondaryActionLabel="ลงประกาศสิ่งของ"
              onSecondaryAction={() => router.push("/create" as any)}
            />
          )}
        </View>
      </ScrollView>

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
  categoryIconBgActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: { fontSize: 11, fontWeight: "700", color: COLORS.textPrimary },
  categoryTextActive: { color: COLORS.primary, fontWeight: "900" },
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
    minHeight: 180,
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
  emptyBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: { fontSize: 13, color: COLORS.textMuted, fontWeight: "700" },
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
