import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, TextInput, Linking } from 'react-native';
import { Search, Plus, Phone, Mail } from 'lucide-react-native';

const MOCK_CLIENTS = [
  { _id: '1', clientId: 'CLI-001', name: 'Raj Kumar', mobile: '+91 98765 43210', email: 'raj.kumar@email.com', status: 'Active' },
  { _id: '2', clientId: 'CLI-002', name: 'Arun Enterprises', mobile: '+91 91234 56789', email: 'contact@arunent.com', status: 'Active' },
  { _id: '3', clientId: 'CLI-003', name: 'Priya Sharma', mobile: '+91 99887 76655', email: 'priya.s@email.com', status: 'Inactive' },
  { _id: '4', clientId: 'CLI-004', name: 'Mohan Das', mobile: '+91 98765 12345', email: 'mohan.d@email.com', status: 'Active' },
];

export default function ClientsScreen({ navigation }) {
  
  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const renderClient = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4 mb-3 shadow-sm shadow-black/5 elevation-2 border border-slate-100"
      onPress={() => navigation.navigate('ClientDetails', { clientData: item })}
    >
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3 border border-slate-200">
          <Text className="text-base font-bold text-slate-500">{item.name.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-slate-900">{item.name}</Text>
          <Text className="text-xs text-slate-400 mt-0.5">{item.clientId}</Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${item.status === 'Active' ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-100 border border-slate-200'}`}>
          <Text className={`text-[10px] font-bold uppercase ${item.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'}`}>
            {item.status}
          </Text>
        </View>
      </View>

      <View className="flex-row border-t border-slate-100 pt-3">
        <TouchableOpacity className="flex-row items-center flex-1 justify-center" onPress={() => handleCall(item.mobile)}>
          <Phone size={16} color="#64748b" />
          <Text className="text-[13px] text-slate-500 ml-2 font-medium">{item.mobile}</Text>
        </TouchableOpacity>
        <View className="w-px bg-slate-100" />
        <TouchableOpacity className="flex-row items-center flex-1 justify-center" onPress={() => handleEmail(item.email)}>
          <Mail size={16} color="#64748b" />
          <Text className="text-[13px] text-slate-500 ml-2 font-medium">Email</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FAF7F2]">
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="mt-5 mb-4">
          <Text className="text-[28px] font-extrabold text-[#17211F] tracking-tight">Clients</Text>
          <Text className="text-sm text-slate-500 mt-1">Manage your client database and dossiers.</Text>
        </View>

        {/* Search & Actions */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 flex-row items-center bg-white rounded-xl px-3 border border-slate-200 shadow-sm shadow-black/5">
            <Search size={18} color="#94a3b8" />
            <TextInput 
              className="flex-1 ml-2 h-11 text-slate-900 text-sm"
              placeholder="Search clients..."
              placeholderTextColor="#94a3b8"
            />
          </View>
          <TouchableOpacity className="w-11 h-11 bg-blue-600 rounded-xl items-center justify-center shadow-sm shadow-blue-600/30 elevation-2">
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={MOCK_CLIENTS}
          keyExtractor={item => item._id}
          renderItem={renderClient}
          contentContainerClassName="pb-10"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
