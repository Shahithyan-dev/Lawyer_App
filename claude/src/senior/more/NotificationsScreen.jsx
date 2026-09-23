import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Bell, FileText, Calendar as CalendarIcon } from 'lucide-react-native';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Hearing Tomorrow', message: 'Raj Kumar vs State is scheduled for tomorrow at 10:30 AM in Court Room 4.', time: '2h ago', type: 'hearing', read: false },
  { id: '2', title: 'New Document Uploaded', message: 'Client Priya Sharma uploaded "Bank Statements.pdf"', time: '5h ago', type: 'document', read: false },
  { id: '3', title: 'Deadline Approaching', message: 'Motion to dismiss for CIV-2041 is due in 2 days.', time: '1d ago', type: 'deadline', read: true },
  { id: '4', title: 'Case Closed', message: 'The matter of State vs Mohan Das has been marked as closed.', time: '3d ago', type: 'system', read: true },
];

export default function NotificationsScreen() {
  const renderNotification = ({ item }) => (
    <TouchableOpacity className={`flex-row bg-white rounded-2xl p-4 mb-3 items-start shadow-sm shadow-black/5 elevation-2 border ${!item.read ? 'border-blue-200' : 'border-slate-100'}`}>
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
        item.type === 'hearing' ? 'bg-amber-100' :
        item.type === 'document' ? 'bg-indigo-100' :
        item.type === 'deadline' ? 'bg-red-100' : 'bg-slate-100'
      }`}>
        {item.type === 'hearing' && <CalendarIcon size={20} color="#d97706" />}
        {item.type === 'document' && <FileText size={20} color="#4f46e5" />}
        {item.type === 'deadline' && <Bell size={20} color="#dc2626" />}
        {item.type === 'system' && <Bell size={20} color="#64748b" />}
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className={`text-[15px] ${!item.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{item.title}</Text>
          <Text className="text-xs text-slate-400">{item.time}</Text>
        </View>
        <Text className="text-[13px] text-slate-500 leading-tight" numberOfLines={2}>{item.message}</Text>
      </View>
      {!item.read && <View className="w-2 h-2 rounded-full bg-blue-600 ml-2 mt-1.5" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5">
        <View className="flex-row justify-between items-baseline mt-5 mb-5">
          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">Notifications</Text>
          <TouchableOpacity>
            <Text className="text-sm text-blue-600 font-semibold">Mark all as read</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={MOCK_NOTIFICATIONS}
          keyExtractor={item => item.id}
          renderItem={renderNotification}
          contentContainerClassName="pb-10"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
