import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../config/config';
import { vibrar } from '../components/Haptico';
import {
  STATUS,
  CATEGORIAS,
  CampoTexto,
  LinhaDeCampos,
  SeletorCategoria,
  SecaoImagem,
  SeletorStatus,
} from '../components/Formulario';
import { C } from '../components/Cores';

export default function AdicionarConteudo({ navigation, route }) {
  const editando = route.params?.id;
  const [categoria, setCategoria] = useState('Filme');
  const [status, setStatus] = useState('Planejado');
  const [valores, setValores] = useState({});

  const config = CATEGORIAS[categoria];

  // modo edição
  useEffect(() => {
    if (!editando) return;
    const uid = firebase.auth().currentUser.uid;

    firebase
      .database()
      .ref('/usuarios/' + uid + '/obras/' + editando)
      .once('value')
      .then((snapshot) => {
        const obra = snapshot.val();
        if (!obra) return;
        const { categoria: categ, status: stat, criadaEm, ...resto } = obra;
        setCategoria(categ);
        setStatus(stat);
        setValores(resto);
      });
  }, []);

  const mudar = (chave, texto) => setValores((v) => ({ ...v, [chave]: texto }));
  const fechar = () => navigation.goBack();

  function trocarCategoria(nome) {
    setCategoria(nome);
    const permitidos = CATEGORIAS[nome].status || STATUS;
    if (!permitidos.includes(status)) setStatus('Planejado');
  }

  function salvar() {
    if (!valores.titulo) {
      Alert.alert('Erro', 'Digite o título');
      return;
    }

    const uid = firebase.auth().currentUser.uid;
    const obras = firebase.database().ref('/usuarios/' + uid + '/obras');

    if (editando) {
      obras.child(editando).update({
        ...valores,
        categoria: categoria,
        status: status,
        atualizadaEm: Date.now(),
      });
      Alert.alert('Pronto!', 'Obra atualizada com sucesso!');
    } else {
      obras.push({
        ...valores,
        categoria: categoria,
        status: status,
        criadaEm: Date.now(),
      });
      Alert.alert('Pronto!', 'Obra salva com sucesso!');
    }
    vibrar();
    fechar();
  }

  return (
    <SafeAreaView style={s.tela}>
      <KeyboardAvoidingView
        style={s.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.cabecalho}>
          <Pressable
            onPress={fechar}
            hitSlop={10}
            style={s.voltar}>
            <Ionicons name="chevron-back" size={26} color={C.azul} />
          </Pressable>
          <Text style={s.titulo}>
            {editando ? 'Editar conteúdo' : 'Adicionar conteúdo'}
          </Text>
        </View>

        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.conteudo}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <SeletorCategoria
            selecionada={categoria}
            onSelecionar={trocarCategoria}
          />

          <SecaoImagem categoria={categoria} />

          <CampoTexto
            rotulo={config.titulo}
            valor={valores.titulo || ''}
            onChange={(t) => mudar('titulo', t)}
          />

          {config.linhas.map((campos, i) => (
            <LinhaDeCampos
              key={`a${i}`}
              campos={campos}
              valores={valores}
              onChange={mudar}
            />
          ))}

          <SeletorStatus
            selecionado={status}
            onSelecionar={setStatus}
            lista={config.status || STATUS}
          />

          {config.linhasFinais.map((campos, i) => (
            <LinhaDeCampos
              key={`b${i}`}
              campos={campos}
              valores={valores}
              onChange={mudar}
            />
          ))}

          <CampoTexto
            rotulo="Opinião"
            valor={valores.opiniao || ''}
            onChange={(t) => mudar('opiniao', t)}
            dica="Ex.: Muito bom!"
          />
        </ScrollView>

        <View style={s.rodape}>
          <TouchableOpacity
            style={[s.botaoRodape, s.botaoCancelar]}
            onPress={fechar}
            activeOpacity={0.8}>
            <Text style={s.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.botaoRodape, s.botaoSalvar]}
            onPress={salvar}
            activeOpacity={0.8}>
            <Text style={s.botaoSalvarTexto}>{editando ? 'Salvar alterações' : 'Salvar na biblioteca'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

//Estilos
const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  scroll: { flex: 1 },
  conteudo: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 14,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 52,
  },
  voltar: { width: 36, height: 40, justifyContent: 'center' },
  titulo: { fontSize: 22, fontWeight: '800', color: C.azul, marginLeft: 6 },

  rodape: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: C.fundo,
  },
  botaoRodape: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoCancelar: {
    width: 112,
    backgroundColor: C.branco,
    borderWidth: 1,
    borderColor: C.borda,
  },
  botaoCancelarTexto: { fontSize: 15, fontWeight: '700', color: C.azul },
  botaoSalvar: { flex: 1, backgroundColor: C.azul },
  botaoSalvarTexto: { fontSize: 15, fontWeight: '700', color: C.branco },
});