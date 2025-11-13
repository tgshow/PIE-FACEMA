import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function AdminDashboard({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // 1️⃣ Verifica se o usuário logado é admin
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          Alert.alert("Sessão expirada", "Faça login novamente.");
          navigation.replace("LoginAdm");
          return;
        }

        // Busca perfil no Supabase
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .limit(1);

        if (profileError || !profile || profile.length === 0) {
          Alert.alert("Erro", "Não foi possível verificar o perfil do usuário.");
          navigation.replace("LoginAdm");
          return;
        }

        const role = profile[0].role?.trim().toLowerCase();
        if (role !== "admin") {
          Alert.alert("Acesso negado", "Você não tem permissão para acessar esta área.");
          await supabase.auth.signOut();
          navigation.replace("LoginAdm");
          return;
        }

        setAdminEmail(user.email ?? null);
      } catch (err) {
        console.error("Erro ao verificar admin:", err);
        Alert.alert("Erro interno", "Falha ao verificar autenticação.");
        navigation.replace("LoginAdm");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  // 2️⃣ Função de logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    Alert.alert("Sessão encerrada", "Você saiu do painel do administrador.");
    navigation.replace("LoginAdm");
  };

  // 3️⃣ Exibição enquanto carrega
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Verificando acesso...</Text>
      </View>
    );
  }

  // 4️⃣ Painel principal do administrador
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel do Administrador</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Bem-vindo,</Text>
        <Text style={styles.email}>{adminEmail}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Ações Rápidas:</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Denuncias")}
        >
          <Text style={styles.actionText}>📋 Ver Denúncias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Usuarios")}
        >
          <Text style={styles.actionText}>👥 Gerenciar Usuários</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#dc3545" }]}
          onPress={handleLogout}
        >
          <Text style={[styles.actionText, { color: "#fff" }]}>🚪 Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f6f8",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  email: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
