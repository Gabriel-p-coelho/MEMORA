// Funções e dados compartilhados pelas telas que leem as obras.

export const PLURAL = {
  Filme: 'Filmes',
  Série: 'Séries',
  Livro: 'Livros',
  Jogo: 'Jogos',
  Álbum: 'Álbuns',
};

// Data usada para ordenar e agrupar a obra: conclusão/escuta, senão a última atualização.
export function dataDaObra(obra) {
  const partes = (obra.dataConclusao || obra.ouvidoEm || '').split('/');
  if (partes.length === 3) {
    const d = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return obra.atualizadaEm || obra.criadaEm || 0;
}

// Nota média das obras da lista, no formato "4,5" (ou "–" se ninguém tem nota).
export function mediaDasNotas(lista) {
  const notas = lista
    .map((obra) => parseFloat(String(obra.nota || '').replace(',', '.')))
    .filter((n) => !isNaN(n));

  if (notas.length === 0) return '–';

  const media = Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10;
  return media.toString().replace('.', ',');
}