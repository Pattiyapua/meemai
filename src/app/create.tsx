import {
  LoadingState,
  StatusBanner,
  SuccessState,
} from "@/components/UIState";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { NEARBY_ITEMS } from "./home";

const CATEGORY_LIST = [
  "เสื้อผ้า",
  "ไอที",
  "ของใช้",
  "หนังสือ",
  "เครื่องประดับ",
];

export default function CreateListingScreen() {
  const router = useRouter();
  const [type, setType] = useState<"ขาย" | "ให้ยืม" | "ให้ฟรี">("ขาย");
  const [category, setCategory] = useState("ของใช้");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newCreatedId, setNewCreatedId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setDescription("");
    setSelectedImage(null);
    setType("ขาย");
    setCategory("ของใช้");
    setIsSuccess(false);
    setErrorMessage(null);
  };

  const handlePickImage = async () => {
    try {
      setErrorMessage(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage({ uri: result.assets[0].uri });
      }
    } catch (err: any) {
      console.warn("Image picker warning, using placeholder:", err);
      // Fallback
      setSelectedImage(require("../../assets/logo.png"));
    }
  };

  const handlePost = async () => {
    // Empty state validation
    if (!title.trim()) {
      setErrorMessage("กรุณากรอกชื่อสินค้าหรือสิ่งของที่ต้องการส่งต่อ");
      return;
    }

    if (type !== "ให้ฟรี" && !price.trim()) {
      setErrorMessage("กรุณาระบุราคาหรือเลือก 'ให้ฟรี'");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Simulate network save delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const generatedId = Date.now().toString();
      const newItem = {
        id: generatedId,
        title: title.trim(),
        price: type === "ให้ฟรี" ? "ฟรี" : `฿${price.trim() || "0"}`,
        type: type,
        category: category,
        location: "ท่าพระจันทร์ • มธ.",
        description: description.trim() || "ไม่มีรายละเอียดเพิ่มเติม",
        seller: "ฉัน (ผู้ขาย)",
        image: selectedImage || require("../../assets/logo.png"),
        isFree: type === "ให้ฟรี",
      };

      NEARBY_ITEMS.unshift(newItem);
      setNewCreatedId(generatedId);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "เกิดข้อผิดพลาดในการลงประกาศ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          accessibilityLabel="ปิดหน้าจอ"
        >
          <Ionicons name="close" size={20} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>ลงประกาศสิ่งของ</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Success State */}
        {isSuccess ? (
          <SuccessState
            title="ลงประกาศสำเร็จเรียบร้อย!"
            message={`สิ่งของ "${title}" ถูกเพิ่มลงในระบบ MEEMAI เรียบร้อยแล้ว พร้อมให้เพื่อนๆ ในชุมชนติดต่อเข้ามา`}
            actionLabel="ดูสินค้าของคุณที่หน้าแรก"
            onAction={() => router.replace("/home" as any)}
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

            <Text style={styles.label}>ประเภทการส่งต่อ</Text>
            <View style={styles.typeRow}>
              {(["ขาย", "ให้ยืม", "ให้ฟรี"] as const).map((t) => (
                <Pressable
                  key={t}
                  style={[styles.typeOption, type === t && styles.typeActive]}
                  onPress={() => {
                    setType(t);
                    setErrorMessage(null);
                  }}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      type === t && styles.typeActiveText,
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>เลือกหมวดหมู่</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexDirection: "row", marginBottom: 6 }}
            >
              {CATEGORY_LIST.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.catChip,
                    category === cat && styles.catChipActive,
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setErrorMessage(null);
                  }}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      category === cat && styles.catChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.label}>รูปภาพสินค้า</Text>
            <Pressable
              style={styles.uploadBox}
              onPress={handlePickImage}
              disabled={isLoading}
            >
              {selectedImage ? (
                <Image
                  source={selectedImage}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <>
                  <Ionicons
                    name="camera-outline"
                    size={32}
                    color={COLORS.textMuted}
                  />
                  <Text style={styles.uploadText}>
                    คลิกเพื่อเลือกหรืออัปโหลดรูปภาพ
                  </Text>
                </>
              )}
            </Pressable>

            <Text style={styles.label}>ชื่อสินค้า / สิ่งของ *</Text>
            <TextInput
              style={styles.input}
              placeholder="เช่น กระเป๋าผ้า Uniqlo, หนังสือเรียน"
              placeholderTextColor="#C5BBAC"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errorMessage) setErrorMessage(null);
              }}
              editable={!isLoading}
            />

            {type !== "ให้ฟรี" && (
              <>
                <Text style={styles.label}>
                  {type === "ขาย" ? "ราคา (บาท) *" : "ราคาค่าเช่า/ยืม ต่อวัน (บาท) *"}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="เช่น 120"
                  placeholderTextColor="#C5BBAC"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={(text) => {
                    setPrice(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  editable={!isLoading}
                />
              </>
            )}

            <Text style={styles.label}>รายละเอียดเพิ่มเติม</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="บอกสภาพสินค้า จุดนัดรับ หรือเงื่อนไขเพิ่มเติม..."
              placeholderTextColor="#C5BBAC"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              editable={!isLoading}
            />

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                isLoading && { opacity: 0.7 },
                pressed && { opacity: 0.88 },
              ]}
              onPress={handlePost}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingState
                  size="small"
                  message="กำลังบันทึกและลงประกาศ..."
                  style={{ paddingVertical: 4 }}
                />
              ) : (
                <Text style={styles.submitBtnText}>
                  ยืนยันลงประกาศ{type === "ให้ฟรี" ? "ส่งต่อฟรี" : type}
                </Text>
              )}
            </Pressable>
          </>
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
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  content: { padding: 20, paddingBottom: 60 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  typeRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: "center",
  },
  typeActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  typeActiveText: { color: "#FFFFFF" },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  catChipText: { fontSize: 13, color: COLORS.textPrimary },
  catChipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  uploadBox: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    borderStyle: "dashed",
    backgroundColor: COLORS.cardBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  previewImage: { width: "100%", height: "100%" },
  uploadText: { fontSize: 13, color: COLORS.textMuted, marginTop: 8 },
  input: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: { height: 90, textAlignVertical: "top" },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },
  submitBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
