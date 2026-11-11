import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIAS, lerObras, dataDaObra } from '../components/Obras';
import { C } from '../components/Cores';

//Estilo das atividades recentes
const circulo = (tamanho) => ({
  width: tamanho,
  height: tamanho,
  borderRadius: tamanho / 2,
  backgroundColor: C.lavanda,
  alignItems: 'center',
  justifyContent: 'center',
});

// Transforma uma data em 'hoje', 'ontem', 'há N dias'...
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

// Quantas obras foram concluídas neste mês e qual categoria teve mais.
function resumoDoMes(obras) {
  const agora = new Date();
  const contagem = {};
  let concluidas = 0;

  obras.forEach((obra) => {
    const data = new Date(dataDaObra(obra));
    const esteMes =
      data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();

    if (obra.status === 'Concluído' && esteMes) {
      concluidas++;
      contagem[obra.categoria] = (contagem[obra.categoria] || 0) + 1;
    }
  });

  let maisAtivo = null;
  for (const categoria in contagem) {
    if (!maisAtivo || contagem[categoria] > contagem[maisAtivo]) maisAtivo = categoria;
  }

  return { concluidas, maisAtivo: maisAtivo ? CATEGORIAS[maisAtivo].plural : null };
}

// O que cada obra "fez" por último: concluiu, atualizou ou foi adicionada.
function ultimaAtividade(obra) {
  if (obra.status === 'Concluído') {
    return { obra, verbo: 'Concluiu', icone: 'checkmark', tempo: dataDaObra(obra) };
  }
  if (obra.atualizadaEm) {
    return { obra, verbo: 'Atualizou', icone: 'pencil-outline', tempo: obra.atualizadaEm };
  }
  return { obra, verbo: 'Adicionou', icone: 'add', tempo: obra.criadaEm || 0 };
}

// Botão da Home: escuro por padrão, claro com a propriedade 'claro'.
function Botao({ texto, onPress, claro, style }) {
  return (
    <TouchableOpacity
      style={[s.botao, claro && s.botaoClaro, style]}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text style={[s.botaoTexto, claro && s.botaoTextoClaro]}>{texto}</Text>
    </TouchableOpacity>
  );
}

function Logo() {
  return (
    <View style={s.logoLinha}>
      <Image
        source={require('../assets/Logo.png')}
        style={s.logoImagem}
        resizeMode="contain"
      />
      <Text style={s.logoTexto}>memora</Text>
    </View>
  );
}

function ResumoMensal({ concluidas, maisAtivo }) {
  const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const periodo = mes.charAt(0).toUpperCase() + mes.slice(1);

  return (
    <View style={s.resumo}>
      <View style={s.resumoCabecalho}>
        <Text style={s.resumoTexto}>Resumo do mês</Text>
        <Text style={s.resumoTexto}>{periodo}</Text>
      </View>

      <View style={s.resumoCorpo}>
        <View style={s.resumoColuna}>
          <Text style={s.resumoLegenda}>Concluídas este mês</Text>
          <Text style={s.resumoNumero}>{concluidas}</Text>
        </View>

        <View style={s.resumoDivisor} />

        <View style={s.resumoColuna}>
          <Text style={s.resumoLegenda}>Mais ativo</Text>
          {maisAtivo ? (
            <Text style={s.resumoDestaque}>{maisAtivo.toUpperCase()}</Text>
          ) : (
            <Text style={s.resumoAtividade}>Sem registros</Text>
          )}
        </View>
      </View>
    </View>
  );
}

function BibliotecaVazia({ onAdicionar }) {
  return (
    <View style={s.vazio}>
      <View style={s.iconeLivro}>
        <Ionicons name="book-outline" size={36} color={C.azul} />
        <View style={s.seloMais}>
          <Ionicons name="add" size={16} color={C.azul} />
        </View>
      </View>

      <Text style={s.vazioTitulo}>Sua história começa aqui</Text>
      <Text style={s.vazioDescricao}>
        Livros, filmes, séries, jogos e álbuns.
        {'\n'}Adicione sua primeira obra e guarde
        {'\n'}cada descoberta no Memora.
      </Text>

      <Botao texto="Adicionar primeira obra" onPress={onAdicionar} style={s.botaoLargo} />
    </View>
  );
}

function AtividadeRecente({ itens, onAbrir }) {
  return (
    <View style={s.atividade}>
      <Text style={s.atividadeTituloSecao}>Atividade recente</Text>

      {itens.length === 0 ? (
        <View style={s.atividadeLinha}>
          <View style={s.atividadeIcone}>
            <Ionicons name="time-outline" size={22} color={C.texto} />
          </View>

          <View style={s.atividadeTextos}>
            <Text style={s.atividadeTitulo}>Tudo pronto para começar</Text>
            <Text style={s.atividadeDescricao}>Suas atualizações aparecerão aqui.</Text>
          </View>
        </View>
      ) : (
        itens.map((item) => (
          <TouchableOpacity
            key={item.obra.id}
            style={[s.atividadeLinha, s.atividadeItem]}
            activeOpacity={0.7}
            onPress={() => onAbrir(item.obra.id)}>
            <View
              style={[
                s.atividadeIcone,
                item.verbo === 'Concluiu' && { backgroundColor: C.menta },
              ]}>
              <Ionicons name={item.icone} size={22} color={C.azul} />
            </View>

            <View style={s.atividadeTextos}>
              <Text style={s.atividadeTitulo} numberOfLines={1}>
                {item.verbo} {item.obra.titulo}
              </Text>
              <Text style={s.atividadeDescricao}>
                {item.obra.categoria} · {quandoFoi(item.tempo)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

// Tela inicial: resumo do mês, botões de ação e atividade recente.
export default function HomeScreen({ navigation }) {
  const [obras, setObras] = useState(null); // null = ainda carregando
  const [progressoAberto, setProgressoAberto] = useState(false);

  useEffect(() => lerObras(setObras), []);

  const emAndamento = obras ? obras.filter((obra) => obra.status === 'Em andamento') : [];
  const novaObra = () => navigation.navigate('AdicionarConteudo');
  const abrirObra = (id) => navigation.navigate('DetalhesObra', { id });

  return (
    <SafeAreaView style={s.tela}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.conteudo}
        showsVerticalScrollIndicator={false}>
        <Logo />
        <Text style={s.slogan}>Sua história, em cada descoberta</Text>

        {obras && (
          <>
            <ResumoMensal {...resumoDoMes(obras)} />

            {obras.length === 0 ? (
              <BibliotecaVazia onAdicionar={novaObra} />
            ) : (
              <View style={s.botoes}>
                <Botao texto="+ Nova obra" onPress={novaObra} style={s.botaoHome} />
                <Botao
                  texto="Registrar Progresso"
                  claro
                  onPress={() => setProgressoAberto(!progressoAberto)}
                  style={s.botaoHome}
                />
              </View>
            )}

            {progressoAberto && (
              <View style={s.progresso}>
                <Text style={s.progressoTitulo}>Registrar progresso</Text>

                {emAndamento.length === 0 ? (
                  <Text style={s.progressoTexto}>
                    Nenhuma obra em andamento. Mude o status de uma obra para "Em
                    andamento" para registrar o progresso aqui.
                  </Text>
                ) : (
                  emAndamento.map((obra) => (
                      <TouchableOpacity
                        key={obra.id}
                        style={s.progressoLinha}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('AdicionarConteudo', { id: obra.id })}>
                        <View style={{ flex: 1 }}>
                          <Text style={s.atividadeTitulo} numberOfLines={1}>
                            {obra.titulo}
                          </Text>
                          <Text style={s.atividadeDescricao}>{obra.categoria}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={C.azul} />
                      </TouchableOpacity>
                    ))
                )}
              </View>
            )}

            <AtividadeRecente
              itens={obras
                .map(ultimaAtividade)
                .sort((a, b) => b.tempo - a.tempo)
                .slice(0, 4)}
              onAbrir={abrirObra}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  scroll: { flex: 1 },
  conteudo: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  botao: {
    height: 48,
    borderRadius: 14,
    backgroundColor: C.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoClaro: { backgroundColor: C.branco },
  botaoTexto: { fontSize: 14, fontWeight: '600', color: C.branco },
  botaoTextoClaro: { color: C.azul },
  botaoLargo: { width: '100%', marginTop: 16 },
  botoes: { flexDirection: 'row', gap: 12, marginTop: 20 },
  botaoHome: {
    flex: 1,
    shadowColor: C.azul,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  logoLinha: { height: 56, flexDirection: 'row', alignItems: 'center' },
  logoImagem: { width: 56, height: 56, marginRight: 8 },
  logoTexto: { fontSize: 40, fontWeight: '400', letterSpacing: -1.5, color: C.azul },
  slogan: { fontSize: 14, color: C.azul, marginTop: 6, marginBottom: 20 },
  resumo: {
    backgroundColor: C.azul,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.bordaResumo,
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
  resumoDivisor: { width: 1, backgroundColor: C.divisorEscuro, marginHorizontal: 12 },
  vazio: { alignItems: 'center', marginTop: 28 },
  iconeLivro: { ...circulo(76), marginBottom: 16 },
  seloMais: {
    ...circulo(26),
    backgroundColor: C.menta,
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
    color: C.texto,
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
  atividadeDescricao: { fontSize: 13, color: C.texto, marginTop: 4 },
  progresso: {
    backgroundColor: C.branco,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  progressoTitulo: { fontSize: 18, fontWeight: '800', color: C.azul, marginBottom: 8 },
  progressoTexto: { fontSize: 14, lineHeight: 20, color: C.texto },
  progressoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.lavanda,
  },
});