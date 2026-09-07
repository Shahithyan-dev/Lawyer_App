import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DashboardScreen({ navigation, route }) {
  const { user } = route.params || { user: { name: 'Lawyer' } };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lexora Dashboard</Text>
      <Text style={styles.subtitle}>Welcome back, {user.name}!</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2', // web --bg-color
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#17211F', // Deep Green
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#C6A15B', // Legal Gold
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
