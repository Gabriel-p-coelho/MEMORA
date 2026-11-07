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
import { C } from './Cores';

// Componentes visuais compartilhados por Login e Cadastro.
export function Logo() {
  return (
    <View style={s.logoWrap}>
      <View style={s.logoIcone}>
        <Image
          source={require('../assets/Logo.png')}
          style={s.logoImagem}
          resizeMode="contain"
        />
      </View>
      <Text style={s.logoTexto}>memora</Text>
      <Text style={s.slogan}>Sua história, em cada descoberta.</Text>
    </View>
  );
}

export function Titulo({ titulo, subtitulo }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={s.titulo}>{titulo}</Text>
      <Text style={s.subtitulo}>{subtitulo}</Text>
    </View>
  );
}

export function Campo({ label, icone, secure, ...props }) {
  return (
    <View style={s.campoWrap}>
      <Text style={s.label}>{label}</Text>
      <View style={s.campo}>
        <Ionicons name={icone} size={20} color={C.textoSuave} />
        <TextInput
          style={s.input}
          placeholderTextColor={C.cinza}
          secureTextEntry={secure}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
      </View>
    </View>
  );
}

export function BotaoPrincipal({ titulo, onPress, carregando }) {
  return (
    <TouchableOpacity
      style={[s.botao, carregando && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={carregando}
      activeOpacity={0.85}>
      {carregando ? (
        <ActivityIndicator color={C.branco} />
      ) : (
        <Text style={s.botaoTexto}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

export function TelaAuth({ children }) {
  return (
    <View style={s.tela}>
      <View pointerEvents="none" style={[s.blob, s.blobTopo]} />
      <View pointerEvents="none" style={[s.blob, s.blobBase]} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Logo />
            <View style={s.conteudo}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
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
  slogan: { fontSize: 13, color: C.textoSuave },
  titulo: { fontSize: 28, fontWeight: '800', color: C.azul, lineHeight: 34 },
  subtitulo: { fontSize: 14, color: C.textoSuave, marginTop: 6 },
  campoWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: C.azul, marginBottom: 6 },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.branco,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.bordaClara,
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