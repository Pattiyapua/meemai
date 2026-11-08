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

  const handlePost = () => {
    if (!title.trim()) {
      alert("กรุณากรอกชื่อสินค้า");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: title,
      price: type === "ให้ฟรี" ? "ฟรี" : `฿${price || "0"}`,
      type: type,
      category: category,
      location: "ท่าพระจันทร์ • มธ.",
      description: description || "ไม่มีรายละเอียดเพิ่มเติม",
      seller: "ฉัน (ผู้ขาย)",
      image: selectedImage || require("../../assets/logo.png"),
      isFree: type === "ให้ฟรี",
    };

    NEARBY_ITEMS.unshift(newItem);

    alert("ลงประกาศขายเรียบร้อยแล้ว!");
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home" as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>ลงประกาศสิ่งของ</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.label}>ประเภทการส่งต่อ</Text>
        <View style={styles.typeRow}>
          {(["ขาย", "ให้ยืม", "ให้ฟรี"] as const).map((t) => (
            <Pressable
              key={t}
              style={[styles.typeOption, type === t && styles.typeActive]}
              onPress={() => setType(t)}
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
              style={[styles.catChip, category === cat && styles.catChipActive]}
              onPress={() => setCategory(cat)}
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
          onPress={() => {
            setSelectedImage(require("../../assets/logo.png"));
            alert("ใส่เรียบร้อยแล้ว!");
          }}
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
              <Text style={styles.uploadText}>คลิกเพื่อเลือกรูปภาพ</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.label}>ชื่อสินค้า / สิ่งของ</Text>
        <TextInput
          style={styles.input}
          placeholder="เช่น กระเป๋าผ้า, หนังสือเรียน"
          placeholderTextColor="#C5BBAC"
          value={title}
          onChangeText={setTitle}
        />

        {type !== "ให้ฟรี" && (
          <>
            <Text style={styles.label}>
              {type === "ขาย" ? "ราคา (บาท)" : "ราคาค่าเช่า/ยืม ต่อวัน"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#C5BBAC"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
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
        />

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && { opacity: 0.88 },
          ]}
          onPress={handlePost}
        >
          <Text style={styles.submitBtnText}>ยืนยันลงประกาศขาย</Text>
        </Pressable>
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
  headerTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textPrimary },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  typeRow: { flexDirection: "row", justifyContent: "space-between" },
  typeOption: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  typeActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeOptionText: { fontSize: 13, fontWeight: "800", color: COLORS.textMuted },
  typeActiveText: { color: "#FFFFFF" },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginRight: 8,
  },
  catChipActive: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  catChipText: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted },
  catChipTextActive: { color: "#FFFFFF" },
  uploadBox: {
    height: 110,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  uploadText: { fontSize: 12, color: COLORS.textMuted, marginTop: 6 },
  previewImage: { width: "100%", height: "100%" },
  input: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: { height: 90, textAlignVertical: "top" },
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  submitBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
