import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../lib/supabase";

interface Denuncia {
  id: string;
  descricao: string;
  status: "pendente" | "resolvido" | "rejeitado";
  criado_em: string;
  usuario_id: string;
}

export default function AdminDashboard() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"todas" | "pendente" | "resolvido" | "rejeitado">("todas");

  // 🔍 Buscar denúncias do Supabase
  const fetchDenuncias = async () => {
    setLoading(true);
    try {
      console.log("🌀 Buscando sessão...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const session = sessionData?.session;
      if (!session) throw new Error("Usuário não autenticado.");

      console.log("👤 Usuário logado:", session.user.id);

      // Verifica se o usuário é admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (profileError) throw profileError;
      console.log("🧾 Perfil:", profile);

      const isAdmin = profile?.role?.toLowerCase() === "admin";
      if (!isAdmin) {
        Alert.alert("Acesso negado", "Você não tem permissão para visualizar denúncias.");
        setLoading(false);
        return;
      }

      // Monta query
      let query = supabase.from("denuncias").select("*").order("criado_em", { ascending: false });

      if (selectedStatus !== "todas") {
        query = query.eq("status", selectedStatus);
      }

      console.log("📡 Executando query de denúncias...");
      const { data: denunciasData, error } = await query;

      if (error) {
        console.error("❌ Erro Supabase:", error);
        Alert.alert("Erro", `Falha ao buscar denúncias: ${error.message}`);
        return;
      }

      if (!denunciasData || denunciasData.length === 0) {
        console.log("⚠️ Nenhuma denúncia encontrada.");
        Alert.alert("Aviso", "Nenhuma denúncia foi encontrada.");
      } else {
        console.log("📦 Denúncias recebidas:", denunciasData.length);
      }

      setDenuncias(denunciasData || []);
    } catch (error: any) {
      console.error("🔥 Erro geral:", error.message || error);
      Alert.alert("Erro", error.message || "Erro inesperado ao carregar denúncias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDenuncias();
  }, [selectedStatus]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDenuncias();
    setRefreshing(false);
  };

  // 🔄 Alterar status
  const toggleStatus = async (denuncia: Denuncia) => {
    const nextStatus =
      denuncia.status === "pendente"
        ? "resolvido"
        : denuncia.status === "resolvido"
        ? "rejeitado"
        : "pendente";

    try {
      const { error } = await supabase
        .from("denuncias")
        .update({ status: nextStatus })
        .eq("id", denuncia.id);

      if (error) throw error;

      Alert.alert("✅ Sucesso", `Status alterado para "${nextStatus}".`);
      setDenuncias((prev) =>
        prev.map((d) => (d.id === denuncia.id ? { ...d, status: nextStatus } : d))
      );
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error.message);
      Alert.alert("Erro", "Não foi possível atualizar o status da denúncia.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando denúncias...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Denuncia }) => {
    const statusStyle =
      item.status === "pendente"
        ? styles.pendente
        : item.status === "resolvido"
        ? styles.resolvido
        : styles.rejeitado;

    return (
      <View style={styles.card}>
        <Text style={styles.label}>Descrição:</Text>
        <Text style={styles.value}>{item.descricao}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, statusStyle]}>{item.status}</Text>

        <Text style={styles.label}>Criado em:</Text>
        <Text style={styles.value}>
          {new Date(item.criado_em).toLocaleString("pt-BR")}
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => toggleStatus(item)}>
          <Text style={styles.buttonText}>Alterar Status</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Denúncias Recebidas</Text>

      {/* 🔍 Filtro por status */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por status:</Text>
        <Picker
          selectedValue={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
          style={styles.picker}
        >
          <Picker.Item label="Todas" value="todas" />
          <Picker.Item label="Pendentes" value="pendente" />
          <Picker.Item label="Resolvidas" value="resolvido" />
          <Picker.Item label="Rejeitadas" value="rejeitado" />
        </Picker>
      </View>

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
  filterContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterLabel: { fontSize: 16, fontWeight: "500", marginBottom: 4, color: "#333" },
  picker: { height: 50, color: "#333" },
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
  pendente: { color: "#ff9800" },
  resolvido: { color: "#4caf50" },
  rejeitado: { color: "#f44336" },
  button: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  emptyText: { textAlign: "center", fontSize: 16, color: "#777", marginTop: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#555" },
});
