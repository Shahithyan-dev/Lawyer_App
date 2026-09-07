import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

export default function HelpSupportScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-5 pt-2.5 pb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 -ml-1 mr-3">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-slate-900 font-serif">Help & Support</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <View className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm shadow-black/5 elevation-1">
          <Text className="text-lg font-bold text-slate-900 mb-3">Contact Support</Text>
          <Text className="text-base text-slate-500 mb-2">support@lexora.com</Text>
          <Text className="text-base text-slate-500 mb-2">1800-123-4567</Text>
        </View>

        <View className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm shadow-black/5 elevation-1">
          <Text className="text-lg font-bold text-slate-900 mb-3">FAQs</Text>
          <TouchableOpacity className="py-2 border-b border-slate-100 mb-2">
            <Text className="text-base text-slate-500">How to add a new case?</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2 border-b border-slate-100">
            <Text className="text-base text-slate-500">How to manage client records?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
