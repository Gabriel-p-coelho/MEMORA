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
import { STATUS, CATEGORIAS, lerNota } from '../components/Obras';
import {
  caminhoDaImagem,
  escolherImagem,
  salvarImagem,
  apagarImagem,
} from '../components/Imagens';
import {
  CampoTexto,
  SeletorCategoria,
  SecaoImagem,
  SeletorStatus,
} from '../components/Formulario';
import { C } from '../components/Cores';

export default function AdicionarConteudo({ navigation, route }) {
  // Se a tela abriu com um id, é edição; senão, é uma obra nova.
  const editando = route.params?.id;
  const [categoria, setCategoria] = useState('Filme');
  const [status, setStatus] = useState('Planejado');
  const [valores, setValores] = useState({});
  const [imagemNova, setImagemNova] = useState(null); // imagem escolhida agora (uri temporária)
  const [salvando, setSalvando] = useState(false);

  const config = CATEGORIAS[categoria];
  const statusPermitidos = config.status || STATUS;

  const uid = firebase.auth().currentUser.uid;
  const obras = firebase.database().ref('/usuarios/' + uid + '/obras');

  // modo edição: carrega a obra e preenche o formulário
  useEffect(() => {
    if (!editando) return;

    obras.child(editando).once('value', (snapshot) => {
      const obra = snapshot.val();
      if (obra == null) return;
      setCategoria(obra.categoria);
      setStatus(obra.status);
      setValores(obra);
    });
  }, []);

  function mudar(chave, texto) {
    setValores({ ...valores, [chave]: texto });
  }

  // Ao trocar de categoria, volta o status para 'Planejado' se ele não existir nela.
  function trocarCategoria(nome) {
    setCategoria(nome);
    const permitidos = CATEGORIAS[nome].status || STATUS;
    if (!permitidos.includes(status)) setStatus('Planejado');
  }

  async function escolher(origem) {
    const uri = await escolherImagem(origem);
    if (uri) setImagemNova(uri);
  }

  // Valida e salva: update se estiver editando (U do CRUD), set com id novo se for obra nova (C do CRUD).
  // A imagem é copiada para o aparelho ANTES de gravar no banco; se a cópia falhar, a obra não é salva.
  async function salvar() {
    if (salvando) return;

    if (!valores.titulo) {
      Alert.alert('Erro', 'Digite o título');
      return;
    }

    const nota = lerNota(valores.nota);
    if (valores.nota && (isNaN(nota) || nota < 0 || nota > 5)) {
      Alert.alert('Erro', 'A nota deve ser um valor de 0 a 5');
      return;
    }

    setSalvando(true);

    // push() sem argumento só gera o id (nada é gravado ainda)
    const id = editando || obras.push().key;
    const imagemAntiga = valores.imageName;
    let imageName = imagemAntiga || null;

    if (imagemNova) {
      try {
        imageName = await salvarImagem(imagemNova, id);
      } catch (erro) {
        setSalvando(false);
        Alert.alert('Erro', 'Não foi possível salvar a imagem. A obra não foi salva.');
        return;
      }
    }

    const dados = {
      ...valores,
      categoria: categoria,
      status: status,
      imageName: imageName,
      // a data de conclusão é guardada automaticamente
      concluidaEm: status === 'Concluído' ? valores.concluidaEm || Date.now() : null,
    };

    const gravacao = editando
      ? obras.child(id).update({ ...dados, atualizadaEm: Date.now() })
      : obras.child(id).set({ ...dados, criadaEm: Date.now() });

    gravacao
      .then(() => {
        // só apaga a imagem antiga depois que o banco já aceitou a nova
        if (imagemNova) apagarImagem(imagemAntiga);
      })
      .catch(() => {
        // o banco recusou: desfaz a cópia para não sobrar arquivo órfão
        if (imagemNova) apagarImagem(imageName);
        Alert.alert('Erro', 'Não foi possível salvar a obra. Tente novamente.');
      });

    Alert.alert('Pronto!', editando ? 'Obra atualizada com sucesso!' : 'Obra salva com sucesso!');
    vibrar();
    navigation.goBack();
  }

  // Mostra as linhas de campos; os campos de cada linha dividem a largura.
  function mostrarCampos(linhas) {
    return linhas.map((linha, i) => (
      <View key={i} style={s.linha}>
        {linha.map((campo) => (
          <CampoTexto
            key={campo.chave}
            style={s.campo}
            rotulo={campo.rotulo}
            valor={valores[campo.chave] || ''}
            onChange={(texto) => mudar(campo.chave, texto)}
            dica={campo.dica}
            teclado={campo.teclado}
            maxLength={campo.maxLength}
          />
        ))}
      </View>
    ));
  }

  return (
    <SafeAreaView style={s.tela}>
      <KeyboardAvoidingView
        style={s.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.cabecalho}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={s.voltar}>
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
          <SeletorCategoria selecionada={categoria} onSelecionar={trocarCategoria} />

          <SecaoImagem
            categoria={categoria}
            uri={imagemNova || caminhoDaImagem(valores.imageName)}
            onGaleria={() => escolher('galeria')}
            onCamera={() => escolher('camera')}
          />

          <CampoTexto
            rotulo={config.titulo || 'Título'}
            valor={valores.titulo || ''}
            onChange={(texto) => mudar('titulo', texto)}
          />

          {mostrarCampos(config.campos)}

          <SeletorStatus
            selecionado={status}
            onSelecionar={setStatus}
            lista={statusPermitidos}
          />

          {mostrarCampos(config.progresso)}

          <CampoTexto
            rotulo="Opinião"
            valor={valores.opiniao || ''}
            onChange={(texto) => mudar('opiniao', texto)}
            dica="Ex.: Muito bom!"
          />
        </ScrollView>

        <View style={s.rodape}>
          <TouchableOpacity
            style={[s.botaoRodape, s.botaoCancelar]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <Text style={s.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.botaoRodape, s.botaoSalvar, salvando && { opacity: 0.7 }]}
            onPress={salvar}
            disabled={salvando}
            activeOpacity={0.8}>
            <Text style={s.botaoSalvarTexto}>
              {editando ? 'Salvar alterações' : 'Salvar na biblioteca'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  scroll: { flex: 1 },
  linha: { flexDirection: 'row', gap: 12 },
  campo: { flex: 1 },
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