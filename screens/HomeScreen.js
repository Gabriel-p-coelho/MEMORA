import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
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

const C = {
  fundo: '#F4F5F9',
  branco: '#FFFFFF',
  azul: '#202A43',
  azulCartao: '#303B5B',
  lavanda: '#DCE3F4',
  textoSecundario: '#55607A',
  verde: '#8FE0CB',
  linha: '#6F7890',
  borda: '#D6DDF0',
  legenda: '#E1E5F0',
  overlay: 'rgba(32,42,67,0.5)',
};

const sombra = {
  shadowColor: C.azul,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 3,
};

const circulo = (tamanho) => ({
  width: tamanho,
  height: tamanho,
  borderRadius: tamanho / 2,
  backgroundColor: C.lavanda,
  alignItems: 'center',
  justifyContent: 'center',
});

const PLURAL = {
  Filme: 'Filmes',
  Série: 'Séries',
  Livro: 'Livros',
  Jogo: 'Jogos',
  Álbum: 'Álbuns',
};

function dataDaObra(obra) {
  const partes = (obra.dataConclusao || obra.ouvidoEm || '').split('/');
  if (partes.length === 3) {
    const d = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return obra.atualizadaEm || obra.criadaEm || 0;
}

function quandoFoi(tempo) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dia = new Date(tempo);
  dia.setHours(0, 0, 0, 0);

  const dias = Math.round((hoje - dia) / 86400000);
  if (dias <= 0) return 'hoje';
  if (dias === 1) return 'ontem';
  if (dias < 30) return 'há ' + dias + ' dias';
  return dia.toLocaleDateString('pt-BR');
}

function resumoDoMes(obras) {
  const agora = new Date();
  const contagem = {};
  let concluidas = 0;

  obras.forEach((obra) => {
    if (obra.status !== 'Concluído') return;
    const d = new Date(dataDaObra(obra));
    if (d.getMonth() !== agora.getMonth() || d.getFullYear() !== agora.getFullYear()) return;
    concluidas++;
    contagem[obra.categoria] = (contagem[obra.categoria] || 0) + 1;
  });

  const [top] = Object.keys(contagem).sort((a, b) => contagem[b] - contagem[a]);
  return { concluidas, maisAtivo: top ? PLURAL[top] : null };
}

function montarAtividades(obras) {
  const lista = obras.map((obra) => {
    if (obra.status === 'Concluído') {
      const tempo = dataDaObra(obra);
      const nota = obra.nota ? 'Nota ' + obra.nota + ' · ' : '';
      return {
        id: obra.id,
        tempo,
        icone: 'checkmark',
        verde: true,
        titulo: 'Concluiu ' + obra.titulo,
        descricao: nota + quandoFoi(tempo),
      };
    }

    if (obra.atualizadaEm) {
      let detalhe = obra.status;
      if (obra.categoria === 'Livro' && obra.paginasLidas) {
        detalhe = 'Página ' + obra.paginasLidas;
      }
      return {
        id: obra.id,
        tempo: obra.atualizadaEm,
        icone: 'pencil-outline',
        titulo: 'Atualizou ' + obra.titulo,
        descricao: detalhe + ' · ' + quandoFoi(obra.atualizadaEm),
      };
    }

    return {
      id: obra.id,
      tempo: obra.criadaEm || 0,
      icone: 'add',
      titulo: 'Adicionou ' + obra.titulo,
      descricao: obra.categoria + ' · ' + quandoFoi(obra.criadaEm || 0),
    };
  });

  return lista.sort((a, b) => b.tempo - a.tempo).slice(0, 4);
}

const VARIANTES = {
  escuro: { fundo: C.azul, texto: C.branco },
  claro: { fundo: C.branco, texto: C.azul },
  lavanda: { fundo: C.lavanda, texto: C.azul },
};

function Botao({ texto, icone, variante = 'escuro', tamanho = 14, style, ...props }) {
  const v = VARIANTES[variante];
  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: v.fundo }, style]}
      activeOpacity={0.8}
      {...props}
    >
      {icone && <Ionicons name={icone} size={18} color={v.texto} />}
      <Text style={[styles.botaoTexto, { color: v.texto, fontSize: tamanho }]}>{texto}</Text>
    </TouchableOpacity>
  );
}

function Logo() {
  return (
    <View style={styles.logoLinha}>
      <Image
        source={require('../assets/Logo.png')}
        style={styles.logoImagem}
        resizeMode="contain"
      />
      <Text style={styles.logoTexto}>memora</Text>
    </View>
  );
}

function ResumoMensal({ concluidas, maisAtivo }) {
  const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const periodo = mes.charAt(0).toUpperCase() + mes.slice(1);

  return (
    <View style={styles.resumo}>
      <View style={styles.resumoCabecalho}>
        <Text style={styles.resumoTexto}>Resumo do mês</Text>
        <Text style={styles.resumoTexto}>{periodo}</Text>
      </View>

      <View style={styles.resumoCorpo}>
        <View style={styles.resumoColuna}>
          <Text style={styles.resumoLegenda}>Concluídas este mês</Text>
          <Text style={styles.resumoNumero}>{concluidas}</Text>
        </View>

        <View style={styles.resumoDivisor} />

        <View style={styles.resumoColuna}>
          <Text style={styles.resumoLegenda}>Mais ativo</Text>
          {maisAtivo ? (
            <Text style={styles.resumoDestaque}>{maisAtivo.toUpperCase()}</Text>
          ) : (
            <Text style={styles.resumoAtividade}>Sem registros</Text>
          )}
        </View>
      </View>
    </View>
  );
}

function BibliotecaVazia({ onAdicionar }) {
  return (
    <View style={styles.vazio}>
      <View style={styles.iconeLivro}>
        <Ionicons name="book-outline" size={36} color={C.azul} />
        <View style={styles.seloMais}>
          <Ionicons name="add" size={16} color={C.azul} />
        </View>
      </View>

      <Text style={styles.vazioTitulo}>Sua história começa aqui</Text>
      <Text style={styles.vazioDescricao}>
        Livros, filmes, séries, jogos e álbuns.
        {'\n'}Adicione sua primeira obra e guarde
        {'\n'}cada descoberta no Memora.
      </Text>

      <Botao
        texto="Adicionar primeira obra"
        icone="add"
        onPress={onAdicionar}
        style={styles.botaoLargo}
      />
    </View>
  );
}

function AtividadeRecente({ itens, onAbrir }) {
  return (
    <View style={styles.atividade}>
      <Text style={styles.atividadeTituloSecao}>Atividade recente</Text>

      {itens.length === 0 ? (
        <View style={styles.atividadeLinha}>
          <View style={styles.atividadeIcone}>
            <Ionicons name="time-outline" size={22} color={C.textoSecundario} />
          </View>

          <View style={styles.atividadeTextos}>
            <Text style={styles.atividadeTitulo}>Tudo pronto para começar</Text>
            <Text style={styles.atividadeDescricao}>
              Suas atualizações aparecerão aqui.
            </Text>
          </View>
        </View>
      ) : (
        itens.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.atividadeLinha, styles.atividadeItem]}
            activeOpacity={0.7}
            onPress={() => onAbrir(item.id)}
          >
            <View style={[styles.atividadeIcone, item.verde && { backgroundColor: C.verde }]}>
              <Ionicons name={item.icone} size={22} color={C.azul} />
            </View>

            <View style={styles.atividadeTextos}>
              <Text style={styles.atividadeTitulo} numberOfLines={1}>
                {item.titulo}
              </Text>
              <Text style={styles.atividadeDescricao}>{item.descricao}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

function ModalProgresso({ visivel, obras, onFechar, onEscolher }) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar}>
      <Pressable style={styles.modalFundo} onPress={onFechar}>
        <Pressable style={styles.modalCartao} onPress={() => {}}>
          <Text style={styles.modalTitulo}>Registrar progresso</Text>

          {obras.length === 0 ? (
            <Text style={styles.modalTexto}>
              Nenhuma obra em andamento. Mude o status de uma obra para "Em
              andamento" para registrar o progresso aqui.
            </Text>
          ) : (
            <ScrollView style={{ maxHeight: 280 }}>
              {obras.map((obra) => (
                <TouchableOpacity
                  key={obra.id}
                  style={styles.modalLinha}
                  activeOpacity={0.7}
                  onPress={() => onEscolher(obra.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.atividadeTitulo} numberOfLines={1}>
                      {obra.titulo}
                    </Text>
                    <Text style={styles.atividadeDescricao}>{obra.categoria}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={C.azul} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Botao
            texto="Fechar"
            variante="lavanda"
            tamanho={15}
            onPress={onFechar}
            style={styles.modalFechar}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function HomeScreen({ navigation }) {
  const [obras, setObras] = useState(null);
  const [progressoAberto, setProgressoAberto] = useState(false);

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref('/usuarios/' + uid + '/obras');
    const escutar = ref.on('value', (snap) => {
      setObras(Object.entries(snap.val() ?? {}).map(([id, obra]) => ({ ...obra, id })));
    });

    return () => ref.off('value', escutar);
  }, []);

  const novaObra = () => navigation.navigate('AdicionarConteudo');
  const abrirObra = (id) => navigation.navigate('DetalhesObra', { id });

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Logo />
        <Text style={styles.slogan}>Sua história, em cada descoberta</Text>

        {obras && (
          <>
            <ResumoMensal {...resumoDoMes(obras)} />

            {obras.length === 0 ? (
              <BibliotecaVazia onAdicionar={novaObra} />
            ) : (
              <View style={styles.botoes}>
                <Botao
                  texto="+ Nova obra"
                  onPress={novaObra}
                  style={styles.botaoHome}
                />
                <Botao
                  texto="Registrar Progresso"
                  variante="claro"
                  onPress={() => setProgressoAberto(true)}
                  style={styles.botaoHome}
                />
              </View>
            )}

            <AtividadeRecente itens={montarAtividades(obras)} onAbrir={abrirObra} />

            <ModalProgresso
              visivel={progressoAberto}
              obras={obras.filter((obra) => obra.status === 'Em andamento')}
              onFechar={() => setProgressoAberto(false)}
              onEscolher={(id) => {
                setProgressoAberto(false);
                navigation.navigate('AdicionarConteudo', { id });
              }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  scroll: { flex: 1 },
  conteudo: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  botao: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botaoTexto: { fontWeight: '600' },
  botaoLargo: { width: '100%', marginTop: 16 },
  botoes: { flexDirection: 'row', gap: 12, marginTop: 20 },
  botaoHome: { flex: 1, ...sombra },
  logoLinha: { height: 56, flexDirection: 'row', alignItems: 'center' },
  logoImagem: { width: 56, height: 56, marginRight: 8 },
  logoTexto: { fontSize: 40, fontWeight: '400', letterSpacing: -1.5, color: C.azul },
  slogan: { fontSize: 14, color: C.azul, marginTop: 6, marginBottom: 20 },
  resumo: {
    backgroundColor: C.azul,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.borda,
    padding: 12,
  },
  resumoCabecalho: {
    backgroundColor: C.azulCartao,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resumoTexto: { fontSize: 14, lineHeight: 18, color: C.branco },
  resumoCorpo: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  resumoColuna: { flex: 1 },
  resumoLegenda: { fontSize: 13, color: C.legenda, marginBottom: 4 },
  resumoNumero: { fontSize: 36, lineHeight: 44, color: C.branco, fontWeight: '400' },
  resumoDestaque: { fontSize: 30, lineHeight: 44, color: C.branco, fontWeight: '300' },
  resumoAtividade: { fontSize: 17, color: C.branco, marginTop: 8 },
  resumoDivisor: { width: 1, backgroundColor: C.linha, marginHorizontal: 12 },
  vazio: { alignItems: 'center', marginTop: 28 },
  iconeLivro: { ...circulo(76), marginBottom: 16 },
  seloMais: {
    ...circulo(26),
    backgroundColor: C.verde,
    position: 'absolute',
    right: -2,
    bottom: 0,
  },
  vazioTitulo: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: C.azul,
  },
  vazioDescricao: {
    color: C.textoSecundario,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
  },

  atividade: { marginTop: 28 },
  atividadeTituloSecao: { color: C.azul, fontSize: 17, fontWeight: '700', marginBottom: 14 },
  atividadeLinha: { flexDirection: 'row', alignItems: 'center' },
  atividadeItem: { marginBottom: 16 },
  atividadeIcone: { ...circulo(46), marginRight: 12 },
  atividadeTextos: { flex: 1 },
  atividadeTitulo: { fontSize: 14, fontWeight: '600', color: C.azul },
  atividadeDescricao: { fontSize: 13, color: C.textoSecundario, marginTop: 4 },

  modalFundo: {
    flex: 1,
    backgroundColor: C.overlay,
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
  },
  modalTitulo: { fontSize: 18, fontWeight: '800', color: C.azul, marginBottom: 8 },
  modalTexto: { fontSize: 14, lineHeight: 20, color: C.textoSecundario },
  modalLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.lavanda,
  },
  modalFechar: { marginTop: 16 },
});