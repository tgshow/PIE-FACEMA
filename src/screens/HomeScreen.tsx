import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import styles from '../screens/styles'


export default function HomeScreen() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState<string>('')

  async function pickImage() {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    })
    if (!result.canceled) setPhoto(result.assets[0].uri)
  }

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      return Alert.alert('Permissão negada', 'É necessário permitir o acesso à localização')
    }
    const loc = await Location.getCurrentPositionAsync({})
    setLocation(`${loc.coords.latitude}, ${loc.coords.longitude}`)
  }

  function handleSubmit() {
    if (!photo || !description || !location) return Alert.alert('Erro', 'Preencha tudo!')
    Alert.alert('Enviado', 'Denúncia registrada com sucesso!')
  }

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>Nova Denúncia</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Tirar Foto</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <TextInput
        placeholder="Descreva o problema..."
        style={styles.input2}
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Obter Localização</Text>
      </TouchableOpacity>
      {location ? <Text style={styles.location}>📍 {location}</Text> : null}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#34C759' }]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Denúncia</Text>
      </TouchableOpacity>
    </View>
  )
}

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
//   button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginVertical: 8 },
//   buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
//   image: { width: '100%', height: 200, marginVertical: 10, borderRadius: 8 },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginVertical: 10 },
//   location: { textAlign: 'center', marginTop: 10, color: '#555' },
// })
