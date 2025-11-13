import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Input } from "../components/Input";
import { supabase } from "../lib/supabase";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // 🟢 Cria o usuário na autenticação
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert("Erro ao cadastrar", error.message);
        return;
      }

      // ⚙️ Cria o perfil na tabela 'profiles'
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            user_id: data.user.id,
            role: "user",
          },
        ]);

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError);
          Alert.alert(
            "Aviso",
            "Conta criada, mas houve um erro ao salvar o perfil."
          );
        }
      }

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      navigation.replace("loginTabs");
    } catch (err) {
      console.error("Erro inesperado:", err);
      Alert.alert("Erro", "Ocorreu um problema ao criar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>

      <Input
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#aaa" }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Criando conta..." : "Criar Conta"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{ marginTop: 15 }}
      >
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#34C759",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
