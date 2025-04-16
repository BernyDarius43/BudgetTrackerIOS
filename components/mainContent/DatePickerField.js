// components/FormField.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const FormField = ({ label, value, onChangeText, placeholder, keyboardType, multiline }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput 
        style={styles.input} 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff'
  }
});

export default FormField;
