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
} from "react-native";
import { supabase } from "../lib/supabase";

const { width } = Dimensions.get("window");

export default function LoginTabs({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [activeTab, setActiveTab] = useState(0); // 0 = user, 1 = admin
  const translateX = useRef(new Animated.Value(0)).current;

  // Função que faz o deslize animado entre abas
  const handleSlide = (index: number) => {
    setActiveTab(index);
    Animated.timing(translateX, {
      toValue: -index * width,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  // Habilita deslizar com o dedo
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50 && activeTab === 0) handleSlide(1);
        else if (gestureState.dx > 50 && activeTab === 1) handleSlide(0);
      },
    })
  ).current;

  // Login normal
  const handleUserLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else navigation.navigate("Home");
  };

  // Login ADM
  const handleAdminLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) return alert(error.message);

    // Verifica se o usuário é admin
    const { data: userData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    if (userData?.role === "admin") navigation.navigate("AdminDashboard");
    else alert("Acesso negado. Conta não é de administrador.");
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Indicadores de aba */}
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

      {/* Áreas de login animadas */}
      <Animated.View
        style={[
          styles.sliderContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Login Usuário */}
        <View style={styles.tabPage}>
          <Text style={styles.title}>Login do Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleUserLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        {/* Login ADM */}
        <View style={styles.tabPage}>
          <Text style={styles.title}>Login do Administrador</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail do admin"
            value={adminEmail}
            onChangeText={setAdminEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={adminPassword}
            onChangeText={setAdminPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
            <Text style={styles.buttonText}>Entrar como Admin</Text>
          </TouchableOpacity>

          {/* Botão de voltar com animação suave */}
          <TouchableOpacity onPress={() => handleSlide(0)}>
            <Text style={styles.link}>← Voltar para usuário</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40,
    marginBottom: 20,
  },
  tabText: {
    fontSize: 18,
    color: "#999",
  },
  activeTab: {
    color: "#000",
    fontWeight: "bold",
  },
  sliderContainer: {
    flexDirection: "row",
    width: width * 2,
  },
  tabPage: {
    width: width,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    textAlign: "center",
    marginTop: 10,
  },
});
