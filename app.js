
import { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = {
  fundo: '#F4F5F9',
  branco: '#FFFFFF',
  azul: '#202A43',
  azulCartao: '#303B5B',
  lavanda: '#DCE3F4',
  textoSecundario: '#737D98',
  verde: '#8FE0CB',
  linha: '#6F7890',
};

function Logo() {
  return (
    <View style={styles.logoLinha}>
      <Image
        source={require('./assets/Logo.png')}
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
        <Text style={styles.resumoTitulo}>
          Resumo do mês
        </Text>

        <Text style={styles.resumoPeriodo}>
          {periodo}
        </Text>
      </View>

      <View style={styles.resumoCorpo}>
        <View style={styles.resumoColuna}>
          <Text style={styles.resumoLegenda}>
            Concluídas este mês
          </Text>

          <Text style={styles.resumoNumero}>0</Text>
        </View>

        <View style={styles.resumoDivisor} />

        <View style={styles.resumoColuna}>
          <Text style={styles.resumoLegenda}>
            Mais ativo
          </Text>

          <Text style={styles.resumoAtividade}>
            Sem registros
          </Text>
        </View>
      </View>
    </View>
  );
}

function BibliotecaVazia({ onAdicionar }) {
  return (
    <View style={styles.vazio}>
      <View style={styles.iconeLivro}>
        <Ionicons
          name="book-outline"
          size={25}
          color={C.azul}
        />

        <View style={styles.seloMais}>
          <Ionicons
            name="add"
            size={12}
            color={C.azul}
          />
        </View>
      </View>

      <Text style={styles.vazioTitulo}>
        Sua história começa aqui
      </Text>

      <Text style={styles.vazioDescricao}>
        Livros, filmes, séries, jogos e álbuns.
        {'\n'}Adicione sua primeira obra e guarde
        {'\n'}cada descoberta no Memora.
      </Text>

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={onAdicionar}
        activeOpacity={0.8}
      >
        <Ionicons
          name="add"
          size={15}
          color={C.branco}
        />

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
      <Text style={styles.atividadeTituloSecao}>
        Atividade Recente
      </Text>

      <View style={styles.atividadeLinha}>
        <View style={styles.atividadeIcone}>
          <Ionicons
            name="time-outline"
            size={18}
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

const ABAS = [
  {
    nome: 'Início',
    icone: 'home-outline',
    ativo: 'home',
  },
  {
    nome: 'Biblioteca',
    icone: 'grid-outline',
    ativo: 'grid',
  },
  {
    nome: 'Estatísticas',
    icone: 'stats-chart-outline',
    ativo: 'stats-chart',
  },
  {
    nome: 'Perfil',
    icone: 'person-outline',
    ativo: 'person',
  },
];

function NavegacaoInferior({ onAdicionar }) {
  const [abaAtiva, setAbaAtiva] = useState('Início');

  function selecionarAba(nome) {
    setAbaAtiva(nome);

    if (nome !== 'Início') {
      Alert.alert(
        nome,
        'Esta tela será implementada em uma próxima etapa.'
      );

      setAbaAtiva('Início');
    }
  }

  function renderAba(aba) {
    const ativa = abaAtiva === aba.nome;

    return (
      <TouchableOpacity
        key={aba.nome}
        style={styles.aba}
        onPress={() => selecionarAba(aba.nome)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconeAba,
            ativa && styles.iconeAbaAtiva,
          ]}
        >
          <Ionicons
            name={ativa ? aba.ativo : aba.icone}
            size={19}
            color={ativa ? C.azul : '#7C89AA'}
          />
        </View>

        <Text
          style={[
            styles.textoAba,
            ativa && styles.textoAbaAtivo,
          ]}
        >
          {aba.nome}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.navegacao}>
      {renderAba(ABAS[0])}
      {renderAba(ABAS[1])}

      <TouchableOpacity
        style={styles.botaoCentral}
        onPress={onAdicionar}
        activeOpacity={0.8}
        accessibilityLabel="Adicionar obra"
      >
        <Ionicons
          name="add"
          size={28}
          color={C.branco}
        />
      </TouchableOpacity>

      {renderAba(ABAS[2])}
      {renderAba(ABAS[3])}
    </View>
  );
}

export default function App() {
  function avisarCadastro() {
    Alert.alert(
      'Adicionar obra',
      'O formulário de cadastro será desenvolvido na próxima etapa.'
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.fundo}
      />

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

        <BibliotecaVazia
          onAdicionar={avisarCadastro}
        />

        <AtividadeRecente />
      </ScrollView>

      <NavegacaoInferior
        onAdicionar={avisarCadastro}
      />
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
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },

  logoLinha: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoImagem: {
    width: 36,
    height: 36,
    marginRight: 5,
  },

  logoTexto: {
    fontSize: 29,
    fontWeight: '400',
    letterSpacing: -1,
    color: C.azul,
  },

  slogan: {
    fontSize: 10,
    color: C.azul,
    marginTop: 3,
    marginBottom: 17,
  },

  resumo: {
    backgroundColor: C.azul,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#D6DDF0',
    padding: 8,
  },

  resumoCabecalho: {
    backgroundColor: C.azulCartao,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  resumoTitulo: {
    fontSize: 10,
    color: C.branco,
  },

  resumoPeriodo: {
    fontSize: 10,
    color: C.branco,
    marginTop: 2,
  },

  resumoCorpo: {
    flexDirection: 'row',
    paddingTop: 9,
    paddingBottom: 7,
    minHeight: 57,
  },

  resumoColuna: {
    flex: 1,
  },

  resumoLegenda: {
    fontSize: 9,
    color: '#E1E5F0',
    marginBottom: 3,
  },

  resumoNumero: {
    fontSize: 29,
    color: C.branco,
    fontWeight: '400',
  },

  resumoAtividade: {
    fontSize: 10,
    color: C.branco,
    marginTop: 5,
  },

  resumoDivisor: {
    width: 1,
    backgroundColor: C.linha,
    marginHorizontal: 10,
  },

  vazio: {
    alignItems: 'center',
    marginTop: 19,
  },

  iconeLivro: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.lavanda,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  seloMais: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: C.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vazioTitulo: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    textAlign: 'center',
    color: C.azul,
  },

  vazioDescricao: {
    color: C.textoSecundario,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 7,
  },

  botaoAdicionar: {
    height: 32,
    width: '100%',
    borderRadius: 9,
    backgroundColor: C.azul,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 11,
  },

  botaoAdicionarTexto: {
    color: C.branco,
    fontSize: 10,
    fontWeight: '600',
  },

  atividade: {
    marginTop: 20,
  },

  atividadeTituloSecao: {
    color: C.azul,
    fontSize: 12,
    marginBottom: 9,
  },

  atividadeLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  atividadeIcone: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: C.lavanda,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  atividadeTextos: {
    flex: 1,
  },

  atividadeTitulo: {
    fontSize: 10,
    fontWeight: '600',
    color: '#52607F',
  },

  atividadeDescricao: {
    fontSize: 9,
    color: '#8993AC',
    marginTop: 3,
  },

  navegacao: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: C.branco,
    borderTopWidth: 1,
    borderTopColor: '#E9EBF2',
    paddingHorizontal: 5,
  },

  aba: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeAba: {
    width: 32,
    height: 25,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeAbaAtiva: {
    backgroundColor: C.lavanda,
  },

  textoAba: {
    fontSize: 8,
    color: '#7C89AA',
    marginTop: 1,
  },

  textoAbaAtivo: {
    color: C.azul,
    fontWeight: '600',
  },

  botaoCentral: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: C.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
});
