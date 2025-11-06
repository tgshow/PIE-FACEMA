import React from 'react'
import { TextInput, StyleSheet, TextInputProps } from 'react-native'

export function Input(props: TextInputProps) {
  return <TextInput style={styles.input} placeholderTextColor="#888" {...props} />
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
})
