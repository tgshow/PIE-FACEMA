import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "AdminDashboard">;

export default function LoginAdmin() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) return alert(error.message);

    const user = data.user;

    // Busca o perfil e verifica se o usuário é admin
    const { data: perfil, error: perfilError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (perfilError) {
      console.error(perfilError);
      return alert("Erro ao verificar permissões.");
    }

    if (perfil?.role === "admin") {
      alert("Bem-vindo, Administrador!");
      navigation.navigate("AdminDashboard");
    } else {
      alert("Acesso negado: esta conta não é de administrador.");
      await supabase.auth.signOut(); // Desloga automaticamente se não for admin
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login de Administrador</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f7f7f7" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  botao: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
