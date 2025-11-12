import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import supabase from '../services/supabase'

import styles from '../screens/styles'

export default function AuthTestScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<any>(null)
  useEffect(() => {
    const currentSession = supabase.auth.getSession()
    currentSession.then(res => setSession(res.data.session))
  }, [])

  async function handleSignUp() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      console.log('Erro no cadastro:', error)
      Alert.alert('Erro no cadastro', error.message)
    } else {
      console.log('Usuário cadastrado:', data)
      Alert.alert('Sucesso', 'Usuário cadastrado! Confira o console.')
    }
  }

  async function handleSignIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      console.log('Erro no login:', error)
      Alert.alert('Erro no login', error.message)
    } else {
      console.log('Usuário logado:', data)
      setSession(data.session)
      Alert.alert('Sucesso', 'Login realizado!')
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert('Erro ao sair', error.message)
    } else {
      setSession(null)
      Alert.alert('Logout', 'Sessão encerrada!')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>

      {!session && (
        <>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </>
      )}

      {session && (
        <>
          <Text style={styles.sessionText}>Usuário logado!</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}