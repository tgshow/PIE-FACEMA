import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";

interface Denuncia {
  id: string;
  descricao: string;
  created_at: string;
  user_id: string;
}

export default function AdminDashboard() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDenuncias = async () => {
    setLoading(true);

    try {
      // 1 — verificar sessão
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const session = sessionData?.session;
      if (!session) {
        throw new Error("Usuário não autenticado.");
      }

      // 2 — verificar se é admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role?.toLowerCase() !== "admin") {
        Alert.alert("Acesso negado", "Apenas administradores podem acessar esta página.");
        setLoading(false);
        return;
      }

      // 3 — buscar denúncias usando apenas colunas EXISTENTES
      const { data, error } = await supabase
        .from("denuncias")
        .select("id, descricao, created_at, user_id")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDenuncias(data || []);
    } catch (err: any) {
      console.error("🔥 Erro geral:", err);
      Alert.alert("Erro", err.message || "Erro inesperado ao carregar denúncias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDenuncias();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDenuncias();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Denuncia }) => (
    <View style={styles.card}>
      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.value}>{item.descricao}</Text>

      <Text style={styles.label}>Criado em:</Text>
      <Text style={styles.value}>
        {new Date(item.created_at).toLocaleString("pt-BR")}
      </Text>

      <Text style={styles.label}>Usuário ID:</Text>
      <Text style={styles.value}>{item.user_id}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando denúncias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Denúncias Recebidas</Text>

      {denuncias.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma denúncia encontrada.</Text>
      ) : (
        <FlatList
          data={denuncias}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: { fontWeight: "bold", color: "#333", marginTop: 6 },
  value: { color: "#555" },
  emptyText: { textAlign: "center", fontSize: 16, color: "#777", marginTop: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#555" },
});
