import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginAdm({ navigation }: any) {
  const [email, setEmail] = useState("admcidadeconetada@gmail.com"); // admin padrão
  const [password, setPassword] = useState("admin1231");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      // 1️⃣ Login via Supabase Auth
      const {
        data: { user },
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !user) {
        Alert.alert("Erro", "Email ou senha incorretos.");
        setLoading(false);
        return;
      }

      // 2️⃣ Busca o perfil na tabela `profiles`
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .limit(1); // evita erro "Cannot coerce result to single JSON object"

      if (profileError || !profileData || profileData.length === 0) {
        Alert.alert("Erro", "Não foi possível verificar o perfil do usuário.");
        setLoading(false);
        return;
      }

      const role = profileData[0].role?.trim().toLowerCase();

      // 3️⃣ Verifica se é admin
      if (role !== "admin") {
        Alert.alert("Acesso negado", "Conta não é de administrador.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // 4️⃣ Redireciona para o painel do admin
      Alert.alert("Sucesso", "Login de administrador bem-sucedido!");
      navigation.navigate("AdminDashboard");
    } catch (err) {
      console.error("Erro inesperado:", err);
      Alert.alert("Erro", "Erro interno ao tentar login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login do Administrador</Text>

        <TextInput
          style={styles.input}
          placeholder="Email do admin"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#999" }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("LoginUser")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Voltar para usuário</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    marginTop: 15,
  },
  backText: {
    color: "#007bff",
    textAlign: "center",
  },
});
