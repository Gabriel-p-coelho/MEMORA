import * as Haptics from 'expo-haptics';

export function vibrar() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
}