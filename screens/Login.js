import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import {
  TelaAuth,
  Titulo,
  Campo,
  BotaoPrincipal,
} from '../components/Auth';
import firebase from '../config/config';
import { C } from '../components/Cores';

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Entra com email e senha no Firebase Auth; se der certo, vai para as abas.
  function entrar() {
    const email = usuario.trim().toLowerCase();
    setCarregando(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then(() => {
        navigation.replace('Tabs');
      })
      .catch((error) => {
        setCarregando(false);
        if (error.code == 'auth/invalid-email') {
          Alert.alert('Erro', 'Formato do email inválido');
        } else {
          Alert.alert('Erro', 'Email ou senha incorretos');
        }
      });
  }

  return (
    <TelaAuth>
      <Titulo
        titulo="Que bom ter você de volta."
        subtitulo="Entre para continuar sua jornada cultural."
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
        placeholder="Digite sua senha"
        secure
        value={senha}
        onChangeText={setSenha}
      />

      <BotaoPrincipal
        titulo="Entrar"
        onPress={entrar}
        carregando={carregando}
      />

      <View style={s.rodape}>
        <Text style={s.rodapeTexto}>Ainda não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={s.link}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </TelaAuth>
  );
}

const s = StyleSheet.create({
  rodape: { alignItems: 'center', marginTop: 28 },
  rodapeTexto: { fontSize: 13, color: C.textoSuave, marginBottom: 6 },
  link: { fontSize: 14, fontWeight: '700', color: C.azul },
});