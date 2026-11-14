import {
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBanner,
} from "@/components/UIState";
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
import { NEARBY_ITEMS } from "./home";

const CATEGORIES = [
  "ทั้งหมด",
  "เสื้อผ้า",
  "ไอที",
  "ของใช้",
  "หนังสือ",
  "เครื่องประดับ",
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const filteredItems = NEARBY_ITEMS.filter((item) => {
    if (selectedCategory !== "ทั้งหมด" && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }
    return true;
  });

  const handleRefresh = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessBanner("อัปเดตผลการสำรวจสินค้าเรียบร้อยแล้ว");
    }, 400);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/home" as any);
            }
          }}
          accessibilityLabel="ย้อนกลับ"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle}>สำรวจสิ่งของรอบตัว</Text>

        <Pressable
          style={styles.backBtn}
          onPress={handleRefresh}
          accessibilityLabel="รีเฟรชการค้นหา"
        >
          <Ionicons name="refresh" size={18} color={COLORS.primary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Banners */}
        {successBanner ? (
          <StatusBanner
            type="success"
            message={successBanner}
            onDismiss={() => setSuccessBanner(null)}
          />
        ) : null}

        {errorMessage ? (
          <StatusBanner
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        ) : null}

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาชื่อสินค้า หมวดหมู่ หรือคำอธิบาย..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={(t) => {
              setSearchQuery(t);
              if (errorMessage) setErrorMessage(null);
            }}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <Ionicons
                name="close-circle"
                size={18}
                color={COLORS.textMuted}
              />
            </Pressable>
          ) : null}
        </View>

        {/* Categories Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            รายการสินค้า ({filteredItems.length})
          </Text>
          {(searchQuery || selectedCategory !== "ทั้งหมด") && (
            <Pressable
              onPress={() => {
                setSearchQuery("");
                setSelectedCategory("ทั้งหมด");
              }}
            >
              <Text style={styles.clearFilterText}>ล้างตัวกรอง</Text>
            </Pressable>
          )}
        </View>

        {/* 4 UI States */}
        {isLoading ? (
          <LoadingState
            message="กำลังค้นหาและสำรวจสินค้า..."
            subMessage="กำลังรวบรวมของดีจากเพื่อนๆ ใน มธ."
          />
        ) : errorMessage ? (
          <ErrorState
            title="เกิดข้อผิดพลาดในการสำรวจ"
            message={errorMessage}
            onRetry={handleRefresh}
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="ไม่พบสิ่งของที่คุณค้นหา"
            message={
              searchQuery
                ? `ไม่มีรายการที่ตรงกับคำว่า "${searchQuery}" ในหมวดหมู่นี้`
                : "ยังไม่มีรายการสินค้าในหมวดหมู่นี้"
            }
            actionLabel="ล้างการค้นหาทั้งหมด"
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("ทั้งหมด");
            }}
            secondaryActionLabel="ลงประกาศสิ่งของของคุณ"
            onSecondaryAction={() => router.push("/create" as any)}
          />
        ) : (
          <View style={styles.grid}>
            {filteredItems.map((item) => (
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
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{item.type}</Text>
                  </View>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                  <Text style={styles.itemLoc}>{item.location}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginTop: 6,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  categoriesRow: { flexDirection: "row", marginBottom: 16 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: "600" },
  categoryChipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  clearFilterText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemCard: {
    width: "48%",
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginBottom: 14,
    shadowColor: "#59452B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImg: {
    width: "100%",
    height: 130,
    backgroundColor: COLORS.backgroundElement,
  },
  itemBody: { padding: 10 },
  tagBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFEEDB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  tagBadgeText: { fontSize: 10, fontWeight: "700", color: COLORS.primary },
  itemTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary },
  itemPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 4,
  },
  itemLoc: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
});
