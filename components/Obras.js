// Dados e funções compartilhados pelas telas que usam as obras.
import firebase from '../config/config';
import { C } from './Cores';

export const STATUS = ['Planejado', 'Em andamento', 'Concluído', 'Abandonado'];

const NOTA = {
  chave: 'nota',
  rotulo: 'Nota (0 a 5)',
  dica: 'Ex.: 4,5',
  teclado: 'decimal-pad',
  maxLength: 3,
};

// Configuração de cada categoria (usada no formulário, biblioteca, estatísticas...).
// "campos" aparecem antes do status e "progresso" depois dele.
// Cada item é uma linha do formulário: os campos da linha dividem a largura igualmente.
export const CATEGORIAS = {
  Filme: {
    plural: 'Filmes',
    icone: 'film-outline',
    cor: C.azulCartao,
    imagem: 'Pôster',
    status: ['Planejado', 'Concluído', 'Abandonado'],
    campos: [
      [
        { chave: 'direcao', rotulo: 'Direção' },
        { chave: 'genero', rotulo: 'Gênero', dica: 'Ex.: suspense' },
      ],
    ],
    progresso: [[NOTA]],
  },
  Série: {
    plural: 'Séries',
    icone: 'tv-outline',
    cor: C.menta,
    imagem: 'Pôster',
    campos: [[{ chave: 'genero', rotulo: 'Gênero', dica: 'Ex.: drama' }]],
    progresso: [
      [
        { chave: 'temporada', rotulo: 'Temporada', teclado: 'number-pad' },
        { chave: 'totalEps', rotulo: 'Total de eps', teclado: 'number-pad' },
        NOTA,
      ],
    ],
  },
  Livro: {
    plural: 'Livros',
    icone: 'book-outline',
    cor: C.pessego,
    imagem: 'Capa',
    campos: [
      [
        { chave: 'autor', rotulo: 'Autor' },
        { chave: 'genero', rotulo: 'Gênero', dica: 'Ex.: romance' },
      ],
    ],
    progresso: [
      [
        { chave: 'paginasLidas', rotulo: 'Págs. lidas', teclado: 'number-pad' },
        { chave: 'totalPaginas', rotulo: 'Total de págs.', teclado: 'number-pad' },
        NOTA,
      ],
    ],
  },
  Jogo: {
    plural: 'Jogos',
    icone: 'game-controller-outline',
    cor: C.lavanda,
    imagem: 'Capa',
    campos: [[{ chave: 'plataforma', rotulo: 'Plataforma', dica: 'Ex.: PS5, Switch' }]],
    progresso: [
      [{ chave: 'horas', rotulo: 'Horas jogadas', teclado: 'decimal-pad' }, NOTA],
    ],
  },
  Álbum: {
    plural: 'Álbuns',
    icone: 'musical-notes-outline',
    cor: C.cinza,
    imagem: 'Capa',
    titulo: 'Título do álbum',
    campos: [
      [
        { chave: 'artista', rotulo: 'Artista' },
        { chave: 'genero', rotulo: 'Gênero', dica: 'Ex.: rock' },
      ],
    ],
    progresso: [[NOTA]],
  },
};

// Lê as obras do usuário em tempo real (mesmo padrão da aula: ref.on('value')).
// Chama aoMudar(lista) a cada mudança e devolve a função que para de escutar.
export function lerObras(aoMudar) {
  const uid = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref('/usuarios/' + uid + '/obras');

  const escutar = ref.on('value', (snapshot) => {
    const lista = [];
    snapshot.forEach((filho) => {
      lista.push({ ...filho.val(), id: filho.key });
    });
    aoMudar(lista);
  });

  return () => ref.off('value', escutar);
}

// Data usada para ordenar e agrupar a obra: conclusão, senão última atualização.
export function dataDaObra(obra) {
  return obra.concluidaEm || obra.atualizadaEm || obra.criadaEm || 0;
}

// Transforma "4,5" em 4.5 (devolve NaN se estiver vazio).
export function lerNota(texto) {
  return parseFloat(String(texto || '').replace(',', '.'));
}

// Nota média das obras da lista, no formato "4,5" (ou "–" se ninguém tem nota).
export function mediaDasNotas(lista) {
  let soma = 0;
  let quantas = 0;

  lista.forEach((obra) => {
    const nota = lerNota(obra.nota);
    if (!isNaN(nota)) {
      soma += nota;
      quantas++;
    }
  });

  if (quantas === 0) return '–';
  return (Math.round((soma / quantas) * 10) / 10).toString().replace('.', ',');
}