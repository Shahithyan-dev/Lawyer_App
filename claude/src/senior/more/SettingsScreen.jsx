import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Settings, Shield, Mail, Phone, ChevronDown, Save } from 'lucide-react-native';

export default function SettingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Firm Profile');

  // Form States
  const [firmName, setFirmName] = useState('Media Wave Legal');
  const [email, setEmail] = useState('contact@mediawavelegal.com');
  const [phone, setPhone] = useState('+91 98765 43210');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const TabItem = ({ title, icon: Icon }) => {
    const isActive = activeTab === title;
    return (
      <TouchableOpacity 
        className={`flex-row items-center py-3.5 px-4 rounded-xl mb-2 ${isActive ? 'bg-white border border-blue-200 shadow-sm shadow-blue-600/5 elevation-2' : ''}`} 
        onPress={() => setActiveTab(title)}
      >
        <Icon size={20} color={isActive ? "#2563eb" : "#64748b"} />
        <Text className={`text-base ml-3 ${isActive ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'}`}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pt-5 pb-10">
        
        {/* Tabs */}
        <View className="mb-5">
          <TabItem title="Firm Profile" icon={User} />
          <TabItem title="System Preferences" icon={Settings} />
          <TabItem title="Security" icon={Shield} />
        </View>

        {/* Content Card */}
        <View className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm shadow-black/5 elevation-2">
          {activeTab === 'Firm Profile' && (
            <>
              <Text className="text-xl font-bold text-slate-900 mb-2">Firm Profile</Text>
              <Text className="text-[15px] color-slate-500 leading-snug mb-4">Update your legal firm's details.</Text>
              <View className="h-px bg-slate-200 mb-6" />

              <Text className="text-[15px] font-semibold text-slate-900 mb-2">Firm Name</Text>
              <View className="flex-row items-center border border-slate-200 rounded-xl bg-slate-50 mb-5 px-3 h-12">
                <User size={18} color="#94a3b8" className="mr-2.5" />
                <TextInput className="flex-1 text-[15px] color-slate-800" value={firmName} onChangeText={setFirmName} />
              </View>

              <Text className="text-[15px] font-semibold text-slate-900 mb-2">Email Address</Text>
              <View className="flex-row items-center border border-slate-200 rounded-xl bg-slate-50 mb-5 px-3 h-12">
                <Mail size={18} color="#94a3b8" className="mr-2.5" />
                <TextInput className="flex-1 text-[15px] color-slate-800" value={email} onChangeText={setEmail} keyboardType="email-address" />
              </View>

              <Text className="text-[15px] font-semibold text-slate-900 mb-2">Phone Number</Text>
              <View className="flex-row items-center border border-slate-200 rounded-xl bg-slate-50 mb-5 px-3 h-12">
                <Phone size={18} color="#94a3b8" className="mr-2.5" />
                <TextInput className="flex-1 text-[15px] color-slate-800" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </View>
            </>
          )}

          {activeTab === 'System Preferences' && (
            <>
              <Text className="text-xl font-bold text-slate-900 mb-2">System Preferences</Text>
              <Text className="text-[15px] color-slate-500 leading-snug mb-4">Configure global settings for the CRM application.</Text>
              <View className="h-px bg-slate-200 mb-6" />

              <Text className="text-[15px] font-semibold text-slate-900 mb-2">Timezone</Text>
              <View className="flex-row items-center justify-between border border-slate-200 rounded-xl bg-slate-50 mb-5 px-4 h-12">
                <Text className="text-[15px] color-slate-800">Asia/Kolkata (IST)</Text>
                <ChevronDown size={20} color="#0f172a" />
              </View>

              <Text className="text-[15px] font-semibold text-slate-900 mb-2">Date Format</Text>
              <View className="flex-row items-center justify-between border border-slate-200 rounded-xl bg-slate-50 mb-5 px-4 h-12">
                <Text className="text-[15px] color-slate-800">DD/MM/YYYY</Text>
                <ChevronDown size={20} color="#0f172a" />
              </View>
            </>
          )}

          {activeTab === 'Security' && (
            <>
              <Text className="text-xl font-bold text-slate-900 mb-2">Security</Text>
              <Text className="text-[15px] color-slate-500 leading-snug mb-4">Manage your password and authentication settings.</Text>
              <View className="h-px bg-slate-200 mb-6" />

              <Text className="text-[15px] font-semibold text-slate-900 mb-2">Current Password</Text>
              <TextInput className="border border-slate-200 rounded-xl bg-slate-50 mb-5 px-4 h-12 text-[15px] color-slate-800" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholder="••••••••" placeholderTextColor="#94a3b8" />

              <Text className="text-[15px] font-semibold text-slate-900 mb-2">New Password</Text>
              <TextInput className="border border-slate-200 rounded-xl bg-slate-50 mb-5 px-4 h-12 text-[15px] color-slate-800" value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="••••••••" placeholderTextColor="#94a3b8" />

              <Text className="text-[15px] font-semibold text-slate-900 mb-2">Confirm New Password</Text>
              <TextInput className="border border-slate-200 rounded-xl bg-slate-50 mb-5 px-4 h-12 text-[15px] color-slate-800" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="••••••••" placeholderTextColor="#94a3b8" />

              <View className="h-px bg-slate-200 mt-6 mb-6" />
              
              <Text className="text-xl font-bold text-slate-900 mb-2">Account Access</Text>
              <Text className="text-[15px] color-slate-500 leading-snug mb-2">Log out of your account on this device.</Text>
              <TouchableOpacity 
                className="bg-red-100 py-3 rounded-xl items-center mt-2 border border-red-300"
                onPress={async () => {
                  try {
                    await AsyncStorage.removeItem('accessToken');
                    await AsyncStorage.removeItem('refreshToken');
                    await AsyncStorage.removeItem('userId');
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    });
                  } catch (e) {
                    console.error('Error logging out', e);
                  }
                }}
              >
                <Text className="color-red-500 text-[15px] font-bold">Log Out</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Save Button for System Preferences and Security */}
          {(activeTab === 'System Preferences' || activeTab === 'Security') && (
            <View className="items-end mt-3">
              <TouchableOpacity className="bg-blue-600 flex-row items-center py-3 px-5 rounded-xl gap-2">
                <Save size={18} color="#fff" />
                <Text className="color-white text-[15px] font-semibold">Save Settings</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
