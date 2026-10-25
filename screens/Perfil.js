import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../config/config';

const C = {
  fundo: '#F4F5F9',
  branco: '#FFFFFF',
  azul: '#202A43',
  lavanda: '#DCE3F4',
  texto: '#55607A',
  linha: '#E6E9F3',
};

const RESUMO = [
  { rotulo: 'Na biblioteca', valor: '14' },
  { rotulo: 'Concluídas', valor: '7' },
  { rotulo: 'Nota média', valor: '4,3' },
];

const JORNADA = [
  { n: 6, tipo: 'livros' },
  { n: 4, tipo: 'filmes' },
  { n: 2, tipo: 'séries' },
  { n: 2, tipo: 'jogos' },
  { n: 2, tipo: 'Albuns' },
];

function nomeDoUsuario() {
  const user = firebase.auth().currentUser;
  const base = user && user.email ? user.email.split('@')[0] : 'Gabriel';
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function Perfil({ navigation }) {
  const [haptico, setHaptico] = useState(true);
  const nome = nomeDoUsuario();

  function sair() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
        );
      });
  }

  return (
    <SafeAreaView style={s.tela} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.titulo}>Perfil</Text>

        <View style={s.identidade}>
          <View style={s.avatar}>
            <Text style={s.avatarLetra}>{nome.charAt(0)}</Text>
          </View>
          <Text style={s.nome}>{nome}</Text>
          <Text style={s.desde}>Diário cultural desde outubro de 2026</Text>
        </View>

        <View style={s.resumo}>
          {RESUMO.map((item) => (
            <View key={item.rotulo} style={s.cartaoResumo}>
              <Text style={s.resumoRotulo}>{item.rotulo}</Text>
              <Text style={s.resumoValor}>{item.valor}</Text>
            </View>
          ))}
        </View>

        <Text style={s.secao}>Preferências</Text>
        <View style={s.cartao}>
          <Pressable
            style={[s.linha, s.linhaComDivisor]}
            onPress={() => setHaptico(!haptico)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: haptico }}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.linhaTitulo}>Feedback háptico</Text>
              <Text style={s.linhaDescricao}>
                Vibração leve ao salvar ou concluir
              </Text>
            </View>
            <View style={[s.checkbox, !haptico && s.checkboxVazio]}>
              {haptico && <Ionicons name="checkmark" size={16} color={C.branco} />}
            </View>
          </Pressable>

          <Pressable
            style={s.linha}
            onPress={() => navigation.navigate('Diario')}
            accessibilityRole="button"
          >
            <Text style={[s.linhaTitulo, { flex: 1 }]}>Meu Diário</Text>
            <Ionicons name="chevron-forward" size={22} color={C.azul} />
          </Pressable>
        </View>

        <Text style={s.secao}>Sua jornada</Text>
        <View style={s.jornada}>
          {JORNADA.map((item) => (
            <Text key={item.tipo} style={s.jornadaItem}>
              <Text style={s.jornadaNumero}>{item.n}</Text> {item.tipo}
            </Text>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [s.botaoSair, pressed && { opacity: 0.8 }]}
          onPress={sair}
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={20} color={C.azul} />
          <Text style={s.botaoSairTexto}>Sair da conta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  conteudo: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },

  titulo: { fontSize: 24, fontWeight: '800', color: C.azul },

  identidade: { alignItems: 'center', marginTop: 20 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.lavanda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetra: { fontSize: 40, fontWeight: '800', color: C.azul },
  nome: { fontSize: 22, fontWeight: '800', color: C.azul, marginTop: 12 },
  desde: { fontSize: 13, color: C.texto, marginTop: 2 },

  resumo: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cartaoResumo: {
    flex: 1,
    backgroundColor: C.branco,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  resumoRotulo: { fontSize: 12, color: C.texto },
  resumoValor: { fontSize: 24, fontWeight: '800', color: C.azul, marginTop: 4 },

  secao: { fontSize: 18, fontWeight: '700', color: C.azul, marginTop: 16 },

  cartao: {
    backgroundColor: C.branco,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  linha: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linhaComDivisor: { borderBottomWidth: 1, borderBottomColor: C.linha },
  linhaTitulo: { fontSize: 14, fontWeight: '600', color: C.azul },
  linhaDescricao: { fontSize: 12, color: C.texto, marginTop: 2 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: C.azul,
    borderWidth: 2,
    borderColor: C.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxVazio: { backgroundColor: C.branco },

  jornada: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: C.branco,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  jornadaItem: { fontSize: 13, color: C.texto },
  jornadaNumero: { fontWeight: '700', color: C.azul },

  botaoSair: {
    height: 52,
    borderRadius: 14,
    backgroundColor: C.lavanda,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
  },
  botaoSairTexto: { fontSize: 15, fontWeight: '700', color: C.azul },
});