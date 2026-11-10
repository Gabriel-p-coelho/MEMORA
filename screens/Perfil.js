import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../config/config';
import { vibrar } from '../components/Haptico';
import { CATEGORIAS, lerObras, mediaDasNotas } from '../components/Obras';
import { C } from '../components/Cores';

export default function Perfil({ navigation }) {
  // Dados da conta logada
  const user = firebase.auth().currentUser;
  const email = user ? user.email : 'usuario';
  const base = email.split('@')[0];
  const nome = base.charAt(0).toUpperCase() + base.slice(1);
  const criada = user ? user.metadata.creationTime : null;
  const desde = criada
    ? 'Diário cultural desde ' +
      new Date(criada).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : '';
  const [obras, setObras] = useState([]);

  useEffect(() => lerObras(setObras), []);

  const concluidas = obras.filter((obra) => obra.status === 'Concluído').length;

  const media = mediaDasNotas(obras);

  const resumo = [
    { rotulo: 'Na biblioteca', valor: String(obras.length) },
    { rotulo: 'Concluídas', valor: String(concluidas) },
    { rotulo: 'Nota média', valor: media },
  ];

  // Pede confirmação antes de sair da conta.
  function confirmarSaida() {
    Alert.alert('Sair da conta?', 'Você precisará entrar novamente para acessar seu diário.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  }

  // Faz logout no Firebase e volta para a tela de Login.
  function sair() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        vibrar();
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
          <Text style={s.desde}>{desde}</Text>
        </View>

        <View style={s.resumo}>
          {resumo.map((item) => (
            <View key={item.rotulo} style={s.cartaoResumo}>
              <Text style={s.resumoRotulo}>{item.rotulo}</Text>
              <Text style={s.resumoValor}>{item.valor}</Text>
            </View>
          ))}
        </View>

        <View style={s.cartao}>
          <Pressable
            style={s.linha}
            onPress={() => navigation.navigate('Diario')}
          >
            <Text style={[s.linhaTitulo, { flex: 1 }]}>Meu Diário</Text>
            <Ionicons name="chevron-forward" size={22} color={C.azul} />
          </Pressable>
        </View>

        <Text style={s.secao}>Sua jornada</Text>
        <View style={s.jornada}>
          {Object.keys(CATEGORIAS).map((nome) => (
            <Text key={nome} style={s.jornadaItem}>
              <Text style={s.jornadaNumero}>
                {obras.filter((obra) => obra.categoria === nome).length}
              </Text>{' '}
              {CATEGORIAS[nome].plural.toLowerCase()}
            </Text>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [s.botaoSair, pressed && { opacity: 0.8 }]}
          onPress={confirmarSaida}
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
  linhaTitulo: { fontSize: 14, fontWeight: '600', color: C.azul },

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