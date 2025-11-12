import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define o tipo das rotas
type RootStackParamList = {
  AdminLogin: undefined;
  PainelAdmin: undefined;
};

// Tipagem do navigation
type AdminLoginScreenProp = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AdminLogin">;
};

export default function AdminLogin({ navigation }: AdminLoginScreenProp) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }

    const user = data.user;

    if (user && user.user_metadata.role === "admin") {
      navigation.navigate("PainelAdmin");
    } else {
      Alert.alert("Acesso negado", "Você não é administrador!");
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, textAlign: "center", marginBottom: 20 }}>Login do Administrador</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#007AFF",
          padding: 12,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
