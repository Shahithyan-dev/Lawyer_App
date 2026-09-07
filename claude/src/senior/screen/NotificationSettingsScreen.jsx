import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Check } from 'lucide-react-native';

const Checkbox = ({ checked, onChange }) => (
  <TouchableOpacity 
    className={`w-6 h-6 border-2 rounded items-center justify-center ${checked ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}`} 
    onPress={() => onChange(!checked)}
  >
    {checked && <Check size={16} color="#fff" strokeWidth={3} />}
  </TouchableOpacity>
);

export default function NotificationSettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-5 pt-2.5 pb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 -ml-1 mr-3">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-slate-900 font-serif">Notification Settings</Text>
      </View>

      <View className="flex-1 p-5">
        <View className="bg-white border border-slate-200 rounded-xl p-5 mb-4 shadow-sm shadow-black/5 elevation-1 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-bold text-slate-900 mb-1">Push Notifications</Text>
            <Text className="text-[15px] text-slate-500">Receive alerts on your device</Text>
          </View>
          <Checkbox checked={pushEnabled} onChange={setPushEnabled} />
        </View>

        <View className="bg-white border border-slate-200 rounded-xl p-5 mb-4 shadow-sm shadow-black/5 elevation-1 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-bold text-slate-900 mb-1">Email Notifications</Text>
            <Text className="text-[15px] text-slate-500">Receive daily case summaries</Text>
          </View>
          <Checkbox checked={emailEnabled} onChange={setEmailEnabled} />
        </View>
      </View>
    </View>
  );
}
