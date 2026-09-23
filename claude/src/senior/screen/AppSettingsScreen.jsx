import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronDown, Check } from 'lucide-react-native';

const Checkbox = ({ checked, onChange }) => (
  <TouchableOpacity 
    className={`w-6 h-6 border rounded items-center justify-center ${checked ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-400'}`} 
    onPress={() => onChange(!checked)}
  >
    {checked && <Check size={16} color="#fff" strokeWidth={3} />}
  </TouchableOpacity>
);

export default function AppSettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-5 pt-2.5 pb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 -ml-1 mr-3">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-slate-900 font-serif">App Settings</Text>
      </View>

      <View className="flex-1 p-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-slate-900">Dark Mode</Text>
          <Checkbox checked={darkMode} onChange={setDarkMode} />
        </View>

        <View className="flex-row items-center justify-between mt-6">
          <Text className="text-lg font-bold text-slate-900">Language</Text>
          <View className="flex-row items-center border border-slate-300 rounded-md px-3 py-2 bg-white min-w-[100px] justify-between">
            <Text className="text-base text-slate-900 mr-2">English</Text>
            <ChevronDown size={18} color="#0f172a" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
