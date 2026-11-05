import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from '../config/config';
import { dataDaObra, mediaDasNotas } from '../components/Obras';
import { C } from '../components/Cores';

const PERIODOS = ['Mês', 'Ano', 'Tudo'];

const CATEGORIAS = [
  { categoria: 'Livro', rotulo: 'Livros', cor: C.azul },
  { categoria: 'Filme', rotulo: 'Filmes', cor: C.azulCartao },
  { categoria: 'Série', rotulo: 'Séries', cor: C.menta },
  { categoria: 'Jogo', rotulo: 'Jogos', cor: C.pessego },
  { categoria: 'Álbum', rotulo: 'Álbuns', cor: C.cinza },
];

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function estaNoPeriodo(obra, periodo) {
  if (periodo === 'Tudo') return true;
  const d = new Date(dataDaObra(obra));
  const agora = new Date();
  if (d.getFullYear() !== agora.getFullYear()) return false;
  return periodo === 'Ano' || d.getMonth() === agora.getMonth();
}

function montarAtividade(lista, periodo) {
  const datas = lista.map((obra) => new Date(dataDaObra(obra)));

  if (periodo === 'Mês') {
    const semanas = [0, 0, 0, 0];
    datas.forEach((d) => {
      semanas[Math.min(Math.floor((d.getDate() - 1) / 7), 3)]++;
    });
    return {
      titulo: 'Atividade por semana',
      itens: semanas.map((n, i) => ({ rotulo: 'Sem ' + (i + 1), valor: n })),
    };
  }

  if (periodo === 'Ano') {
    const meses = MESES.map(() => 0);
    datas.forEach((d) => meses[d.getMonth()]++);
    return {
      titulo: 'Atividade por mês',
      itens: meses.map((n, i) => ({ rotulo: MESES[i], valor: n })),
    };
  }

  if (datas.length === 0) return { titulo: 'Atividade por ano', itens: [] };
  const anos = datas.map((d) => d.getFullYear());
  const fim = Math.max(...anos);
  const inicio = Math.max(Math.min(...anos), fim - 4);
  const itens = [];
  for (let ano = inicio; ano <= fim; ano++) {
    itens.push({ rotulo: String(ano), valor: anos.filter((a) => a === ano).length });
  }
  return { titulo: 'Atividade por ano', itens: itens };
}

function CartaoNumero({ rotulo, valor, pequeno }) {
  return (
    <View style={s.cartaoNumero}>
      <Text style={s.cartaoRotulo}>{rotulo}</Text>
      <Text style={[s.cartaoValor, pequeno && s.cartaoValorPequeno]}>
        {valor}
      </Text>
    </View>
  );
}

export default function Estatisticas() {
  const [obras, setObras] = useState([]);
  const [periodo, setPeriodo] = useState('Mês');

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref('/usuarios/' + uid + '/obras');

    const escutar = ref.on('value', (snapshot) => {
      const data = snapshot.val();

      if (data == null) {
        setObras([]);
        return;
      }

      setObras(Object.keys(data).map((id) => ({ ...data[id], id: id })));
    });

    return () => ref.off('value', escutar);
  }, []);

  const lista = obras.filter((obra) => estaNoPeriodo(obra, periodo));

  const concluidas = lista.filter((obra) => obra.status === 'Concluído').length;

  const media = mediaDasNotas(lista);

  const contagens = CATEGORIAS.map((item) => ({
    ...item,
    total: lista.filter((obra) => obra.categoria === item.categoria).length,
  }));
  const maiorCategoria = Math.max(...contagens.map((item) => item.total));
  const maisAtivo = maiorCategoria > 0
    ? contagens.find((item) => item.total === maiorCategoria).rotulo
    : '–';

  const atividade = montarAtividade(lista, periodo);
  const maiorBarra = Math.max(1, ...atividade.itens.map((item) => item.valor));
  const barraFina = atividade.itens.length > 6;

  return (
    <SafeAreaView style={s.tela}>
      <ScrollView
        contentContainerStyle={s.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.titulo}>Estatísticas</Text>

        <View style={s.seletor}>
          {PERIODOS.map((nome) => (
            <TouchableOpacity
              key={nome}
              style={[s.opcao, periodo === nome && s.opcaoAtiva]}
              onPress={() => setPeriodo(nome)}
              activeOpacity={0.8}
              accessibilityState={{ selected: periodo === nome }}
            >
              <Text style={[s.opcaoTexto, periodo === nome && s.opcaoTextoAtivo]}>
                {nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.linhaCartoes}>
          <CartaoNumero rotulo="Concluídas" valor={String(concluidas)} />
          <CartaoNumero rotulo="Nota média" valor={media} />
          <CartaoNumero rotulo="Mais ativo" valor={maisAtivo} pequeno />
        </View>

        <View style={s.bloco}>
          <Text style={s.blocoTitulo}>Por categoria</Text>

          {contagens.map((item) => (
            <View key={item.categoria} style={s.linhaCategoria}>
              <Text style={s.categoriaNome}>{item.rotulo}</Text>
              <View style={s.trilho}>
                <View
                  style={[
                    s.preenchimento,
                    {
                      width: maiorCategoria > 0 ? `${(item.total / maiorCategoria) * 100}%` : '0%',
                      backgroundColor: item.cor,
                    },
                  ]}
                />
              </View>
              <Text style={s.categoriaTotal}>{item.total}</Text>
            </View>
          ))}
        </View>

        <View style={s.bloco}>
          <Text style={s.blocoTitulo}>{atividade.titulo}</Text>

          {atividade.itens.length === 0 ? (
            <Text style={s.vazio}>Sem registros ainda.</Text>
          ) : (
            <View style={s.grafico}>
              {atividade.itens.map((item) => (
                <View key={item.rotulo} style={s.coluna}>
                  <Text style={s.barraValor}>{item.valor}</Text>
                  <View
                    style={[
                      s.barra,
                      barraFina && s.barraFina,
                      {
                        height: Math.max(4, (item.valor / maiorBarra) * 96),
                        backgroundColor:
                          item.valor > 0 && item.valor === maiorBarra ? C.menta : C.lavanda,
                      },
                    ]}
                  />
                  <Text style={s.barraRotulo}>{item.rotulo}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  conteudo: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 16 },

  titulo: { fontSize: 26, fontWeight: '800', color: C.azul, letterSpacing: -0.3 },

  seletor: {
    flexDirection: 'row',
    backgroundColor: C.lavanda,
    borderRadius: 14,
    padding: 4,
  },
  opcao: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoAtiva: { backgroundColor: C.azul },
  opcaoTexto: { fontSize: 14, fontWeight: '500', color: C.azul },
  opcaoTextoAtivo: { fontWeight: '600', color: C.branco },

  linhaCartoes: { flexDirection: 'row', gap: 10 },
  cartaoNumero: {
    flex: 1,
    backgroundColor: C.branco,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 4,
  },
  cartaoRotulo: { fontSize: 12, color: C.texto },
  cartaoValor: { fontSize: 28, lineHeight: 28, fontWeight: '800', color: C.azul },
  cartaoValorPequeno: { fontSize: 20 },

  bloco: {
    backgroundColor: C.branco,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  blocoTitulo: { fontSize: 14, fontWeight: '600', color: C.azul },

  linhaCategoria: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoriaNome: { width: 56, fontSize: 13, color: C.azul },
  trilho: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.fundo,
    overflow: 'hidden',
  },
  preenchimento: { height: 12, borderRadius: 6 },
  categoriaTotal: { width: 20, fontSize: 13, fontWeight: '600', color: C.azul, textAlign: 'right' },

  grafico: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 150,
  },
  coluna: { flex: 1, alignItems: 'center', gap: 4 },
  barraValor: { fontSize: 12, fontWeight: '600', color: C.azul },
  barra: {
    width: 36,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  barraFina: { width: 14 },
  barraRotulo: { fontSize: 11, color: C.texto, marginTop: 4 },

  vazio: { fontSize: 13, color: C.texto },
});