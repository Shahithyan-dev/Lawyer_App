import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { Scale, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';

// NOTE: When running on a physical device, 'localhost' will not work.
// You must use your computer's local IP address (e.g. 192.168.x.x)
const API_URL = 'http://192.168.208.1:5000/api'; 

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      
      // Navigate to dashboard and pass the user data
      navigation.replace('Dashboard', { user: res.data });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your network or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        
        {/* Branding */}
        <View style={styles.brandContainer}>
          <Scale size={48} color="#C6A15B" />
          <Text style={styles.brandTitle}>LEXORA</Text>
          <Text style={styles.brandSubtitle}>LAW MANAGEMENT SYSTEM</Text>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.instructionText}>Sign in to your Lexora account</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Inputs */}
          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <User size={20} color="#94a3b8" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <Lock size={20} color="#94a3b8" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.inputAction} 
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye size={20} color="#94a3b8" />
              ) : (
                <EyeOff size={20} color="#94a3b8" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPwd}>
            <Text style={styles.forgotPwdText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signInBtn} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.signInBtnText}>Sign In</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17211F', // Deep Green Background
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginTop: 12,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#C6A15B',
    letterSpacing: 2,
    marginTop: 4,
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 16,
    height: 52,
    backgroundColor: '#f8fafc',
  },
  inputIconContainer: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1e293b',
    fontSize: 15,
  },
  inputAction: {
    paddingHorizontal: 12,
  },
  forgotPwd: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPwdText: {
    color: '#C6A15B',
    fontSize: 14,
    fontWeight: '600',
  },
  signInBtn: {
    backgroundColor: '#C6A15B',
    height: 52,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signInBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
