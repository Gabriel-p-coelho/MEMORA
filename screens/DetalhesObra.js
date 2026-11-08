import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../config/config';
import { CATEGORIAS, lerNota } from '../components/Obras';
import { vibrar } from '../components/Haptico';
import { apagarImagem, Capa } from '../components/Imagens';
import { C } from '../components/Cores';

const ICONES_STATUS = {
  Planejado: 'time-outline',
  'Em andamento': 'play',
  Concluído: 'checkmark',
  Abandonado: 'close',
};

function Estrelas({ nota }) {
  return (
    <View style={s.estrelas}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={nota >= i ? 'star' : nota >= i - 0.5 ? 'star-half' : 'star-outline'}
          size={14}
          color={C.azul}
        />
      ))}
    </View>
  );
}

function CartaoInfo({ titulo, direita, porcentagem }) {
  return (
    <View style={s.cartaoLargo}>
      <View style={s.linhaProgresso}>
        <Text style={s.cartaoTitulo}>{titulo}</Text>
        <Text style={s.pequeno}>{direita}</Text>
      </View>
      {porcentagem !== undefined && (
        <View style={s.barraFundo}>
          <View style={[s.barraPreenchida, { width: `${porcentagem}%` }]} />
        </View>
      )}
    </View>
  );
}

export default function DetalhesObra({ navigation, route }) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const [obra, setObra] = useState(null);

  const uid = firebase.auth().currentUser.uid;
  const caminho = '/usuarios/' + uid + '/obras/' + id;

  // Escuta a obra no banco (on('value')) e atualiza a tela quando ela mudar.
  useEffect(() => {
    const ref = firebase.database().ref(caminho);
    const escutar = ref.on('value', (snapshot) => setObra(snapshot.val()));
    return () => ref.off('value', escutar);
  }, [caminho]);

  // Remove a obra do Realtime Database (D do CRUD) e a imagem dela do aparelho.
  function excluir() {
    const imagem = obra.imageName;

    firebase
      .database()
      .ref(caminho)
      .remove()
      .then(() => {
        apagarImagem(imagem);
        vibrar();
        navigation.goBack();
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível excluir. Tente novamente.'));
  }

  // Pede confirmação antes de excluir.
  function confirmarExclusao() {
    Alert.alert(
      'Excluir obra?',
      '"' + obra.titulo + '" será removida da sua biblioteca. Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: excluir },
      ]
    );
  }

  if (!obra) return <View style={s.tela} />;

  const config = CATEGORIAS[obra.categoria];
  const dataConclusao = obra.concluidaEm ? new Date(obra.concluidaEm).toLocaleDateString('pt-BR') : '';
  const nota = lerNota(obra.nota);
  const temNota = !isNaN(nota);

  const autoria = obra.direcao || obra.autor || obra.plataforma || obra.artista;
  const subtitulo = [obra.categoria, autoria, obra.genero].filter(Boolean).join(' · ');

  let extra = null;
  if (obra.categoria === 'Livro' && Number(obra.totalPaginas) > 0) {
    const lidas = Number(obra.paginasLidas) || 0;
    const total = Number(obra.totalPaginas);
    const pct = Math.min(100, Math.round((lidas / total) * 100));
    extra = (
      <CartaoInfo
        titulo="Progresso"
        direita={`${lidas} / ${total} págs · ${pct}%`}
        porcentagem={pct}
      />
    );
  } else if (obra.categoria === 'Série' && (obra.temporada || obra.totalEps)) {
    const partes = [
      obra.temporada ? `Temporada ${obra.temporada}` : null,
      obra.totalEps ? `${obra.totalEps} eps` : null,
    ].filter(Boolean);
    extra = <CartaoInfo titulo="Progresso" direita={partes.join(' · ')} />;
  } else if (obra.categoria === 'Jogo' && obra.horas) {
    extra = <CartaoInfo titulo="Tempo de jogo" direita={`${obra.horas} h`} />;
  }

  return (
    <View style={s.tela}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={[s.topo, { height: 250 + insets.top }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel="Voltar"
            style={[s.voltar, { top: insets.top + 16 }]}>
            <Ionicons name="chevron-back" size={22} color={C.azul} />
          </Pressable>
        </View>

        <View style={s.capa}>
          <Capa
            nome={obra.imageName}
            style={s.capaImagem}
            fallback={
              <View style={s.capaInterna}>
                <Ionicons name={config ? config.icone : 'albums-outline'} size={36} color={C.azul} />
              </View>
            }
          />
        </View>

        <View style={s.conteudo}>
          <View style={s.cabecalhoTexto}>
            <Text style={s.titulo}>{obra.titulo}</Text>
            <Text style={s.subtitulo}>{subtitulo}</Text>
          </View>

          <View style={s.linhaCartoes}>
            <View style={s.cartao}>
              <Text style={s.pequeno}>Status</Text>
              <View style={s.statusLinha}>
                <Ionicons name={ICONES_STATUS[obra.status] || 'ellipse-outline'} size={16} color={C.azul} />
                <Text style={s.statusTexto}>{obra.status}</Text>
              </View>
              {dataConclusao ? <Text style={s.pequeno}>em {dataConclusao}</Text> : null}
            </View>

            <View style={s.cartao}>
              <Text style={s.pequeno}>Sua nota</Text>
              <View style={s.notaLinha}>
                <Text style={s.notaNumero}>
                  {temNota ? String(obra.nota).replace('.', ',') : '–'}
                </Text>
                <Text style={s.notaDe}> / 5</Text>
              </View>
              <Estrelas nota={temNota ? nota : 0} />
            </View>
          </View>

          {extra}

          {obra.opiniao ? (
            <View style={[s.cartaoLargo, { gap: 6 }]}>
              <Text style={s.cartaoTitulo}>Opinião</Text>
              <Text style={s.opiniao}>{obra.opiniao}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[s.rodape, { paddingBottom: Math.max(insets.bottom, 12) + 12 }]}>
        <TouchableOpacity
          style={[s.botao, s.botaoEditar]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AdicionarConteudo', { id })}>
          <Ionicons name="pencil-outline" size={18} color={C.branco} />
          <Text style={s.botaoEditarTexto}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.botao, s.botaoExcluir]}
          activeOpacity={0.8}
          onPress={confirmarExclusao}>
          <Ionicons name="trash-outline" size={18} color={C.azul} />
          <Text style={s.botaoExcluirTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  scroll: { paddingBottom: 24 },

  topo: {
    backgroundColor: C.azul,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  voltar: {
    position: 'absolute',
    left: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.brancoVidro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  capa: {
    alignSelf: 'center',
    marginTop: -170,
    width: 164,
    height: 236,
    padding: 6,
    borderRadius: 14,
    backgroundColor: C.branco,
    shadowColor: C.azul,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  capaImagem: { flex: 1, borderRadius: 8 },
  capaInterna: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: C.lavanda,
    alignItems: 'center',
    justifyContent: 'center',
  },

  conteudo: { paddingHorizontal: 20, paddingTop: 16, gap: 14 },
  cabecalhoTexto: { alignItems: 'center', gap: 2 },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: C.azul,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitulo: { fontSize: 14, color: C.texto, textAlign: 'center' },

  linhaCartoes: { flexDirection: 'row', gap: 10 },
  cartao: {
    flex: 1,
    backgroundColor: C.branco,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  cartaoLargo: {
    backgroundColor: C.branco,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  cartaoTitulo: { fontSize: 13, fontWeight: '600', color: C.azul },
  pequeno: { fontSize: 12, color: C.texto },

  statusLinha: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusTexto: { fontSize: 14, fontWeight: '600', color: C.azul },

  notaLinha: { flexDirection: 'row', alignItems: 'baseline' },
  notaNumero: { fontSize: 24, fontWeight: '800', color: C.azul },
  notaDe: { fontSize: 13, fontWeight: '600', color: C.texto },
  estrelas: { flexDirection: 'row', gap: 2 },

  linhaProgresso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  barraFundo: {
    height: 8,
    borderRadius: 4,
    backgroundColor: C.lavanda,
    overflow: 'hidden',
  },
  barraPreenchida: { height: 8, borderRadius: 4, backgroundColor: C.menta },

  opiniao: { fontSize: 14, lineHeight: 21, color: C.azul },

  rodape: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: C.fundo,
  },
  botao: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botaoEditar: { flex: 1, backgroundColor: C.azul },
  botaoEditarTexto: { fontSize: 15, fontWeight: '600', color: C.branco },
  botaoExcluir: {
    paddingHorizontal: 23,
    backgroundColor: C.branco,
    borderWidth: 1,
    borderColor: C.lavanda,
  },
  botaoExcluirTexto: { fontSize: 15, fontWeight: '600', color: C.azul },
});