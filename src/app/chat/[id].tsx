import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
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
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "🎉 ยืนยันตกลงนัดรับเรียบร้อยแล้ว!",
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
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
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

        <Pressable style={styles.iconBtn}>
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={COLORS.textPrimary}
          />
        </Pressable>
      </View>

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
            name={isDealed ? "checkmark-circle" : ("hand-shake-outline" as any)}
            size={14}
            color="#FFFFFF"
          />
          <Text style={styles.dealBtnText}>
            {isDealed ? "จองเรียบร้อย" : "ตกลงนัดรับ"}
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="พิมพ์ข้อความ..."
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={setInputText}
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
  },
  sellerHeaderInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
  sellerName: { fontSize: 14, fontWeight: "800", color: COLORS.textPrimary },
  onlineStatus: { fontSize: 10, color: "#2E7D32", fontWeight: "600" },
  productBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: COLORS.borderColor,
  },
  productThumb: { width: 40, height: 40, borderRadius: 8 },
  productTitle: { fontSize: 12, fontWeight: "700", color: COLORS.textPrimary },
  productPrice: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 2,
  },
  dealBtn: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  dealBtnDone: { backgroundColor: "#2E7D32" },
  dealBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  messageList: { paddingHorizontal: 16, paddingVertical: 14 },
  messageWrapper: { marginBottom: 12, maxWidth: "75%" },
  myWrapper: { alignSelf: "flex-end", alignItems: "flex-end" },
  sellerWrapper: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  myBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  sellerBubble: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  myText: { color: "#FFFFFF" },
  sellerText: { color: COLORS.textPrimary },
  timeText: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 4,
    marginHorizontal: 4,
  },
  systemBox: {
    alignSelf: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.yellow,
  },
  systemText: { fontSize: 11, fontWeight: "800", color: COLORS.orange },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderColor: COLORS.borderColor,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginRight: 10,
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
