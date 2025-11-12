import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import styles from "../screens/styles";

export default function HomeScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(
    null
  );

  // Pede permissão da câmera e da localização
  useEffect(() => {
    (async () => {
      const { status: camStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (camStatus !== "granted") {
        Alert.alert("Permissão necessária", "Permita o uso da câmera.");
      }

      const { status: locStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locStatus !== "granted") {
        Alert.alert("Permissão necessária", "Permita o uso da localização.");
      }
    })();
  }, []);

  // 📸 Abrir câmera
  async function pickImage() {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  }

  // 📍 Obter localização
  async function getLocation() {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter sua localização.");
    }
  }

  //  Enviar denúncia
  function handleSubmit() {
    if (!photo || !description || !location)
      return Alert.alert("Erro", "Preencha todos os campos!");
    Alert.alert("Sucesso ✅", "Denúncia registrada com sucesso!");
  }

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>Nova Denúncia</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>📷 Tirar Foto</Text>
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo }} style={styles.image} />}

      <TextInput
        placeholder="Descreva o problema..."
        style={styles.input2}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>📍 Obter Localização</Text>
      </TouchableOpacity>

      {/* Exibe mini mapa se a localização for obtida */}
      {location && (
        <View style={localStyles.mapContainer}>
          <MapView
            style={localStyles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Sua localização"
            />
          </MapView>
          <Text style={styles.location}>
            📍 {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#34C759" }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Enviar Denúncia</Text>
      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
});
