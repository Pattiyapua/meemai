import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

// ============================================================================
// 1. Loading State — กำลังโหลดข้อมูล
// ============================================================================
export interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  size?: "small" | "large";
  style?: StyleProp<ViewStyle>;
}

export function LoadingState({
  message = "กำลังโหลดข้อมูล...",
  subMessage,
  fullScreen = false,
  size = "large",
  style,
}: LoadingStateProps) {
  return (
    <View
      style={[
        styles.centerContainer,
        fullScreen && styles.fullScreenContainer,
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <View style={styles.loadingPulseCircle}>
        <ActivityIndicator size={size} color={COLORS.primary} />
      </View>
      <Text style={styles.loadingTitle}>{message}</Text>
      {subMessage ? (
        <Text style={styles.loadingSub}>{subMessage}</Text>
      ) : null}
    </View>
  );
}

// ============================================================================
// 2. Empty State — ไม่มีข้อมูล
// ============================================================================
export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  title = "ไม่มีข้อมูล",
  message = "ไม่พบรายการข้อมูลในขณะนี้",
  icon = "file-tray-outline",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.centerContainer, styles.cardContainer, style]}>
      <View style={styles.emptyIconBg}>
        <Ionicons name={icon} size={42} color={COLORS.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySub}>{message}</Text>

      {actionLabel && onAction ? (
        <Pressable
          style={({ pressed }) => [
            styles.primaryActionBtn,
            pressed && styles.btnPressed,
          ]}
          onPress={onAction}
          accessibilityRole="button"
        >
          <Text style={styles.primaryActionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}

      {secondaryActionLabel && onSecondaryAction ? (
        <Pressable
          style={({ pressed }) => [
            styles.secondaryActionBtn,
            pressed && styles.btnPressed,
          ]}
          onPress={onSecondaryAction}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryActionText}>{secondaryActionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ============================================================================
// 3. Error State — เกิดข้อผิดพลาด
// ============================================================================
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({
  title = "เกิดข้อผิดพลาด",
  message = "ไม่สามารถเชื่อมต่อหรือโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
  onRetry,
  retryLabel = "ลองใหม่อีกครั้ง",
  secondaryActionLabel,
  onSecondaryAction,
  style,
}: ErrorStateProps) {
  return (
    <View style={[styles.centerContainer, styles.errorCardContainer, style]}>
      <View style={styles.errorIconBg}>
        <Ionicons name="alert-circle-outline" size={44} color={COLORS.error} />
      </View>
      <Text style={styles.errorTitle}>{title}</Text>
      <Text style={styles.errorSub}>{message}</Text>

      <View style={styles.actionRow}>
        {onRetry ? (
          <Pressable
            style={({ pressed }) => [
              styles.retryBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={onRetry}
            accessibilityRole="button"
          >
            <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
            <Text style={styles.retryBtnText}>{retryLabel}</Text>
          </Pressable>
        ) : null}

        {secondaryActionLabel && onSecondaryAction ? (
          <Pressable
            style={({ pressed }) => [
              styles.secondaryActionBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={onSecondaryAction}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryActionText}>
              {secondaryActionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// ============================================================================
// 4. Success State — ดำเนินการสำเร็จ
// ============================================================================
export interface SuccessStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SuccessState({
  title = "ดำเนินการสำเร็จ",
  message = "รายการของคุณได้รับการประมวลผลเรียบร้อยแล้ว",
  actionLabel = "ตกลง",
  onAction,
  style,
}: SuccessStateProps) {
  return (
    <View style={[styles.centerContainer, styles.successCardContainer, style]}>
      <View style={styles.successIconBg}>
        <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
      </View>
      <Text style={styles.successTitle}>{title}</Text>
      <Text style={styles.successSub}>{message}</Text>

      {actionLabel && onAction ? (
        <Pressable
          style={({ pressed }) => [
            styles.successActionBtn,
            pressed && styles.btnPressed,
          ]}
          onPress={onAction}
          accessibilityRole="button"
        >
          <Text style={styles.successActionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ============================================================================
// 5. Status Banner — แถบแจ้งสถานะ (Error, Success, Info, Warning) สำหรับฟอร์ม
// ============================================================================
export interface StatusBannerProps {
  type: "error" | "success" | "warning" | "info";
  message: string;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function StatusBanner({
  type,
  message,
  onDismiss,
  style,
}: StatusBannerProps) {
  const getBannerConfig = () => {
    switch (type) {
      case "error":
        return {
          bg: COLORS.errorBg,
          border: "#FFCDD2",
          text: COLORS.error,
          icon: "alert-circle" as keyof typeof Ionicons.glyphMap,
        };
      case "success":
        return {
          bg: COLORS.successBg,
          border: "#C8E6C9",
          text: COLORS.success,
          icon: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
        };
      case "warning":
        return {
          bg: COLORS.warningBg,
          border: "#FFE0B2",
          text: COLORS.warning,
          icon: "warning" as keyof typeof Ionicons.glyphMap,
        };
      case "info":
      default:
        return {
          bg: COLORS.backgroundElement,
          border: COLORS.borderColor,
          text: COLORS.textPrimary,
          icon: "information-circle" as keyof typeof Ionicons.glyphMap,
        };
    }
  };

  const config = getBannerConfig();

  return (
    <View
      style={[
        styles.bannerContainer,
        { backgroundColor: config.bg, borderColor: config.border },
        style,
      ]}
      accessibilityRole="alert"
    >
      <Ionicons name={config.icon} size={18} color={config.text} />
      <Text style={[styles.bannerText, { color: config.text }]}>{message}</Text>
      {onDismiss ? (
        <Pressable
          onPress={onDismiss}
          hitSlop={8}
          accessibilityLabel="ปิดการแจ้งเตือน"
        >
          <Ionicons name="close" size={16} color={config.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

// ============================================================================
// 6. StateContainer — กล่องจัดการทั้ง 4 States อัตโนมัติ
// ============================================================================
export interface StateContainerProps {
  isLoading?: boolean;
  loadingMessage?: string;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  isSuccess?: boolean;
  successTitle?: string;
  successMessage?: string;
  onSuccessAction?: () => void;
  children: React.ReactNode;
}

export function StateContainer({
  isLoading,
  loadingMessage,
  isError,
  errorMessage,
  onRetry,
  isEmpty,
  emptyTitle,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
  isSuccess,
  successTitle,
  successMessage,
  onSuccessAction,
  children,
}: StateContainerProps) {
  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (isSuccess && successTitle) {
    return (
      <SuccessState
        title={successTitle}
        message={successMessage}
        onAction={onSuccessAction}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return <>{children}</>;
}

// ============================================================================
// Styles
// ============================================================================
const styles = StyleSheet.create({
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    paddingHorizontal: 20,
    width: "100%",
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cardContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginVertical: 12,
    shadowColor: "#59452B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  errorCardContainer: {
    backgroundColor: "#FFF8F8",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFCDD2",
    marginVertical: 12,
  },
  successCardContainer: {
    backgroundColor: "#F6FBF7",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    marginVertical: 12,
  },

  // Loading
  loadingPulseCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  loadingSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: "center",
  },

  // Empty
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 280,
  },

  // Error
  errorIconBg: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFEBEE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.error,
    textAlign: "center",
  },
  errorSub: {
    fontSize: 13,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 300,
  },

  // Success
  successIconBg: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.success,
    textAlign: "center",
  },
  successSub: {
    fontSize: 13,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 300,
  },

  // Action Buttons
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 10,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryActionBtn: {
    backgroundColor: COLORS.backgroundElement,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 14,
    marginTop: 14,
    gap: 6,
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  successActionBtn: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  successActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  // Status Banner
  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    gap: 8,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
