import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const CORES = {
  fundo: '#F4F5F9',
  branco: '#FFFFFF',
  azul: '#202A43',
  azulCartao: '#303B5B',
  lavanda: '#DCE3F4',
  texto: '#55607A', 
  borda: '#E2E6F0',
  menta: '#8FE0CB',
  pessego: '#F6C4A8',
};

const OBRAS = [
  {
    id: '1',
    titulo: 'Duna',
    tipo: 'Livros',
    status: 'Concluído',
    cor: CORES.pessego,
    icone: 'book-outline',
    avaliacao: '4,5',
  },
  {
    id: '2',
    titulo: 'Dom Casmurro',
    tipo: 'Livros',
    status: 'Em andamento',
    cor: CORES.pessego,
    icone: 'book-outline',
  },
  {
    id: '3',
    titulo: 'The Bear',
    tipo: 'Séries',
    status: 'Em andamento',
    cor: CORES.verde,
    icone: 'tv-outline',
  },
  {
    id: '4',
    titulo: 'Parasita',
    tipo: 'Filmes',
    status: 'Planejado',
    cor: CORES.azulCartao,
    icone: 'film-outline',
  },
];

const TIPOS = ['Todos', 'Filmes', 'Séries', 'Livros', 'Jogos', 'Álbuns'];

const STATUS = [
  'Todos',
  'Planejado',
  'Em andamento',
  'Concluído',
  'Abandonado',
];

const ICONES_TIPO = {
  Filmes: 'film-outline',
  Séries: 'tv-outline',
  Livros: 'book-outline',
  Jogos: 'game-controller-outline',
  Álbuns: 'musical-notes-outline',
};

function corDoStatus(status) {
  switch (status) {
    case 'Concluído':
      return CORES.verde;
    case 'Planejado':
      return CORES.pessego;
    case 'Abandonado':
      return CORES.borda;
    default:
      return CORES.lavanda;
  }
}


function FiltroChip({ titulo, selecionado, onPress, icone, compacto }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        compacto && styles.chipCompacto,
        selecionado && styles.chipAtivo,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ selected: selecionado }}
    >
      {icone ? (
        <Ionicons
          name={icone}
          size={compacto ? 14 : 16}
          color={selecionado ? CORES.branco : CORES.azul}
          style={styles.chipIcone}
        />
      ) : null}

      <Text
        style={[
          styles.chipTexto,
          compacto && styles.chipTextoCompacto,
          selecionado && styles.chipTextoAtivo,
        ]}
      >
        {titulo}
      </Text>
    </TouchableOpacity>
  );
}

function ObraCard({ obra, onAbrir }) {
  const corIcone = obra.cor === CORES.azulCartao ? CORES.branco : CORES.azul;

  return (
    <TouchableOpacity
      style={styles.obraCard}
      activeOpacity={0.8}
      onPress={onAbrir}
    >
      <View style={[styles.capaObra, { backgroundColor: obra.cor }]}>
        <Ionicons name={obra.icone} size={32} color={corIcone} />
      </View>

      <Text style={styles.obraTitulo} numberOfLines={1}>
        {obra.titulo}
      </Text>

      <View style={styles.metaLinha}>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: corDoStatus(obra.status) },
          ]}
        >
          <Text style={styles.statusTexto}>{obra.status}</Text>
        </View>

        {obra.avaliacao ? (
          <Text style={styles.avaliacao}>★ {obra.avaliacao}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function Biblioteca({ navigation }) {
  const [busca, setBusca] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('Todos');
  const [statusSelecionado, setStatusSelecionado] = useState('Todos');

  const obrasFiltradas = useMemo(() => {
    return OBRAS.filter((obra) => {
      const correspondeBusca = obra.titulo
        .toLowerCase()
        .includes(busca.trim().toLowerCase());

      const correspondeTipo =
        tipoSelecionado === 'Todos' || obra.tipo === tipoSelecionado;

      const correspondeStatus =
        statusSelecionado === 'Todos' || obra.status === statusSelecionado;

      return correspondeBusca && correspondeTipo && correspondeStatus;
    });
  }, [busca, tipoSelecionado, statusSelecionado]);

  const total = obrasFiltradas.length;

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.tituloLinha}>
          <Text style={styles.tituloPagina}>Minha biblioteca</Text>
          <Text style={styles.contagem}>
            {total} {total === 1 ? 'OBRA' : 'OBRAS'}
          </Text>
        </View>

        <View style={styles.buscaContainer}>
          <Ionicons name="search-outline" size={20} color={CORES.texto} />

          <TextInput
            style={styles.campoBusca}
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar por título"
            placeholderTextColor={CORES.texto}
            returnKeyType="search"
          />

          {busca.length > 0 && (
            <TouchableOpacity
              onPress={() => setBusca('')}
              accessibilityLabel="Limpar busca"
              hitSlop={10}
            >
              <Ionicons name="close-circle" size={20} color={CORES.texto} />
            </TouchableOpacity>
          )}
        </View>

        {/* flexGrow: 0 evita que o ScrollView horizontal estique na vertical */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosScroll}
          contentContainerStyle={styles.filtros}
        >
          {TIPOS.map((tipo) => (
            <FiltroChip
              key={tipo}
              titulo={tipo}
              icone={ICONES_TIPO[tipo]}
              selecionado={tipoSelecionado === tipo}
              onPress={() => setTipoSelecionado(tipo)}
            />
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosScroll}
          contentContainerStyle={styles.filtros}
        >
          {STATUS.map((status) => (
            <FiltroChip
              key={status}
              compacto
              titulo={status}
              icone={status === 'Todos' ? 'checkmark' : undefined}
              selecionado={statusSelecionado === status}
              onPress={() => setStatusSelecionado(status)}
            />
          ))}
        </ScrollView>

        {total > 0 ? (
          <View style={styles.grade}>
            {obrasFiltradas.map((obra) => (
              <ObraCard
                key={obra.id}
                obra={obra}
                onAbrir={() =>
                  navigation.navigate('DetalhesObra', { id: obra.id })
                }
              />
            ))}
          </View>
        ) : (
          <View style={styles.semResultados}>
            <Ionicons name="search-outline" size={32} color={CORES.texto} />

            <Text style={styles.semResultadosTitulo}>
              Nenhuma obra encontrada
            </Text>

            <Text style={styles.semResultadosTexto}>
              Tente mudar a busca ou os filtros.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },

  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  tituloPagina: {
    fontSize: 26,
    fontWeight: '800',
    color: CORES.azul,
  },

  contagem: {
    fontSize: 12,
    fontWeight: '700',
    color: CORES.texto,
  },

  buscaContainer: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.branco,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  campoBusca: {
    flex: 1,
    fontSize: 15,
    color: CORES.azul,
    marginLeft: 10,
    paddingVertical: 0,
  },

  filtrosScroll: {
    flexGrow: 0,
  },

  filtros: {
    gap: 8,
    paddingBottom: 14,
    alignItems: 'center',
  },

  chip: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.branco,
    paddingHorizontal: 16,
  },

  chipCompacto: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 13,
  },

  chipAtivo: {
    backgroundColor: CORES.azul,
    borderColor: CORES.azul,
  },

  chipIcone: {
    marginRight: 6,
  },

  chipTexto: {
    color: CORES.texto,
    fontSize: 14,
  },

  chipTextoCompacto: {
    fontSize: 13,
  },

  chipTextoAtivo: {
    color: CORES.branco,
    fontWeight: '600',
  },

  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginTop: 2,
  },

  obraCard: {
    width: '48%',
  },

  capaObra: {
    width: '100%',
    aspectRatio: 175 / 150,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  obraTitulo: {
    color: CORES.azul,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },

  metaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },

  statusPill: {
    height: 19,
    borderRadius: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },

  statusTexto: {
    color: CORES.azul,
    fontSize: 11,
    fontWeight: '500',
  },

  avaliacao: {
    fontSize: 12,
    color: CORES.texto,
  },

  semResultados: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 10,
  },

  semResultadosTitulo: {
    color: CORES.azul,
    fontWeight: '700',
    fontSize: 17,
    marginTop: 10,
  },

  semResultadosTexto: {
    color: CORES.texto,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
});