// Imagens das obras: ficam no aparelho (pasta do app); no Firebase vai só o nome do arquivo.
import { useEffect, useState } from 'react';
import { Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

// documentDirectory/memora/images/
const pasta = FileSystem.documentDirectory + 'memora/images/';

// Caminho completo de uma imagem salva (ou null se a obra não tem imagem).
// Se o arquivo não existir mais, o componente Capa cai no ícone padrão.
export function caminhoDaImagem(nome) {
  return nome ? pasta + nome : null;
}

// Abre a galeria ou a câmera. Devolve a URI temporária da imagem, ou null se cancelou ou deu erro.
export async function escolherImagem(origem) {
  const opcoes = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.7,
  };

  try {
    let resultado;

    if (origem === 'camera') {
      const permissao = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissao.granted) {
        Alert.alert('Permissão necessária', 'Permita o uso da câmera para tirar a foto.');
        return null;
      }
      resultado = await ImagePicker.launchCameraAsync(opcoes);
    } else {
      // a galeria usa o seletor do sistema, que não precisa de permissão
      resultado = await ImagePicker.launchImageLibraryAsync(opcoes);
    }

    if (resultado.canceled) return null;
    return resultado.assets[0].uri;
  } catch (erro) {
    Alert.alert('Erro', 'Não foi possível abrir a imagem.');
    return null;
  }
}

// Copia a imagem temporária para a pasta do app e devolve o nome do arquivo (ex.: "-Abc123_1793652898745.jpg").
// O id da obra no nome evita conflitos; o horário muda o nome ao trocar a imagem.
export async function salvarImagem(uriTemporaria, idObra) {
  await FileSystem.makeDirectoryAsync(pasta, { intermediates: true });

  const final = uriTemporaria.split('?')[0].split('.').pop().toLowerCase();
  const extensao = ['jpg', 'jpeg', 'png', 'webp'].includes(final) ? final : 'jpg';
  const nome = idObra + '_' + Date.now() + '.' + extensao;

  await FileSystem.copyAsync({ from: uriTemporaria, to: pasta + nome });
  return nome;
}

// Apaga a imagem do aparelho. Sem erro se o arquivo já não existir.
export function apagarImagem(nome) {
  if (!nome) return;
  FileSystem.deleteAsync(pasta + nome, { idempotent: true }).catch(() => {
    // não tem o que fazer: no pior caso sobra um arquivo
  });
}

// Mostra a imagem da obra: pelo nome do arquivo salvo ("nome") ou por uma uri direta ("uri",
// usada na prévia). Se não tiver imagem ou o arquivo sumiu, mostra o "fallback".
export function Capa({ nome, uri, style, fallback }) {
  const [erro, setErro] = useState(false);
  const origem = uri || caminhoDaImagem(nome);

  useEffect(() => setErro(false), [origem]);

  if (!origem || erro) return fallback;

  return (
    <Image
      source={{ uri: origem }}
      style={style}
      resizeMode="cover"
      onError={() => setErro(true)}
    />
  );
}