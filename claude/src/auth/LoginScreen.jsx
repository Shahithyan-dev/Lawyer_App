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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Scale, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { API_URL } from '../config/api';

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
      
      // Save tokens securely to device storage
      await AsyncStorage.setItem('accessToken', res.data.accessToken);
      if (res.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
      }
      // Also save the user ID so we can query for it later if needed
      await AsyncStorage.setItem('userId', res.data._id);

      navigation.replace('Dashboard', { user: res.data });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your network or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#17211F]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 p-6 justify-center">
        <View className="items-center mb-10">
          <Scale size={48} color="#2563eb" />
          <Text className="text-2xl font-bold text-white tracking-widest mt-3">LEXORA</Text>
          <Text className="text-[10px] text-blue-600 tracking-[2px] mt-1">LAW MANAGEMENT SYSTEM</Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-md shadow-black/10 elevation-5">
          <Text className="text-[22px] font-bold text-slate-800 mb-1 text-center">Welcome Back</Text>
          <Text className="text-sm text-slate-500 mb-6 text-center">Sign in to your Lexora account</Text>

          {error && (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-700 text-[13px] text-center">{error}</Text>
            </View>
          )}

          <View className="flex-row items-center border border-slate-200 rounded-lg mb-4 h-[52px] bg-slate-50">
            <View className="px-3">
              <User size={20} color="#94a3b8" />
            </View>
            <TextInput
              className="flex-1 h-full text-slate-800 text-[15px]"
              placeholder="Email or Username"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View className="flex-row items-center border border-slate-200 rounded-lg mb-4 h-[52px] bg-slate-50">
            <View className="px-3">
              <Lock size={20} color="#94a3b8" />
            </View>
            <TextInput
              className="flex-1 h-full text-slate-800 text-[15px]"
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              className="px-3"
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} color="#94a3b8" /> : <EyeOff size={20} color="#94a3b8" />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="self-end mb-6">
            <Text className="text-blue-600 text-sm font-semibold">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-blue-600 h-[52px] rounded-lg flex-row items-center justify-center gap-2" 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text className="text-white text-base font-bold">Sign In</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Temporary Dev Button */}
          <TouchableOpacity
            className="bg-slate-900 h-[52px] rounded-lg flex-row items-center justify-center gap-2 mt-3"
            onPress={() => navigation.navigate('StaffDashboard')}
          >
            <Text className="text-white text-base font-bold">Staff Demo Login</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
