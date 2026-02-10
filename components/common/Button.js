// components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const Button = ({ name, icon, onPress, bg, bPad, color, bRad }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.button,
        { backgroundColor: bg || '#3b82f6', padding: bPad || 16, borderRadius: bRad || 25 }
      ]}
    >
      <View style={styles.inner}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.text, { color: color || '#fff' }]}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
  }
});

export default Button;
