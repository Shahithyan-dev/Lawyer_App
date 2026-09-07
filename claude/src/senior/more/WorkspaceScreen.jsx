import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LayoutDashboard, ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WorkspaceScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 -ml-1">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#001f3f] font-serif">Workspace</Text>
        <View style={{ width: 28 }} />
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <LayoutDashboard size={48} color="#2563eb" strokeWidth={1.5} />
        <Text className="text-2xl font-bold text-[#001f3f] mt-4 font-serif">Workspace</Text>
        <Text className="text-sm text-slate-500 mt-2">Manage your workspace here.</Text>
        
        <View className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 items-center shadow-sm shadow-black/5 elevation-2">
          <Text className="text-lg font-bold text-blue-600 mb-2">Coming Soon</Text>
          <Text className="text-sm text-slate-500 text-center">The Workspace module is currently under development.</Text>
        </View>
      </View>
    </View>
  );
}
