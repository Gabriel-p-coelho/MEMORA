import { useEffect, useState } from 'react';
import {
  Modal,
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
import { C, CATEGORIAS } from '../components/FormularioUI';

const MENTA = '#8FE0CB';

const ICONES_STATUS = {
  Planejado: 'time-outline',
  'Em andamento': 'play',
  Concluído: 'checkmark',
  Abandonado: 'close',
};

const CAMPO_AUTORIA = {
  Filme: 'direcao',
  Livro: 'autor',
  Jogo: 'plataforma',
  Álbum: 'artista',
};

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function dataPorExtenso(texto) {
  const partes = (texto || '').split('/');
  if (partes.length !== 3) return '';
  return `${Number(partes[0])} ${MESES[Number(partes[1]) - 1]} ${partes[2]}`;
}

function Estrelas({ nota }) {
  return (
    <View style={styles.estrelas}>
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
    <View style={styles.cartaoLargo}>
      <View style={styles.linhaProgresso}>
        <Text style={styles.cartaoTitulo}>{titulo}</Text>
        <Text style={styles.pequeno}>{direita}</Text>
      </View>
      {porcentagem !== undefined && (
        <View style={styles.barraFundo}>
          <View style={[styles.barraPreenchida, { width: `${porcentagem}%` }]} />
        </View>
      )}
    </View>
  );
}

export default function DetalhesObra({ navigation, route }) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const [obra, setObra] = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  const uid = firebase.auth().currentUser.uid;
  const caminho = '/usuarios/' + uid + '/obras/' + id;

  useEffect(() => {
    const ref = firebase.database().ref(caminho);
    ref.on('value', (snapshot) => setObra(snapshot.val()));
    return () => ref.off();
  }, [caminho]);

  function excluir() {
    firebase
      .database()
      .ref(caminho)
      .remove()
      .then(() => {
        setConfirmando(false);
        navigation.goBack();
      })
      .catch(() => alert('Não foi possível excluir. Tente novamente.'));
  }

  if (!obra) return <View style={styles.tela} />;

  const config = CATEGORIAS[obra.categoria];
  const dataConclusao = dataPorExtenso(obra.dataConclusao || obra.ouvidoEm);
  const nota = parseFloat(String(obra.nota || '').replace(',', '.'));
  const temNota = !isNaN(nota);

  const subtitulo = [obra.categoria, obra[CAMPO_AUTORIA[obra.categoria]], obra.genero]
    .filter(Boolean)
    .join(' · ');

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
    <View style={styles.tela}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={[styles.topo, { height: 250 + insets.top }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel="Voltar"
            style={[styles.voltar, { top: insets.top + 16 }]}>
            <Ionicons name="chevron-back" size={22} color={C.azul} />
          </Pressable>
        </View>

        <View style={styles.capa}>
          <View style={styles.capaInterna}>
            <Ionicons name={config ? config.icone : 'albums-outline'} size={36} color={C.azul} />
          </View>
        </View>

        <View style={styles.conteudo}>
          <View style={styles.cabecalhoTexto}>
            <Text style={styles.titulo}>{obra.titulo}</Text>
            <Text style={styles.subtitulo}>{subtitulo}</Text>
          </View>

          <View style={styles.linhaCartoes}>
            <View style={styles.cartao}>
              <Text style={styles.pequeno}>Status</Text>
              <View style={styles.statusLinha}>
                <Ionicons name={ICONES_STATUS[obra.status] || 'ellipse-outline'} size={16} color={C.azul} />
                <Text style={styles.statusTexto}>{obra.status}</Text>
              </View>
              {dataConclusao ? <Text style={styles.pequeno}>em {dataConclusao}</Text> : null}
            </View>

            <View style={styles.cartao}>
              <Text style={styles.pequeno}>Sua nota</Text>
              <View style={styles.notaLinha}>
                <Text style={styles.notaNumero}>
                  {temNota ? String(obra.nota).replace('.', ',') : '–'}
                </Text>
                <Text style={styles.notaDe}> / 5</Text>
              </View>
              <Estrelas nota={temNota ? nota : 0} />
            </View>
          </View>
          {extra}
          {obra.opiniao ? (
            <View style={[styles.cartaoLargo, { gap: 6 }]}>
              <Text style={styles.cartaoTitulo}>Opinião</Text>
              <Text style={styles.opiniao}>{obra.opiniao}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.rodape, { paddingBottom: Math.max(insets.bottom, 12) + 12 }]}>
        <TouchableOpacity
          style={[styles.botao, styles.botaoEditar]}
          activeOpacity={0.8}
          accessibilityRole="button"
          onPress={() => navigation.navigate('AdicionarConteudo', { id })}>
          <Ionicons name="pencil-outline" size={18} color={C.branco} />
          <Text style={styles.botaoEditarTexto}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, styles.botaoExcluir]}
          activeOpacity={0.8}
          accessibilityRole="button"
          onPress={() => setConfirmando(true)}>
          <Ionicons name="trash-outline" size={18} color={C.azul} />
          <Text style={styles.botaoExcluirTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={confirmando}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmando(false)}>
        <Pressable style={styles.modalFundo} onPress={() => setConfirmando(false)}>
          <Pressable style={styles.modalCartao} onPress={() => {}}>
            <Text style={styles.modalTitulo}>Excluir obra?</Text>
            <Text style={styles.modalTexto}>
              "{obra.titulo}" será removida da sua biblioteca. Essa ação não pode ser desfeita.
            </Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.modalBotao, styles.modalCancelar]}
                activeOpacity={0.8}
                onPress={() => setConfirmando(false)}>
                <Text style={styles.botaoExcluirTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBotao, styles.modalExcluir]}
                activeOpacity={0.8}
                onPress={excluir}>
                <Text style={styles.botaoEditarTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  capa: {
    alignSelf: 'center',
    marginTop: -150,
    width: 128,
    height: 184,
    padding: 6,
    borderRadius: 14,
    backgroundColor: C.branco,
    shadowColor: C.azul,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
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
  barraPreenchida: { height: 8, borderRadius: 4, backgroundColor: MENTA },

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

  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(32,42,67,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCartao: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: C.branco,
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  modalTitulo: { fontSize: 18, fontWeight: '800', color: C.azul },
  modalTexto: { fontSize: 14, lineHeight: 20, color: C.texto },
  modalBotoes: { flexDirection: 'row', gap: 10, marginTop: 12 },
  modalBotao: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelar: { backgroundColor: C.branco, borderWidth: 1, borderColor: C.lavanda },
  modalExcluir: { backgroundColor: C.erro },
});