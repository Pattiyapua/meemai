export const COLORS = {
  background: "#FFF9ED", // สีพื้นหลังครีมเบจ
  cardBg: "#FFFFFF", // สีพื้นหลังการ์ด
  primary: "#B90000", // สีแดงหลัก
  orange: "#FF7952", // สีส้มพีช
  yellow: "#FFD600", // สีเหลืองมัสตาร์ด
  peach: "#FFB86B", // สีส้มอ่อน
  textPrimary: "#292522", // สีข้อความหลัก
  textMuted: "#9B8D7A", // สีข้อความรอง / เทาอมน้ำตาล
  borderColor: "#F0E5D2", // สีเส้นขอบ
  backgroundElement: "#F7EEDD", // สีพื้นหลังปุ่ม/แท็บ
};

// เพิ่ม Alias เพื่อป้องกันปัญหาชื่อตัวแปรย่อย
export const Colors = {
  light: {
    background: COLORS.background,
    backgroundElement: COLORS.backgroundElement,
    text: COLORS.textPrimary,
    tint: COLORS.primary,
    tabIconDefault: COLORS.textMuted,
    tabIconSelected: COLORS.primary,
  },
  dark: {
    background: COLORS.background,
    backgroundElement: COLORS.backgroundElement,
    text: COLORS.textPrimary,
    tint: COLORS.primary,
    tabIconDefault: COLORS.textMuted,
    tabIconSelected: COLORS.primary,
  },
};
export type ThemeColor = keyof typeof Colors.light;
// เพิ่มค่า Spacing ต่างๆ
export const Spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  // หรือปรับขนาดตามต้องการ
};

export const BottomTabInset = 49;
export const MaxContentWidth = 800;
