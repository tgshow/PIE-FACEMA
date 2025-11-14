import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import styles from '../screens/styles';

export default function HomeScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<string>('');

  async function pickImage() {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Habilite o acesso à localização.');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(`${loc.coords.latitude}, ${loc.coords.longitude}`);
  }

  function handleSubmit() {
    if (!photo || !description || !location) {
      Alert.alert("Erro", "Preencha todos os campos antes de enviar.");
      return;
    }

    Alert.alert("Enviado!", "Sua denúncia foi registrada.");
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Registrar Denúncia</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Abrir Câmera</Text>
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo }} style={styles.image} />}

      <TextInput
        placeholder="Descreva o problema..."
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Obter Localização</Text>
      </TouchableOpacity>

      {location ? <Text style={styles.location}>{location}</Text> : null}

      <TouchableOpacity style={[styles.button, { backgroundColor: '#34C759' }]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Denúncia</Text>
      </TouchableOpacity>

    </View>
  );
}
