import {
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBanner,
} from "@/components/UIState";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [item, setItem] = useState<(typeof NEARBY_ITEMS)[0] | null>(null);

  const loadItemDetail = () => {
    setIsLoading(true);
    setErrorMessage(null);

    // จำลองการดึงข้อมูลจาก API / Storage
    setTimeout(() => {
      try {
        const found = NEARBY_ITEMS.find((i) => i.id === id);
        if (found) {
          setItem(found);
        } else {
          setItem(null);
        }
      } catch (err: any) {
        setErrorMessage(
          err?.message || "เกิดข้อผิดพลาดในการโหลดรายละเอียดสินค้า"
        );
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  useEffect(() => {
    loadItemDetail();
  }, [id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setSuccessMessage(
      !isFavorite
        ? "บันทึกสินค้าลงในรายการโปรดเรียบร้อย"
        : "นำสินค้าออกจากรายการโปรดแล้ว"
    );
  };

  const handleShare = () => {
    setSuccessMessage("คัดลอกลิงก์สำหรับแชร์เรียบร้อยแล้ว!");
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

        <Text style={styles.headerTitle}>รายละเอียดสินค้า</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            style={styles.backBtn}
            onPress={handleToggleFavorite}
            accessibilityLabel="บันทึกรายการโปรด"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? COLORS.primary : COLORS.textPrimary}
            />
          </Pressable>
          <Pressable
            style={styles.backBtn}
            onPress={handleShare}
            accessibilityLabel="แชร์สินค้า"
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={COLORS.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      {/* Main Content with 4 UI States */}
      {isLoading ? (
        <LoadingState
          fullScreen
          message="กำลังโหลดรายละเอียดสินค้า..."
          subMessage="กรุณารอสักครู่ MEEMAI กำลังดึงข้อมูลสินค้าให้คุณ"
        />
      ) : errorMessage ? (
        <ScrollView contentContainerStyle={styles.centerPadded}>
          <ErrorState
            title="เกิดข้อผิดพลาด"
            message={errorMessage}
            onRetry={loadItemDetail}
            secondaryActionLabel="กลับหน้าหลัก"
            onSecondaryAction={() => router.replace("/home" as any)}
          />
        </ScrollView>
      ) : !item ? (
        <ScrollView contentContainerStyle={styles.centerPadded}>
          <EmptyState
            icon="cube-outline"
            title="ไม่พบสินค้านี้"
            message="สินค้าชิ้นนี้อาจถูกส่งต่อแล้ว หรือไม่มีอยู่ในระบบ MEEMAI"
            actionLabel="กลับสู่หน้าหลัก"
            onAction={() => router.replace("/home" as any)}
          />
        </ScrollView>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* Success Banner */}
            {successMessage ? (
              <StatusBanner
                type="success"
                message={successMessage}
                onDismiss={() => setSuccessMessage(null)}
                style={{ marginBottom: 12 }}
              />
            ) : null}

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
                  <Text style={styles.sellerSub}>นักศึกษา • ม.ธรรมศาสตร์</Text>
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
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerPadded: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
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
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  content: { padding: 20, paddingBottom: 100 },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: COLORS.backgroundElement,
  },
  detailsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: "#FFEEDB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: { fontSize: 12, fontWeight: "700", color: COLORS.primary },
  categoryText: { fontSize: 13, color: COLORS.textMuted },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  price: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 12,
  },
  freePrice: { color: COLORS.orange },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  locationText: { fontSize: 13, color: COLORS.textMuted, marginLeft: 4 },
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
    backgroundColor: COLORS.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: "700", color: COLORS.primary },
  sellerName: { fontSize: 15, fontWeight: "700", color: COLORS.textPrimary },
  sellerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  chatBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 14,
    gap: 8,
  },
  chatBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
