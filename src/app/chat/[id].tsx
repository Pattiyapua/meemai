import {
  EmptyState,
  LoadingState,
  StatusBanner,
} from "@/components/UIState";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Message {
  id: string;
  text: string;
  sender: "me" | "seller" | "system";
  time: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isDealed, setIsDealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "สวัสดีครับ สินค้าชิ้นนี้ยังอยู่ไหมครับ?",
      sender: "me",
      time: "10:30 น.",
    },
    {
      id: "2",
      text: "สวัสดีค่ะ ยังอยู่ค่ะ สะดวกนัดรับแถวไหนคะ?",
      sender: "seller",
      time: "10:32 น.",
    },
  ]);

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    // จำลองการโหลดประวัติแชท
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSend = () => {
    if (!inputText.trim()) {
      setErrorMessage("กรุณาพิมพ์ข้อความก่อนกดส่ง");
      return;
    }

    setErrorMessage(null);

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const handleConfirmDeal = () => {
    setIsDealed(true);
    setSuccessBanner("🎉 ยืนยันตกลงนัดรับสิ่งของสำเร็จเรียบร้อยแล้ว!");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "🎉 ยืนยันตกลงนัดรับเรียบร้อยแล้ว! นัดพบกันที่จุดนัดรับ ม.ธรรมศาสตร์",
        sender: "system",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconBtn}
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

        <View style={styles.sellerHeaderInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>N</Text>
          </View>
          <View>
            <Text style={styles.sellerName}>Nuania</Text>
            <Text style={styles.onlineStatus}>กำลังใช้งาน</Text>
          </View>
        </View>

        <Pressable style={styles.iconBtn} accessibilityLabel="เมนูเพิ่มเติม">
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={COLORS.textPrimary}
          />
        </Pressable>
      </View>

      {/* Product Banner */}
      <View style={styles.productBanner}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500",
          }}
          style={styles.productThumb}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.productTitle} numberOfLines={1}>
            กระเป๋าผ้า Uniqlo สภาพดี
          </Text>
          <Text style={styles.productPrice}>฿120</Text>
        </View>

        <Pressable
          style={[styles.dealBtn, isDealed && styles.dealBtnDone]}
          onPress={handleConfirmDeal}
          disabled={isDealed}
        >
          <Ionicons
            name={isDealed ? "checkmark-circle" : "checkmark-circle-outline"}
            size={14}
            color="#FFFFFF"
          />
          <Text style={styles.dealBtnText}>
            {isDealed ? "จองเรียบร้อย" : "ตกลงนัดรับ"}
          </Text>
        </Pressable>
      </View>

      {/* Success Notification Banner */}
      {successBanner ? (
        <StatusBanner
          type="success"
          message={successBanner}
          onDismiss={() => setSuccessBanner(null)}
          style={{ marginHorizontal: 16, marginTop: 10 }}
        />
      ) : null}

      {/* Error Banner */}
      {errorMessage ? (
        <StatusBanner
          type="error"
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
          style={{ marginHorizontal: 16, marginTop: 10 }}
        />
      ) : null}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {isLoading ? (
          <LoadingState
            fullScreen
            message="กำลังโหลดข้อความสนทนา..."
            subMessage="ดึงประวัติการพูดคุยกับผู้ขาย"
          />
        ) : messages.length === 0 ? (
          <EmptyState
            icon="chatbubbles-outline"
            title="ยังไม่มีข้อความสนทนา"
            message="เริ่มต้นทักทายผู้ขายเพื่อสอบถามรายละเอียดหรือนัดรับสินค้าได้เลย"
            actionLabel="ส่งข้อความทักทาย"
            onAction={() => {
              setInputText("สวัสดีครับ สินค้าชิ้นนี้ยังอยู่ไหมครับ?");
            }}
          />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => {
              if (item.sender === "system") {
                return (
                  <View style={styles.systemBox}>
                    <Text style={styles.systemText}>{item.text}</Text>
                  </View>
                );
              }

              const isMe = item.sender === "me";
              return (
                <View
                  style={[
                    styles.messageWrapper,
                    isMe ? styles.myWrapper : styles.sellerWrapper,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.myBubble : styles.sellerBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isMe ? styles.myText : styles.sellerText,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              );
            }}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="พิมพ์ข้อความ..."
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              if (errorMessage) setErrorMessage(null);
            }}
            onSubmitEditing={handleSend}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleSend}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderColor: COLORS.borderColor,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.backgroundElement,
  },
  sellerHeaderInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  sellerName: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  onlineStatus: { fontSize: 11, color: COLORS.orange, fontWeight: "600" },
  productBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.borderColor,
  },
  productThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundElement,
  },
  productTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary },
  productPrice: { fontSize: 13, fontWeight: "800", color: COLORS.primary },
  dealBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  dealBtnDone: { backgroundColor: COLORS.success },
  dealBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  messageList: { padding: 16, paddingBottom: 20 },
  systemBox: {
    backgroundColor: "#F7EEDD",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 12,
  },
  systemText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
  },
  messageWrapper: { marginBottom: 12, maxWidth: "80%" },
  myWrapper: { alignSelf: "flex-end", alignItems: "flex-end" },
  sellerWrapper: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  sellerBubble: {
    backgroundColor: COLORS.cardBg,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  myText: { color: "#FFFFFF" },
  sellerText: { color: COLORS.textPrimary },
  timeText: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: COLORS.background,
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
