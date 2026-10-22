import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const C = {
  fundo: '#F4F5F9',
  branco: '#FFFFFF',
  azul: '#202A43',
  azulCartao: '#303B5B',
  lavanda: '#DCE3F4',
  textoSecundario: '#55607A',
  verde: '#8FE0CB',
  linha: '#6F7890',
};

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

function ResumoMensal() {
  const agora = new Date();
  const mes = agora.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  const periodo = mes.charAt(0).toUpperCase() + mes.slice(1);

  return (
    <View style={styles.resumo}>
      <View style={styles.resumoCabecalho}>
        <Text style={styles.resumoTitulo}>Resumo do mês</Text>
        <Text style={styles.resumoPeriodo}>{periodo}</Text>
      </View>

      <View style={styles.resumoCorpo}>
        <View style={styles.resumoColuna}>
          <Text style={styles.resumoLegenda}>Concluídas este mês</Text>
          <Text style={styles.resumoNumero}>0</Text>
        </View>

        <View style={styles.resumoDivisor} />

        <View style={styles.resumoColuna}>
          <Text style={styles.resumoLegenda}>Mais ativo</Text>
          <Text style={styles.resumoAtividade}>Sem registros</Text>
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

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={onAdicionar}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <Ionicons name="add" size={18} color={C.branco} />
        <Text style={styles.botaoAdicionarTexto}>
          Adicionar primeira obra
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function AtividadeRecente() {
  return (
    <View style={styles.atividade}>
      <Text style={styles.atividadeTituloSecao}>Atividade recente</Text>

      <View style={styles.atividadeLinha}>
        <View style={styles.atividadeIcone}>
          <Ionicons
            name="time-outline"
            size={22}
            color={C.textoSecundario}
          />
        </View>

        <View style={styles.atividadeTextos}>
          <Text style={styles.atividadeTitulo}>
            Tudo pronto para começar
          </Text>
          <Text style={styles.atividadeDescricao}>
            Suas atualizações aparecerão aqui.
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const abrirCadastro = () => navigation.navigate('AdicionarConteudo');

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Logo />
        <Text style={styles.slogan}>
          Sua história, em cada descoberta
        </Text>
        <ResumoMensal />
        <BibliotecaVazia onAdicionar={abrirCadastro} />
        <AtividadeRecente />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: C.fundo,
  },
  scroll: {
    flex: 1,
  },
  conteudo: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  logoLinha: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImagem: {
    width: 56,
    height: 56,
    marginRight: 8,
  },
  logoTexto: {
    fontSize: 40,
    fontWeight: '400',
    letterSpacing: -1.5,
    color: C.azul,
  },
  slogan: {
    fontSize: 14,
    color: C.azul,
    marginTop: 6,
    marginBottom: 20,
  },
  resumo: {
    backgroundColor: C.azul,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D6DDF0',
    padding: 12,
  },
  resumoCabecalho: {
    backgroundColor: C.azulCartao,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resumoTitulo: {
    fontSize: 14,
    lineHeight: 18,
    color: C.branco,
  },
  resumoPeriodo: {
    fontSize: 14,
    lineHeight: 18,
    color: C.branco,
  },
  resumoCorpo: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  resumoColuna: {
    flex: 1,
  },
  resumoLegenda: {
    fontSize: 13,
    color: '#E1E5F0',
    marginBottom: 4,
  },
  resumoNumero: {
    fontSize: 36,
    lineHeight: 44,
    color: C.branco,
    fontWeight: '400',
  },
  resumoAtividade: {
    fontSize: 17,
    color: C.branco,
    marginTop: 8,
  },
  resumoDivisor: {
    width: 1,
    backgroundColor: C.linha,
    marginHorizontal: 12,
  },
  vazio: {
    alignItems: 'center',
    marginTop: 28,
  },
  iconeLivro: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.lavanda,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  seloMais: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.verde,
    alignItems: 'center',
    justifyContent: 'center',
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
  botaoAdicionar: {
    height: 48,
    width: '100%',
    borderRadius: 14,
    backgroundColor: C.azul,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  botaoAdicionarTexto: {
    color: C.branco,
    fontSize: 14,
    fontWeight: '600',
  },
  atividade: {
    marginTop: 28,
  },
  atividadeTituloSecao: {
    color: C.azul,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  atividadeLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atividadeIcone: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.lavanda,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  atividadeTextos: {
    flex: 1,
  },
  atividadeTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: C.azul,
  },
  atividadeDescricao: {
    fontSize: 13,
    color: C.textoSecundario,
    marginTop: 4,
  },
});