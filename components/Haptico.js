import * as Haptics from 'expo-haptics';

// Vibração curta de sucesso (sensor/atuador do celular). Chamada ao salvar, excluir e sair.
export function vibrar() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
}