import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Save } from 'lucide-react-native';

export default function MyProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('Advocate Kumar');
  const [email, setEmail] = useState('kumarlawchambers@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [role, setRole] = useState('Senior Advocate');

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

          <TouchableOpacity className="bg-blue-600 rounded-xl h-[54px] flex-row items-center justify-center mt-2 shadow-sm shadow-blue-600/30 elevation-4" onPress={() => navigation.goBack()}>
            <Save color="#fff" size={20} style={{ marginRight: 8 }} />
            <Text className="color-white text-lg font-bold">Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
