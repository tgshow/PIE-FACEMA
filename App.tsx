// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importações das telas
import LoginTabs from './src/screens/loginTabs';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdminDashboard from './src/screens/painelAdmin';

// 👇 Tipos de rotas
export type RootStackParamList = {
  LoginTabs: undefined;
  Register: undefined;
  Home: undefined;
  AdminDashboard: undefined; // adicionada
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginTabs"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginTabs" component={LoginTabs} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
