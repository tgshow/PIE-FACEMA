import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  PanResponder,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";

const { width } = Dimensions.get("window");

export default function LoginTabs({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;

  const handleSlide = (index: number) => {
    setActiveTab(index);
    Animated.timing(translateX, {
      toValue: -index * width,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -50 && activeTab === 0) handleSlide(1);
        else if (g.dx > 50 && activeTab === 1) handleSlide(0);
      },
    })
  ).current;

  // 🧍 Login usuário comum
  const handleUserLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data?.user) {
        Alert.alert("Erro", error?.message || "Falha no login.");
        return;
      }

      navigation.replace("Home");
    } catch (err) {
      Alert.alert("Erro", "Problema inesperado no login.");
    } finally {
      setLoading(false);
    }
  };

  // 👨‍💼 LOGIN ADMIN (corrigido)
  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (error || !data?.user) {
        Alert.alert("Erro", "Email ou senha incorretos.");
        return;
      }

      const userId = data.user.id;

      // 🔍 Busca perfil CORRETO (id)
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      // ⚠️ Se perfil não existir → criar automaticamente
      if (!profile) {
        await supabase.from("profiles").insert([
          { id: userId, role: "user" }, // padrão
        ]);

        Alert.alert(
          "Erro",
          "Seu perfil não existia, foi criado agora. Peça ao suporte para torná-lo admin."
        );
        return;
      }

      // ❌ Se não for admin → bloqueia
      if (profile.role?.toLowerCase().trim() !== "admin") {
        Alert.alert("Acesso negado", "Essa conta não é de administrador.");
        await supabase.auth.signOut();
        return;
      }

      // ✔ Tudo certo → entra no painel admin
      navigation.replace("AdminDashboard");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Erro inesperado ao tentar login de administrador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.tabHeader}>
        <Text
          style={[styles.tabText, activeTab === 0 && styles.activeTab]}
          onPress={() => handleSlide(0)}
        >
          Usuário
        </Text>
        <Text
          style={[styles.tabText, activeTab === 1 && styles.activeTab]}
          onPress={() => handleSlide(1)}
        >
          Administrador
        </Text>
      </View>

      <Animated.View
        style={[styles.sliderContainer, { transform: [{ translateX }] }]}
      >
        {/* USUÁRIO */}
        <View style={styles.tabPage}>
          <Text style={styles.title}>Login do Usuário</Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: "#999" }]}
            onPress={handleUserLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ color: "#007bff", textAlign: "center" }}>
              Criar nova conta
            </Text>
          </TouchableOpacity>
        </View>

        {/* ADMIN */}
        <View style={styles.tabPage}>
          <Text style={styles.title}>Login do Administrador</Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail do admin"
            value={adminEmail}
            onChangeText={setAdminEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={adminPassword}
            onChangeText={setAdminPassword}
          />

          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: "#999" }]}
            onPress={handleAdminLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar como Admin</Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#f7f7f7" },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabText: { fontSize: 18, color: "#999" },
  activeTab: { color: "#000", fontWeight: "bold" },
  sliderContainer: { flexDirection: "row", width: width * 2 },
  tabPage: { width: width, paddingHorizontal: 30 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
