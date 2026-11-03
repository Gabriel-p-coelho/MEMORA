import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../config/config';

const C = {
  fundo: '#F4F5F9',
  branco: '#FFFFFF',
  azul: '#202A43',
  lavanda: '#DCE3F4',
  texto: '#55607A',
  menta: '#8FE0CB',
};

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function dataDaObra(obra) {
  const partes = (obra.dataConclusao || obra.ouvidoEm || '').split('/');
  if (partes.length === 3) {
    const d = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return obra.atualizadaEm || obra.criadaEm || 0;
}

function rotuloDoDia(tempo) {
  const dia = new Date(tempo);
  dia.setHours(0, 0, 0, 0);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  let texto = dia.getDate() + ' ' + MESES[dia.getMonth()];
  if (dia.getFullYear() !== hoje.getFullYear()) texto += ' ' + dia.getFullYear();

  const diferenca = Math.round((hoje - dia) / 86400000);
  if (diferenca === 0) return 'HOJE · ' + texto;
  if (diferenca === 1) return 'ONTEM · ' + texto;
  return texto;
}

function detalhe(obra) {
  if (obra.status === 'Concluído') {
    return obra.categoria + (obra.nota ? ' · nota ' + obra.nota : '');
  }
  if (obra.categoria === 'Livro' && obra.totalPaginas) {
    return 'Livro · ' + (obra.paginasLidas || 0) + ' / ' + obra.totalPaginas + ' págs';
  }
  if (obra.categoria === 'Série' && obra.totalEps) {
    return 'Série · temporada ' + (obra.temporada || 1) + ' · ' + obra.totalEps + ' eps';
  }
  if (obra.categoria === 'Jogo' && obra.horas) {
    return 'Jogo · ' + obra.horas + ' h no total';
  }
  return obra.categoria;
}

function Registro({ obra }) {
  const concluida = obra.status === 'Concluído';

  return (
    <View style={styles.cartao}>
      <View style={styles.cartaoTopo}>
        <Text style={styles.cartaoTitulo}>
          {concluida ? 'Concluiu ' + obra.titulo : obra.titulo}
        </Text>
        {concluida ? (
          <View style={styles.selo}>
            <Text style={styles.seloTexto}>Concluído</Text>
          </View>
        ) : (
          <Text style={styles.cartaoStatus}>{obra.status}</Text>
        )}
      </View>

      <Text style={styles.cartaoDetalhe}>{detalhe(obra)}</Text>

      {obra.opiniao ? (
        <View style={styles.opiniaoBox}>
          <Text style={styles.opiniao}>“{obra.opiniao}”</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function Diario({ navigation }) {
  const [obras, setObras] = useState([]);

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

  const ordenadas = [...obras].sort((a, b) => dataDaObra(b) - dataDaObra(a));
  const dias = [];
  ordenadas.forEach((obra) => {
    const rotulo = rotuloDoDia(dataDaObra(obra));
    const ultimo = dias[dias.length - 1];
    if (ultimo && ultimo.rotulo === rotulo) {
      ultimo.obras.push(obra);
    } else {
      dias.push({ rotulo: rotulo, obras: [obra] });
    }
  });

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecalho}>
          <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Voltar" style={styles.voltar}>
            <Ionicons name="arrow-back" size={24} color={C.azul} />
          </Pressable>
          <Text style={styles.titulo}>Meu Diário</Text>
        </View>
        <Text style={styles.subtitulo}>Sua linha do tempo cultural</Text>

        {dias.length === 0 ? (
          <Text style={styles.vazio}>
            Nenhum registro ainda. Adicione obras para ver sua linha do tempo.
          </Text>
        ) : (
          <View style={styles.linhaDoTempo}>
            <View style={styles.linha} />

            {dias.map((dia, i) => (
              <View key={dia.rotulo} style={styles.dia}>
                <View style={[styles.ponto, i === 0 && styles.pontoAtual]} />
                <Text style={styles.diaRotulo}>{dia.rotulo}</Text>
                {dia.obras.map((obra) => (
                  <Registro key={obra.id} obra={obra} />
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  conteudo: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  cabecalho: { flexDirection: 'row', alignItems: 'center' },
  voltar: { width: 44, height: 44, justifyContent: 'center', marginLeft: -10 },
  titulo: { fontSize: 22, fontWeight: '800', color: C.azul, letterSpacing: -0.2 },
  subtitulo: { fontSize: 13, color: C.texto, marginBottom: 24 },
  vazio: { fontSize: 14, color: C.texto, textAlign: 'center', marginTop: 40 },

  linhaDoTempo: { paddingLeft: 22, gap: 14 },
  linha: {
    position: 'absolute',
    left: 5,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: C.lavanda,
  },
  dia: { gap: 6 },
  ponto: {
    position: 'absolute',
    left: -22,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.azul,
    backgroundColor: C.branco,
  },
  pontoAtual: { backgroundColor: C.menta },
  diaRotulo: { fontSize: 12, fontWeight: '600', color: C.texto },

  cartao: {
    backgroundColor: C.branco,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  cartaoTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  cartaoTitulo: { flex: 1, fontSize: 14, fontWeight: '600', color: C.azul },
  cartaoStatus: { fontSize: 13, color: C.texto },
  cartaoDetalhe: { fontSize: 13, color: C.texto },
  selo: { backgroundColor: C.menta, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  seloTexto: { fontSize: 11, fontWeight: '600', color: C.azul },

  opiniaoBox: { borderTopWidth: 1, borderTopColor: C.lavanda, paddingTop: 9, marginTop: 4 },
  opiniao: { fontSize: 14, lineHeight: 20, color: C.azul },
});