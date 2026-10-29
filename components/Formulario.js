import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const C = {
  fundo: '#F4F5F9',
  branco: '#FFFFFF',
  menta: '#8FE0CB',
  azul: '#202A43',
  lavanda: '#DCE3F4',
  texto: '#55607A',
  placeholder: '#9AA2B8',
  borda: '#E2E6F0',
  tracejado: '#8D96B2',
  erro: '#C0392B',
};

export const STATUS = ['Planejado', 'Em andamento', 'Concluído', 'Abandonado'];

export const CATEGORIAS = {
  Filme: {
    status: ['Planejado', 'Concluído', 'Abandonado'],
    icone: 'film-outline',
    imagem: 'Pôster',
    semImagem: 'Sem pôster',
    titulo: 'Título',
    linhas: [
      [
        { chave: 'direcao', rotulo: 'Direção' },
        { chave: 'genero', rotulo: 'Gênero', dica: 'Ex.: suspense' },
      ],
    ],
    linhasFinais: [
      [
        {
          chave: 'dataConclusao',
          rotulo: 'Data de conclusão',
          dica: 'dd/mm/aaaa',
        },
        {
          chave: 'nota',
          rotulo: 'Nota (0 a 5)',
          dica: 'Ex.: 4,5',
          teclado: 'decimal-pad',
        },
      ],
    ],
  },
  Série: {
    icone: 'tv-outline',
    imagem: 'Pôster',
    semImagem: 'Sem pôster',
    titulo: 'Título',
    linhas: [[{ chave: 'genero', rotulo: 'Gênero', dica: 'Ex.: drama' }]],
    linhasFinais: [
      [
        { chave: 'temporada', rotulo: 'Temporada', teclado: 'number-pad' },
        { chave: 'totalEps', rotulo: 'Total de eps', teclado: 'number-pad' },
        {
          chave: 'nota',
          rotulo: 'Nota (0 a 5)',
          dica: 'Ex.: 4,5',
          teclado: 'decimal-pad',
        },
      ],
    ],
  },
  Livro: {
    icone: 'book-outline',
    imagem: 'Capa',
    semImagem: 'Sem capa',
    titulo: 'Título',
    linhas: [
      [
        { chave: 'autor', rotulo: 'Autor' },
        { chave: 'genero', rotulo: 'Gênero', dica: 'Ex.: drama' },
      ],
    ],
    linhasFinais: [
      [
        {
          chave: 'paginasLidas',
          rotulo: 'Páginas lidas',
          teclado: 'number-pad',
        },
        {
          chave: 'totalPaginas',
          rotulo: 'Total de páginas',
          teclado: 'number-pad',
        },
      ],
      [
        {
          chave: 'nota',
          rotulo: 'Nota (0 a 5)',
          dica: 'Ex.: 4,5',
          metade: true,
        },
      ],
    ],
  },
  Jogo: {
    icone: 'game-controller-outline',
    imagem: 'Capa',
    semImagem: 'Sem capa',
    titulo: 'Título',
    linhas: [
      [{ chave: 'plataforma', rotulo: 'Plataforma', dica: 'Ex.: PC, Switch' }],
    ],
    linhasFinais: [
      [
        { chave: 'horas', rotulo: 'Horas jogadas', teclado: 'decimal-pad' },
        {
          chave: 'nota',
          rotulo: 'Nota (0 a 5)',
          dica: 'Ex.: 4,5',
          teclado: 'decimal-pad',
        },
      ],
    ],
  },
  Álbum: {
    icone: 'disc-outline',
    imagem: 'Capa',
    semImagem: 'Sem capa',
    titulo: 'Título do álbum',
    linhas: [
      [
        { chave: 'artista', rotulo: 'Artista' },
        { chave: 'genero', rotulo: 'Gênero', dica: 'Ex.: rock' },
      ],
    ],
    linhasFinais: [
      [
        { chave: 'ouvidoEm', rotulo: 'Ouvido em', dica: 'dd/mm/aaaa' },
        {
          chave: 'nota',
          rotulo: 'Nota (0 a 5)',
          dica: 'Ex.: 4,5',
          teclado: 'decimal-pad',
        },
      ],
    ],
  },
};

const ORDEM = ['Filme', 'Série', 'Livro', 'Jogo', 'Álbum'];

function Rotulo({ children }) {
  return <Text style={styles.rotulo}>{children}</Text>;
}

const CAMPOS_DATA = ['dataConclusao', 'ouvidoEm'];
const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const doisDigitos = (n) => String(n).padStart(2, '0');

function formatarData(data) {
  return `${doisDigitos(data.getDate())}/${doisDigitos(
    data.getMonth() + 1
  )}/${data.getFullYear()}`;
}

function lerData(texto) {
  const partes = (texto || '').split('/');
  if (partes.length !== 3) return null;
  const data = new Date(
    Number(partes[2]),
    Number(partes[1]) - 1,
    Number(partes[0])
  );
  return isNaN(data.getTime()) ? null : data;
}

function limparNota(texto) {
  const t = texto.replace(/\./g, ',').replace(/[^0-9,]/g, '');
  const [inteiro, ...resto] = t.split(',');
  return resto.length ? `${inteiro},${resto.join('').slice(0, 1)}` : inteiro;
}

function notaValida(texto) {
  if (texto === '') return true;
  const numero = parseFloat(texto.replace(',', '.'));
  return !isNaN(numero) && numero >= 0 && numero <= 5;
}

function Calendario({ valor, onSelecionar, onFechar }) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const inicial = lerData(valor) || hoje;
  const selecionada = lerData(valor);

  const [ano, setAno] = useState(inicial.getFullYear());
  const [mes, setMes] = useState(inicial.getMonth());

  const ehMesAtual = ano === hoje.getFullYear() && mes === hoje.getMonth();

  const mudarMes = (delta) => {
    const nova = new Date(ano, mes + delta, 1);
    setAno(nova.getFullYear());
    setMes(nova.getMonth());
  };

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const celulas = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];
  while (celulas.length % 7 !== 0) celulas.push(null);
  const semanas = [];
  for (let i = 0; i < celulas.length; i += 7)
    semanas.push(celulas.slice(i, i + 7));

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onFechar}>
      <Pressable style={styles.calFundo} onPress={onFechar}>
        <Pressable style={styles.calCartao} onPress={() => {}}>
          <View style={styles.calCabecalho}>
            <TouchableOpacity
              onPress={() => mudarMes(-1)}
              hitSlop={10}
              accessibilityLabel="Mês anterior">
              <Ionicons name="chevron-back" size={22} color={C.azul} />
            </TouchableOpacity>
            <Text style={styles.calMes}>
              {MESES[mes]} {ano}
            </Text>
            <TouchableOpacity
              onPress={() => mudarMes(1)}
              disabled={ehMesAtual}
              hitSlop={10}
              accessibilityLabel="Próximo mês">
              <Ionicons
                name="chevron-forward"
                size={22}
                color={ehMesAtual ? C.borda : C.azul}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.calSemana}>
            {DIAS_SEMANA.map((d, i) => (
              <Text key={i} style={styles.calDiaSemana}>
                {d}
              </Text>
            ))}
          </View>

          {semanas.map((semana, i) => (
            <View key={i} style={styles.calSemana}>
              {semana.map((dia, j) => {
                if (!dia) return <View key={j} style={styles.calCelula} />;
                const data = new Date(ano, mes, dia);
                const futuro = data > hoje;
                const ativo =
                  selecionada && data.getTime() === selecionada.getTime();
                return (
                  <TouchableOpacity
                    key={j}
                    style={styles.calCelula}
                    disabled={futuro}
                    onPress={() => onSelecionar(formatarData(data))}
                    activeOpacity={0.7}>
                    <View style={[styles.calDia, ativo && styles.calDiaAtivo]}>
                      <Text
                        style={[
                          styles.calDiaTexto,
                          futuro && styles.calDiaTextoDesativado,
                          ativo && styles.calDiaTextoAtivo,
                        ]}>
                        {dia}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <View style={styles.calRodape}>
            <TouchableOpacity onPress={() => onSelecionar('')} hitSlop={10}>
              <Text style={styles.calAcao}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onFechar} hitSlop={10}>
              <Text style={styles.calAcao}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function CampoData({ campo, valor, onChange }) {
  const [aberto, setAberto] = useState(false);

  return (
    <View style={styles.campo}>
      <Rotulo>{campo.rotulo}</Rotulo>
      <TouchableOpacity
        style={[styles.input, styles.inputData]}
        onPress={() => setAberto(true)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${campo.rotulo}: abrir calendário`}>
        <Text
          style={valor ? styles.inputDataTexto : styles.inputDataDica}
          numberOfLines={1}>
          {valor || campo.dica}
        </Text>
        <Ionicons name="calendar-outline" size={18} color={C.texto} />
      </TouchableOpacity>

      {aberto && (
        <Calendario
          valor={valor}
          onFechar={() => setAberto(false)}
          onSelecionar={(data) => {
            onChange(data);
            setAberto(false);
          }}
        />
      )}
    </View>
  );
}

function CampoNota({ campo, valor, onChange }) {
  const [erro, setErro] = useState(false);

  const aoDigitar = (texto) => {
    const limpo = limparNota(texto);
    if (notaValida(limpo)) {
      setErro(false);
      onChange(limpo);
    } else {
      setErro(true);
    }
  };

  return (
    <View style={styles.campo}>
      <Rotulo>{campo.rotulo}</Rotulo>
      <TextInput
        style={[styles.input, erro && styles.inputErro]}
        value={valor}
        onChangeText={aoDigitar}
        onBlur={() => setErro(false)}
        placeholder={campo.dica}
        placeholderTextColor={C.placeholder}
        keyboardType="decimal-pad"
        maxLength={3}
      />
      {erro ? <Text style={styles.erro}>Use um valor de 0 a 5</Text> : null}
    </View>
  );
}

export function CampoTexto({ rotulo, valor, onChange, dica, teclado }) {
  return (
    <View style={styles.campo}>
      <Rotulo>{rotulo}</Rotulo>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={onChange}
        placeholder={dica}
        placeholderTextColor={C.placeholder}
        keyboardType={teclado || 'default'}
      />
    </View>
  );
}

function Campo({ campo, valor, onChange }) {
  if (CAMPOS_DATA.includes(campo.chave)) {
    return <CampoData campo={campo} valor={valor} onChange={onChange} />;
  }
  if (campo.chave === 'nota') {
    return <CampoNota campo={campo} valor={valor} onChange={onChange} />;
  }

  return (
    <CampoTexto
      rotulo={campo.rotulo}
      valor={valor}
      onChange={onChange}
      dica={campo.dica}
      teclado={campo.teclado}
    />
  );
}

export function LinhaDeCampos({ campos, valores, onChange }) {
  return (
    <View style={styles.linha}>
      {campos.map((campo) => (
        <Campo
          key={campo.chave}
          campo={campo}
          valor={valores[campo.chave] || ''}
          onChange={(texto) => onChange(campo.chave, texto)}
        />
      ))}
      {campos.length === 1 && campos[0].metade ? (
        <View style={styles.campo} />
      ) : null}
    </View>
  );
}

export function SeletorCategoria({ selecionada, onSelecionar }) {
  return (
    <View style={styles.categorias}>
      {ORDEM.map((nome) => {
        const ativa = selecionada === nome;
        return (
          <TouchableOpacity
            key={nome}
            style={[styles.categoria, ativa && styles.categoriaAtiva]}
            onPress={() => onSelecionar(nome)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected: ativa }}>
            <Ionicons
              name={CATEGORIAS[nome].icone}
              size={20}
              color={ativa ? C.branco : C.azul}
            />
            <Text
              style={[
                styles.categoriaTexto,
                ativa && styles.categoriaTextoAtivo,
              ]}>
              {nome}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function SecaoImagem({ categoria }) {
  const { imagem, semImagem } = CATEGORIAS[categoria];
  return (
    <View>
      <Rotulo>{imagem} (opcional)</Rotulo>
      <View style={styles.imagemLinha}>
        <View style={styles.imagemVazia}>
          <Ionicons name="image-outline" size={24} color={C.azul} />
          <Text style={styles.imagemVaziaTexto}>{semImagem}</Text>
        </View>

        <View style={styles.imagemBotoes}>
          <TouchableOpacity style={styles.botaoImagem} activeOpacity={0.8}>
            <Ionicons name="image" size={16} color={C.azul} />
            <Text style={styles.botaoImagemTexto}>Escolher da galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoImagem} activeOpacity={0.8}>
            <Ionicons name="camera" size={16} color={C.azul} />
            <Text style={styles.botaoImagemTexto}>Tirar foto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function SeletorStatus({ selecionado, onSelecionar, lista = STATUS }) {
  return (
    <View>
      <Rotulo>Status</Rotulo>
      <View style={styles.statusLista}>
        {lista.map((status) => {
          const ativo = selecionado === status;
          return (
            <TouchableOpacity
              key={status}
              style={[styles.statusChip, ativo && styles.statusChipAtivo]}
              onPress={() => onSelecionar(status)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: ativo }}>
              {ativo ? (
                <Ionicons
                  name="checkmark"
                  size={15}
                  color={C.azul}
                  style={styles.statusCheck}
                />
              ) : null}
              <Text
                style={[styles.statusTexto, ativo && styles.statusTextoAtivo]}>
                {status}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: { fontSize: 13, fontWeight: '600', color: C.texto, marginBottom: 6 },

  categorias: { flexDirection: 'row', gap: 8 },
  categoria: {
    flex: 1,
    height: 66,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.borda,
    backgroundColor: C.branco,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  categoriaAtiva: { backgroundColor: C.azul, borderColor: C.azul },
  categoriaTexto: { fontSize: 11, fontWeight: '600', color: C.azul },
  categoriaTextoAtivo: { color: C.branco },

  imagemLinha: { flexDirection: 'row', gap: 12 },
  imagemVazia: {
    width: 78,
    height: 104,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: C.tracejado,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  imagemVaziaTexto: { fontSize: 11, color: C.texto },
  imagemBotoes: { flex: 1, gap: 8 },
  botaoImagem: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.borda,
    backgroundColor: C.branco,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botaoImagemTexto: { fontSize: 14, fontWeight: '600', color: C.azul },

  campo: { flex: 1 },
  linha: { flexDirection: 'row', gap: 12 },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.borda,
    backgroundColor: C.branco,
    paddingHorizontal: 15,
    fontSize: 15,
    color: C.azul,
  },

  inputErro: { borderColor: C.erro },
  erro: { fontSize: 12, color: C.erro, marginTop: 4 },
  inputData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputDataTexto: { flex: 1, fontSize: 15, color: C.azul },
  inputDataDica: { flex: 1, fontSize: 15, color: C.placeholder },

  calFundo: {
    flex: 1,
    backgroundColor: 'rgba(32, 42, 67, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  calCartao: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: C.branco,
    borderRadius: 20,
    padding: 16,
  },
  calCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calMes: { fontSize: 16, fontWeight: '700', color: C.azul },
  calSemana: { flexDirection: 'row' },
  calDiaSemana: {
    width: '14.2857%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: C.texto,
    marginBottom: 6,
  },
  calCelula: {
    width: '14.2857%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDia: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDiaAtivo: { backgroundColor: C.azul },
  calDiaTexto: { fontSize: 14, color: C.azul },
  calDiaTextoDesativado: { color: C.placeholder, opacity: 0.5 },
  calDiaTextoAtivo: { color: C.branco, fontWeight: '700' },
  calRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  calAcao: { fontSize: 14, fontWeight: '700', color: C.azul },

  statusLista: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusChip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borda,
    backgroundColor: C.branco,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChipAtivo: { backgroundColor: C.lavanda, borderColor: C.azul },
  statusCheck: { marginRight: 5 },
  statusTexto: { fontSize: 14, color: C.azul },
  statusTextoAtivo: { fontWeight: '700' },
});