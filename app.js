import { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import firebase from './config/config';

import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import HomeScreen from './screens/HomeScreen';
import Biblioteca from './screens/Biblioteca';
import AdicionarConteudo from './screens/AdicionarConteudo';
import Perfil from './screens/Perfil';
import DetalhesObra from './screens/DetalhesObra';
import {
  DiarioScreen,
  EstatisticasScreen,
} from './screens/Placeholders.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const C = {
  fundo: '#F4F5F9',
  azul: '#202A43',
  inativo: '#6B7798',
  branco: '#FFFFFF',
};

const temaNavegacao = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: C.fundo },
};

const TelaVazia = () => null;

function Abas() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Início"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: C.azul,
        tabBarInactiveTintColor: C.inativo,
        tabBarStyle: {
          height: 64 + insets.bottom,
          backgroundColor: C.branco,
          borderTopColor: '#E9EBF2',
          paddingTop: 8,
          paddingBottom: insets.bottom + 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'Adicionar') {
            return (
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: C.azul,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -16,
                }}
              >
                <Ionicons name="add" size={30} color={C.branco} />
              </View>
            );
          }

          const icones = {
            Início: focused ? 'home' : 'home-outline',
            Biblioteca: focused ? 'grid' : 'grid-outline',
            Estatísticas: focused ? 'stats-chart' : 'stats-chart-outline',
            Perfil: focused ? 'person' : 'person-outline',
          };

          return <Ionicons name={icones[route.name]} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Biblioteca" component={Biblioteca} />
      <Tab.Screen
        name="Adicionar"
        component={TelaVazia}
        options={{
          tabBarLabel: '',
          tabBarAccessibilityLabel: 'Adicionar obra',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('AdicionarConteudo');
          },
        })}
      />
      <Tab.Screen name="Estatísticas" component={EstatisticasScreen} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer theme={temaNavegacao}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Tabs" component={Abas} />
          <Stack.Screen
            name="AdicionarConteudo"
            component={AdicionarConteudo}
          />
          <Stack.Screen name="DetalhesObra" component={DetalhesObra} />
          <Stack.Screen name="Diario" component={DiarioScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}