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
import { CATEGORIAS, STATUS, lerObras } from '../components/Obras';
import { C } from '../components/Cores';
import { Capa } from '../components/Imagens';

const TIPOS = ['Todos', ...Object.keys(CATEGORIAS)];
const STATUS_FILTRO = ['Todos', ...STATUS];

const COR_DO_STATUS = {
  Concluído: C.menta,
  Planejado: C.pessego,
  Abandonado: C.borda,
};

function FiltroChip({ titulo, selecionado, onPress, icone }) {
  return (
    <TouchableOpacity
      style={[s.chip, selecionado && s.chipAtivo]}
      onPress={onPress}
      activeOpacity={0.75}>
      {icone ? (
        <Ionicons
          name={icone}
          size={16}
          color={selecionado ? C.branco : C.azul}
          style={s.chipIcone}
        />
      ) : null}

      <Text style={[s.chipTexto, selecionado && s.chipTextoAtivo]}>{titulo}</Text>
    </TouchableOpacity>
  );
}

// Cartão de uma obra na grade da biblioteca.
function ObraCard({ obra, onAbrir }) {
  const categoria = CATEGORIAS[obra.categoria];

  return (
    <TouchableOpacity style={s.obraCard} activeOpacity={0.8} onPress={onAbrir}>
      <Capa
        nome={obra.imageName}
        style={s.capaObra}
        fallback={
          <View style={[s.capaObra, { backgroundColor: categoria.cor }]}>
            <Ionicons
              name={categoria.icone}
              size={32}
              color={categoria.cor === C.azulCartao ? C.branco : C.azul}
            />
          </View>
        }
      />

      <Text style={s.obraTitulo} numberOfLines={1}>
        {obra.titulo}
      </Text>

      <View style={s.metaLinha}>
        <View
          style={[
            s.statusPill,
            { backgroundColor: COR_DO_STATUS[obra.status] || C.lavanda },
          ]}>
          <Text style={s.statusTexto}>{obra.status}</Text>
        </View>

        {obra.nota ? <Text style={s.avaliacao}>★ {obra.nota}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

export default function Biblioteca({ navigation }) {
  const [obras, setObras] = useState([]);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [status, setStatus] = useState('Todos');

  useEffect(() => {
    // reverse(): mais recentes primeiro
    return lerObras((lista) => setObras(lista.reverse()));
  }, []);

  // Aplica a busca por título e os filtros de categoria e status.
  const obrasFiltradas = obras.filter((obra) => {
    const porBusca = obra.titulo.toLowerCase().includes(busca.trim().toLowerCase());
    const porTipo = tipo === 'Todos' || obra.categoria === tipo;
    const porStatus = status === 'Todos' || obra.status === status;
    return porBusca && porTipo && porStatus;
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
          />

          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')} hitSlop={10}>
              <Ionicons name="close-circle" size={20} color={C.texto} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filtrosScroll}
          contentContainerStyle={s.filtros}>
          {TIPOS.map((nome) => (
            <FiltroChip
              key={nome}
              titulo={nome === 'Todos' ? 'Todos' : CATEGORIAS[nome].plural}
              icone={nome === 'Todos' ? undefined : CATEGORIAS[nome].icone}
              selecionado={tipo === nome}
              onPress={() => setTipo(nome)}
            />
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filtrosScroll}
          contentContainerStyle={s.filtros}>
          {STATUS_FILTRO.map((nome) => (
            <FiltroChip
              key={nome}
              titulo={nome}
              selecionado={status === nome}
              onPress={() => setStatus(nome)}
            />
          ))}
        </ScrollView>

        {total > 0 ? (
          <View style={s.grade}>
            {obrasFiltradas.map((obra) => (
              <ObraCard
                key={obra.id}
                obra={obra}
                onAbrir={() => navigation.navigate('DetalhesObra', { id: obra.id })}
              />
            ))}
          </View>
        ) : (
          <View style={s.semResultados}>
            <Ionicons name="search-outline" size={32} color={C.texto} />
            <Text style={s.semResultadosTitulo}>Nenhuma obra encontrada</Text>
            <Text style={s.semResultadosTexto}>Tente mudar a busca ou os filtros.</Text>
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
    aspectRatio: 3 / 4, // formato retrato, igual ao recorte da imagem
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