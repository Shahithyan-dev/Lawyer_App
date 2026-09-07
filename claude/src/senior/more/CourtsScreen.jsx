import React from 'react';
import { View, Text } from 'react-native';
import { Scale } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CourtsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      <View className="px-5 mt-5 mb-5">
        <Text className="text-[28px] font-bold text-[#17211F]">Courts</Text>
        <Text className="text-sm text-slate-500 mt-1">Manage your courts here.</Text>
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <Scale size={48} color="#2563eb" strokeWidth={1.5} />
        
        <View className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 items-center shadow-sm shadow-black/5 elevation-2">
          <Text className="text-lg font-bold text-blue-600 mb-2">Coming Soon</Text>
          <Text className="text-sm text-slate-500 text-center">The Courts module is currently under development.</Text>
        </View>
      </View>
    </View>
  );
}
