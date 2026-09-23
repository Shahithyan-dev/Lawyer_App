import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { API_URL } from '../config/api';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

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
      await AsyncStorage.setItem('accessToken', res.data.token || res.data.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === 'admin' || role === 'Senior Advocate' || role === 'Admin') {
        navigation.replace('Dashboard', { user: res.data.user });
      } else {
        navigation.replace('StaffDashboard', { user: res.data.user });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!username) {
      setError('Please enter your email to reset your password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { username });
      Alert.alert(
        'Password Reset Successful', 
        res.data?.message || 'Your password has been reset to password123. Please login.',
        [{ text: 'OK' }]
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      
      {/* Top Left Swoosh SVG */}
      <View className="absolute top-0 left-0" style={{ zIndex: 1 }}>
        <Svg width={width * 0.7} height={180} viewBox="0 0 250 180">
          <Path d="M0,0 L250,0 C180,80 100,140 0,160 Z" fill="#0f172a" />
          <Path d="M0,160 C100,140 180,80 250,0 C250,20 200,120 0,180 Z" fill="#b48d3d" />
        </Svg>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-8 pt-24 pb-8 justify-between" style={{ zIndex: 10 }}>
          
          <View>
            {/* Logo Section */}
            <View className="items-center mb-10 mt-6">
              <View className="w-[100px] h-[100px] rounded-full overflow-hidden items-center justify-center bg-[#0f172a] shadow-lg mb-4">
                <Image 
                  source={require('../../assets/logo.png')} 
                  style={{ width: 140, height: 140, resizeMode: 'cover' }}
                />
              </View>
              <Text className="text-[26px] font-black text-[#0f172a] tracking-widest mt-1" style={{ fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif' }}>KETHU KOTAI</Text>
              <View className="w-12 h-[1px] bg-[#b48d3d] my-1" />
              <Text className="text-[13px] text-[#b48d3d] tracking-widest mt-1 italic" style={{ fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif' }}>Vaimaieh Vellum</Text>
            </View>

            {/* Login Form Section */}
            <View className="mb-4">
              <Text className="text-[24px] font-bold text-[#0f172a] mb-1">Login</Text>
              <Text className="text-[14px] text-slate-500 mb-6 leading-5">Access your account to manage your cases, clients and more.</Text>

              {error && (
                <View className="bg-red-50 border border-red-100 p-3 rounded-xl mb-6">
                  <Text className="text-red-600 text-[13px] text-center font-medium">{error}</Text>
                </View>
              )}

              <View className="flex-row items-center border border-slate-200 rounded-xl mb-4 h-[54px] px-4 bg-white">
                <User size={18} color="#94a3b8" strokeWidth={1.5} />
                <TextInput
                  className="flex-1 h-full text-[#0f172a] text-[15px] ml-3"
                  placeholder="Email or Mobile Number"
                  placeholderTextColor="#cbd5e1"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View className="flex-row items-center border border-slate-200 rounded-xl mb-3 h-[54px] px-4 bg-white">
                <Lock size={18} color="#94a3b8" strokeWidth={1.5} />
                <TextInput
                  className="flex-1 h-full text-[#0f172a] text-[15px] ml-3"
                  placeholder="Password"
                  placeholderTextColor="#cbd5e1"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  {showPassword ? <Eye size={18} color="#94a3b8" strokeWidth={1.5} /> : <EyeOff size={18} color="#94a3b8" strokeWidth={1.5} />}
                </TouchableOpacity>
              </View>

              <TouchableOpacity className="self-end mb-6 py-2" onPress={handleForgotPassword} disabled={loading}>
                <Text className="text-[#1d4ed8] text-[13px] font-bold">Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-[#0f172a] h-[54px] rounded-xl flex-row items-center justify-center gap-2 shadow-md shadow-black/20" 
                onPress={handleLogin} 
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text className="text-white text-[15px] font-semibold tracking-wide">Login</Text>
                    <ArrowRight size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Right Swoosh SVG */}
      <View className="absolute bottom-0 right-0" style={{ zIndex: 1 }}>
        <Svg width={width * 0.7} height={120} viewBox="0 0 250 120">
          <Path d="M250,120 L0,120 C80,60 160,20 250,0 Z" fill="#0f172a" />
          <Path d="M250,0 C160,20 80,60 0,120 C30,90 120,0 250,0 Z" fill="#b48d3d" />
        </Svg>
      </View>
    </View>
  );
}
