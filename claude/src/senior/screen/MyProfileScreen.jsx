import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Save } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function MyProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      const user = response.data; // Interceptor already unwraps .data
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setRole(user.role || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Could not load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Validation Error', 'Name and Email are required');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}/auth/me`, {
        name,
        email,
        phone,
        role
      });
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Could not save profile data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#FAF7F2] justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-5 pt-2.5 pb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 -ml-1 mr-3">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-slate-900 font-serif">My Profile</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerClassName="p-5">
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 h-[54px] text-base text-slate-900 mb-4 shadow-sm shadow-black/5 elevation-1"
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 h-[54px] text-base text-slate-900 mb-4 shadow-sm shadow-black/5 elevation-1"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 h-[54px] text-base text-slate-900 mb-4 shadow-sm shadow-black/5 elevation-1"
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 h-[54px] text-base text-slate-900 mb-4 shadow-sm shadow-black/5 elevation-1"
            value={role}
            onChangeText={setRole}
            placeholder="Role"
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity 
            className="bg-blue-600 rounded-xl h-[54px] flex-row items-center justify-center mt-2 shadow-sm shadow-blue-600/30 elevation-4" 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Save color="#fff" size={20} style={{ marginRight: 8 }} />
                <Text className="color-white text-lg font-bold">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
