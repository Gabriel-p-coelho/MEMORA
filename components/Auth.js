import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const C = {
  azul: '#202A43',
  ardosia: '#303B5B',
  fundo: '#F4F5F9',
  lavanda: '#DCE3F4',
  cinza: '#6B7798',
  branco: '#FFFFFF',
  borda: '#E9EBF2',
};

export function Logo() {
  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoIcone}>
        <Image
          source={require('../assets/Logo.png')}
          style={styles.logoImagem}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.logoTexto}>memora</Text>
      <Text style={styles.slogan}>Sua história, em cada descoberta.</Text>
    </View>
  );
}

export function Titulo({ titulo, subtitulo }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.subtitulo}>{subtitulo}</Text>
    </View>
  );
}

export function Campo({ label, icone, secure, ...props }) {
  const [oculto, setOculto] = useState(!!secure);

  return (
    <View style={styles.campoWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.campo}>
        <Ionicons name={icone} size={20} color={C.cinza} />
        <TextInput
          style={styles.input}
          placeholderTextColor="#8A94AE"
          secureTextEntry={oculto}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {secure && (
          <TouchableOpacity
            onPress={() => setOculto(!oculto)}
            accessibilityLabel={oculto ? 'Mostrar senha' : 'Ocultar senha'}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name={oculto ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={C.cinza}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function BotaoPrincipal({ titulo, onPress, carregando }) {
  return (
    <TouchableOpacity
      style={[styles.botao, carregando && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={carregando}
      activeOpacity={0.85}>
      {carregando ? (
        <ActivityIndicator color={C.branco} />
      ) : (
        <Text style={styles.botaoTexto}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

export function TelaAuth({ children }) {
  return (
    <View style={styles.tela}>
      <View pointerEvents="none" style={[styles.blob, styles.blobTopo]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobBase]} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Logo />
            <View style={styles.conteudo}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 32 },
  conteudo: { marginTop: 36 },
  blob: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: C.lavanda,
    opacity: 0.55,
  },
  blobTopo: { top: -190, left: -170 },
  blobBase: { bottom: -190, right: -170 },
  logoWrap: { alignItems: 'center', marginTop: 40 },
  logoIcone: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: C.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImagem: {
    width: 56,
    height: 56,
  },
  logoTexto: {
    fontSize: 40,
    fontWeight: '400',
    letterSpacing: -1.5,
    color: C.azul,
  },
  slogan: { fontSize: 13, color: C.cinza },
  titulo: { fontSize: 28, fontWeight: '800', color: C.azul, lineHeight: 34 },
  subtitulo: { fontSize: 14, color: C.cinza, marginTop: 6 },
  campoWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: C.azul, marginBottom: 6 },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.branco,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.borda,
    paddingHorizontal: 14,
    height: 54,
  },
  input: { flex: 1, marginHorizontal: 10, fontSize: 15, color: C.azul },
  botao: {
    height: 54,
    borderRadius: 14,
    backgroundColor: C.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  botaoTexto: { color: C.branco, fontSize: 16, fontWeight: '700' },
});