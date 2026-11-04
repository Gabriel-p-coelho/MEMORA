import { useEffect, useState } from 'react';
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
import firebase from '../config/config';
import { PLURAL } from '../components/Obras';
import { C } from '../components/Cores';

const TIPOS = ['Todos', 'Filmes', 'Séries', 'Livros', 'Jogos', 'Álbuns'];

const STATUS = [
  'Todos',
  'Planejado',
  'Em andamento',
  'Concluído',
  'Abandonado',
];

const COR_DO_TIPO = {
  Filmes: C.azulCartao,
  Séries: C.menta,
  Livros: C.pessego,
  Jogos: C.lavanda,
  Álbuns: C.borda,
};

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
      return C.menta;
    case 'Planejado':
      return C.pessego;
    case 'Abandonado':
      return C.borda;
    default:
      return C.lavanda;
  }
}

function FiltroChip({ titulo, selecionado, onPress, icone, compacto }) {
  return (
    <TouchableOpacity
      style={[
        s.chip,
        compacto && s.chipCompacto,
        selecionado && s.chipAtivo,
      ]}
      onPress={onPress}
      activeOpacity={0.75}>
      {icone ? (
        <Ionicons
          name={icone}
          size={compacto ? 14 : 16}
          color={selecionado ? C.branco : C.azul}
          style={s.chipIcone}
        />
      ) : null}

      <Text
        style={[
          s.chipTexto,
          compacto && s.chipTextoCompacto,
          selecionado && s.chipTextoAtivo,
        ]}>
        {titulo}
      </Text>
    </TouchableOpacity>
  );
}

function ObraCard({ obra, onAbrir }) {
  const corIcone = obra.cor === C.azulCartao ? C.branco : C.azul;

  return (
    <TouchableOpacity
      style={s.obraCard}
      activeOpacity={0.8}
      onPress={onAbrir}>
      <View style={[s.capaObra, { backgroundColor: obra.cor }]}>
        <Ionicons name={obra.icone} size={32} color={corIcone} />
      </View>

      <Text style={s.obraTitulo} numberOfLines={1}>
        {obra.titulo}
      </Text>

      <View style={s.metaLinha}>
        <View
          style={[
            s.statusPill,
            { backgroundColor: corDoStatus(obra.status) },
          ]}>
          <Text style={s.statusTexto}>{obra.status}</Text>
        </View>

        {obra.avaliacao ? (
          <Text style={s.avaliacao}>★ {obra.avaliacao}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function Biblioteca({ navigation }) {
  const [obras, setObras] = useState([]);
  const [busca, setBusca] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('Todos');
  const [statusSelecionado, setStatusSelecionado] = useState('Todos');

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref('/usuarios/' + uid + '/obras');

    const escutar = ref.on('value', (snapshot) => {
      const data = snapshot.val();

      if (data == null) {
        setObras([]);
        return;
      }

      const lista = Object.keys(data).map((id) => {
        const tipo = PLURAL[data[id].categoria];
        return {
          ...data[id],
          id: id,
          tipo: tipo,
          cor: COR_DO_TIPO[tipo],
          icone: ICONES_TIPO[tipo],
          avaliacao: data[id].nota,
        };
      });

      setObras(lista.reverse()); // mais recentes primeiro
    });

    return () => ref.off('value', escutar);
  }, []);

  const obrasFiltradas = obras.filter((obra) => {
    const correspondeBusca = obra.titulo
      .toLowerCase()
      .includes(busca.trim().toLowerCase());

    const correspondeTipo =
      tipoSelecionado === 'Todos' || obra.tipo === tipoSelecionado;

    const correspondeStatus =
      statusSelecionado === 'Todos' || obra.status === statusSelecionado;

    return correspondeBusca && correspondeTipo && correspondeStatus;
  });

  const total = obrasFiltradas.length;

  return (
    <SafeAreaView style={s.tela}>
      <ScrollView
        contentContainerStyle={s.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={s.tituloLinha}>
          <Text style={s.tituloPagina}>Minha biblioteca</Text>
          <Text style={s.contagem}>
            {total} {total === 1 ? 'OBRA' : 'OBRAS'}
          </Text>
        </View>

        <View style={s.buscaContainer}>
          <Ionicons name="search-outline" size={20} color={C.texto} />

          <TextInput
            style={s.campoBusca}
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar por título"
            placeholderTextColor={C.texto}
            returnKeyType="search"
          />

          {busca.length > 0 && (
            <TouchableOpacity
              onPress={() => setBusca('')}
              hitSlop={10}>
              <Ionicons name="close-circle" size={20} color={C.texto} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filtrosScroll}
          contentContainerStyle={s.filtros}>
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
          style={s.filtrosScroll}
          contentContainerStyle={s.filtros}>
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
          <View style={s.grade}>
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
          <View style={s.semResultados}>
            <Ionicons name="search-outline" size={32} color={C.texto} />

            <Text style={s.semResultadosTitulo}>
              Nenhuma obra encontrada
            </Text>

            <Text style={s.semResultadosTexto}>
              Tente mudar a busca ou os filtros.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: C.fundo,
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
    color: C.azul,
  },

  contagem: {
    fontSize: 12,
    fontWeight: '700',
    color: C.texto,
  },

  buscaContainer: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.borda,
    backgroundColor: C.branco,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  campoBusca: {
    flex: 1,
    fontSize: 15,
    color: C.azul,
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
    borderColor: C.borda,
    backgroundColor: C.branco,
    paddingHorizontal: 16,
  },

  chipCompacto: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 13,
  },

  chipAtivo: {
    backgroundColor: C.azul,
    borderColor: C.azul,
  },

  chipIcone: {
    marginRight: 6,
  },

  chipTexto: {
    color: C.texto,
    fontSize: 14,
  },

  chipTextoCompacto: {
    fontSize: 13,
  },

  chipTextoAtivo: {
    color: C.branco,
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
    color: C.azul,
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
    color: C.azul,
    fontSize: 11,
    fontWeight: '500',
  },

  avaliacao: {
    fontSize: 12,
    color: C.texto,
  },

  semResultados: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 10,
  },

  semResultadosTitulo: {
    color: C.azul,
    fontWeight: '700',
    fontSize: 17,
    marginTop: 10,
  },

  semResultadosTexto: {
    color: C.texto,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
});