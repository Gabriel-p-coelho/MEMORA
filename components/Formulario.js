import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIAS, STATUS } from './Obras';
import { C } from './Cores';

// Parte visual do formulário de obras (usada em AdicionarConteudo).
function Rotulo({ children }) {
  return <Text style={s.rotulo}>{children}</Text>;
}

export function CampoTexto({ rotulo, valor, onChange, dica, teclado, maxLength, style }) {
  return (
    <View style={style}>
      <Rotulo>{rotulo}</Rotulo>
      <TextInput
        style={s.input}
        value={valor}
        onChangeText={onChange}
        placeholder={dica}
        placeholderTextColor={C.placeholder}
        keyboardType={teclado || 'default'}
        maxLength={maxLength}
      />
    </View>
  );
}

export function SeletorCategoria({ selecionada, onSelecionar }) {
  return (
    <View style={s.categorias}>
      {Object.keys(CATEGORIAS).map((nome) => {
        const ativa = selecionada === nome;
        return (
          <TouchableOpacity
            key={nome}
            style={[s.categoria, ativa && s.categoriaAtiva]}
            onPress={() => onSelecionar(nome)}
            activeOpacity={0.8}>
            <Ionicons
              name={CATEGORIAS[nome].icone}
              size={20}
              color={ativa ? C.branco : C.azul}
            />
            <Text style={[s.categoriaTexto, ativa && s.categoriaTextoAtivo]}>
              {nome}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Por enquanto só visual: os botões ainda não escolhem imagem.
export function SecaoImagem({ categoria }) {
  const { imagem } = CATEGORIAS[categoria];
  return (
    <View>
      <Rotulo>{imagem} (opcional)</Rotulo>
      <View style={s.imagemLinha}>
        <View style={s.imagemVazia}>
          <Ionicons name="image-outline" size={24} color={C.azul} />
          <Text style={s.imagemVaziaTexto}>Sem {imagem.toLowerCase()}</Text>
        </View>

        <View style={s.imagemBotoes}>
          <TouchableOpacity style={s.botaoImagem} activeOpacity={0.8}>
            <Ionicons name="image" size={16} color={C.azul} />
            <Text style={s.botaoImagemTexto}>Escolher da galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.botaoImagem} activeOpacity={0.8}>
            <Ionicons name="camera" size={16} color={C.azul} />
            <Text style={s.botaoImagemTexto}>Tirar foto</Text>
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
      <View style={s.statusLista}>
        {lista.map((status) => {
          const ativo = selecionado === status;
          return (
            <TouchableOpacity
              key={status}
              style={[s.statusChip, ativo && s.statusChipAtivo]}
              onPress={() => onSelecionar(status)}
              activeOpacity={0.8}>
              {ativo ? (
                <Ionicons name="checkmark" size={15} color={C.azul} style={s.statusCheck} />
              ) : null}
              <Text style={[s.statusTexto, ativo && s.statusTextoAtivo]}>{status}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
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
