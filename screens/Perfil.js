import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../config/config';
import { vibrar } from '../components/Haptico';

const C = {
  fundo: '#F4F5F9',
  branco: '#FFFFFF',
  azul: '#202A43',
  lavanda: '#DCE3F4',
  texto: '#55607A',
  linha: '#E6E9F3',
};

const JORNADA = [
  { categoria: 'Livro', rotulo: 'livros' },
  { categoria: 'Filme', rotulo: 'filmes' },
  { categoria: 'Série', rotulo: 'séries' },
  { categoria: 'Jogo', rotulo: 'jogos' },
  { categoria: 'Álbum', rotulo: 'álbuns' },
];

function desdeQuando() {
  const user = firebase.auth().currentUser;
  const criada = user && user.metadata && user.metadata.creationTime;
  if (!criada) return '';
  const mes = new Date(criada).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  return 'Diário cultural desde ' + mes;
}

function nomeDoUsuario() {
  const user = firebase.auth().currentUser;
  const base = user && user.email ? user.email.split('@')[0] : 'Usuário';
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function Perfil({ navigation }) {
  const [obras, setObras] = useState([]);
  const nome = nomeDoUsuario();

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref('/usuarios/' + uid + '/obras');

    const escutar = ref.on('value', (snapshot) => {
      const data = snapshot.val();

      if (data == null) {
        setObras([]);
        return;
      }

      setObras(Object.keys(data).map((id) => ({ ...data[id], id })));
    });

    return () => ref.off('value', escutar);
  }, []);

  const concluidas = obras.filter((obra) => obra.status === 'Concluído').length;

  const notas = obras
    .map((obra) => parseFloat(String(obra.nota || '').replace(',', '.')))
    .filter((n) => !isNaN(n));
  const media = notas.length
    ? (Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10)
        .toString()
        .replace('.', ',')
    : '–';

  const resumo = [
    { rotulo: 'Na biblioteca', valor: String(obras.length) },
    { rotulo: 'Concluídas', valor: String(concluidas) },
    { rotulo: 'Nota média', valor: media },
  ];

  function confirmarSaida() {
    Alert.alert('Sair da conta?', 'Você precisará entrar novamente para acessar seu diário.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  }

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
          <Text style={s.desde}>{desdeQuando()}</Text>
        </View>

        <View style={s.resumo}>
          {resumo.map((item) => (
            <View key={item.rotulo} style={s.cartaoResumo}>
              <Text style={s.resumoRotulo}>{item.rotulo}</Text>
              <Text style={s.resumoValor}>{item.valor}</Text>
            </View>
          ))}
        </View>

        <Text style={s.secao}>Preferências</Text>
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
          {JORNADA.map((item) => (
            <Text key={item.categoria} style={s.jornadaItem}>
              <Text style={s.jornadaNumero}>
                {obras.filter((obra) => obra.categoria === item.categoria).length}
              </Text>{' '}
              {item.rotulo}
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