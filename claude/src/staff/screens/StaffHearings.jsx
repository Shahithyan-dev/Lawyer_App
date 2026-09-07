import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MapPin, Gavel } from 'lucide-react-native';

export default function StaffHearings() {
  const hearings = [
    { id: '1', date: 'Oct 14', time: '10:00 AM', case: 'Smith v. State', court: 'Supreme Court, Room 4B', judge: 'Hon. Arthur Pendelton', type: 'Final Argument' },
    { id: '2', date: 'Oct 15', time: '02:30 PM', case: 'Doe LLC Dispute', court: 'District Court, Room 2A', judge: 'Hon. Sarah Jenkins', type: 'Motion Hearing' },
    { id: '3', date: 'Oct 18', time: '09:00 AM', case: 'Johnson Real Estate', court: 'Civil Court, Room 1C', judge: 'Hon. Mark Rivers', type: 'Pre-trial Conference' },
  ];

  const renderHearing = ({ item, index }) => (
    <View className="flex-row min-h-[120px]">
      <View className="w-[50px] items-center pt-4">
        <Text className="text-xs text-slate-500 uppercase font-bold">{item.date.split(' ')[0]}</Text>
        <Text className="text-xl font-bold text-slate-900 mt-0.5">{item.date.split(' ')[1]}</Text>
      </View>
      
      <View className="w-[30px] items-center">
        <View className="w-3 h-3 rounded-full bg-blue-500 mt-[22px] z-10" />
        {index !== hearings.length - 1 && <View className="w-0.5 flex-1 bg-slate-300 absolute top-[22px] -bottom-[20px]" />}
      </View>

      <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 mb-5 shadow-sm shadow-black/5 elevation-2">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-sm font-bold text-blue-500">{item.time}</Text>
          <View className="bg-slate-100 px-2 py-1 rounded-lg">
            <Text className="text-[10px] font-semibold text-slate-500">{item.type}</Text>
          </View>
        </View>
        
        <Text className="text-base font-bold text-slate-900 mb-3">{item.case}</Text>
        
        <View className="flex-row items-center mb-2">
          <MapPin size={14} color="#64748b" />
          <Text className="text-[13px] text-slate-500 ml-2">{item.court}</Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <Gavel size={14} color="#64748b" />
          <Text className="text-[13px] text-slate-500 ml-2">{item.judge}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-100">
      <View className="p-5 pt-2.5 pb-7">
        <Text className="text-2xl font-bold text-slate-900">Upcoming Hearings</Text>
        <Text className="text-sm text-slate-500 mt-1">You have {hearings.length} hearings scheduled</Text>
      </View>

      <FlatList
        data={hearings}
        keyExtractor={item => item.id}
        renderItem={renderHearing}
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
