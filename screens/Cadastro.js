import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import firebase from '../config/config';
import { TelaAuth, Titulo, Campo, BotaoPrincipal } from '../components/Auth';
import { C } from '../components/Cores';

export default function Cadastro({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Valida as senhas e cria o usuário no Firebase Auth.
  function criarConta() {
    if (senha !== confirmar) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    const email = usuario.trim().toLowerCase();
    setCarregando(true);

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(() => {
        setCarregando(false);
        Alert.alert('Pronto!', 'Usuário cadastrado com sucesso!');
        navigation.goBack();
      })
      .catch((error) => {
        setCarregando(false);
        if (error.code == 'auth/email-already-in-use') {
          Alert.alert('Erro', 'Esse email já está em uso');
        } else if (error.code == 'auth/weak-password') {
          Alert.alert('Erro', 'Senha fraca, digite outra senha');
        } else if (error.code == 'auth/invalid-email') {
          Alert.alert('Erro', 'Formato do email inválido');
        } else {
          Alert.alert('Erro', 'Ocorreu um erro');
        }
      });
  }

  return (
    <TelaAuth>
      <Titulo
        titulo="Crie sua conta."
        subtitulo="Comece a guardar suas experiências culturais."
      />

      <Campo
        label="Email"
        icone="person-outline"
        placeholder="Digite seu email"
        value={usuario}
        onChangeText={setUsuario}
      />
      <Campo
        label="Senha"
        icone="lock-closed-outline"
        placeholder="Crie uma senha"
        secure
        value={senha}
        onChangeText={setSenha}
      />
      <Campo
        label="Confirmar senha"
        icone="shield-checkmark-outline"
        placeholder="Digite a senha novamente"
        secure
        value={confirmar}
        onChangeText={setConfirmar}
      />

      <BotaoPrincipal
        titulo="Criar conta"
        onPress={criarConta}
        carregando={carregando}
      />

      <View style={s.rodape}>
        <Text style={s.rodapeTexto}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.link}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </TelaAuth>
  );
}

const s = StyleSheet.create({
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  rodapeTexto: { fontSize: 13, color: C.textoSuave },
  link: { fontSize: 14, fontWeight: '700', color: C.azul },
});