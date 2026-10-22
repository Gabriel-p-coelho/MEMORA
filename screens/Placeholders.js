// Telas provisórias, sem Alert: cada uma será substituída pela tela real.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const C = {
  fundo: '#F4F5F9',
  azul: '#202A43',
  texto: '#737D98',
  lavanda: '#DCE3F4',
  branco: '#FFFFFF',
};

function Base({ titulo, descricao, navigation, voltar, children }) {
  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.cabecalho}>
        {voltar && (
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel="Voltar"
            style={styles.voltar}
          >
            <Ionicons name="arrow-back" size={24} color={C.azul} />
          </Pressable>
        )}
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
      <View style={styles.corpo}>{children}</View>
    </SafeAreaView>
  );
}

function Botao({ rotulo, onPress, secundario }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.botao, secundario ? styles.botaoSec : styles.botaoPrim]}
    >
      <Text style={[styles.botaoTxt, secundario && { color: C.azul }]}>{rotulo}</Text>
    </Pressable>
  );
}

export function AdicionarConteudoScreen({ navigation, route }) {
  const editando = route.params?.id;
  return (
    <Base
      titulo={editando ? 'Editar conteúdo' : 'Adicionar conteúdo'}
      descricao="Categoria (Filme, Série, Livro, Jogo, Álbum) e campos adaptados."
      navigation={navigation}
      voltar
    >
      <Botao rotulo="Salvar" onPress={() => navigation.goBack()} />
      <Botao rotulo="Cancelar" secundario onPress={() => navigation.goBack()} />
    </Base>
  );
}

export function DetalhesObraScreen({ navigation, route }) {
  const { id } = route.params;
  return (
    <Base titulo="Detalhes da obra" descricao={`id: ${id}`} navigation={navigation} voltar>
      <Botao
        rotulo="Editar"
        onPress={() => navigation.navigate('AdicionarConteudo', { id })}
      />
      <Botao rotulo="Excluir" secundario onPress={() => navigation.goBack()} />
    </Base>
  );
}

export function DiarioScreen({ navigation }) {
  return (
    <Base
      titulo="Meu Diário"
      descricao="Linha do tempo de atividades."
      navigation={navigation}
      voltar
    />
  );
}

export function EstatisticasScreen() {
  return <Base titulo="Estatísticas" descricao="Mês · Ano · Tudo" />;
}

export function PerfilScreen({ navigation }) {
  return (
    <Base titulo="Perfil" descricao="Preferências e sua jornada cultural.">
      <Botao rotulo="Meu Diário" secundario onPress={() => navigation.navigate('Diario')} />
    </Base>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo, paddingHorizontal: 18 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', minHeight: 44, marginTop: 8 },
  voltar: { width: 44, height: 44, justifyContent: 'center', marginLeft: -10 },
  titulo: { fontSize: 24, fontWeight: '800', color: C.azul },
  descricao: { fontSize: 13, color: C.texto, marginTop: 4 },
  corpo: { gap: 12, marginTop: 16 },
  botao: { minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  botaoPrim: { backgroundColor: C.azul },
  botaoSec: { backgroundColor: C.lavanda },
  botaoTxt: { fontSize: 15, fontWeight: '600', color: C.branco },
});