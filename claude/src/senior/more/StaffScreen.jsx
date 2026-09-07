import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, Mail, Plus } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function StaffScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setStaff(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const renderStaff = ({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-2">
          <Users size={16} color="#2563eb" />
          <Text className="text-base font-bold text-slate-900 ml-2">{item.name}</Text>
        </View>
        <View className="bg-blue-50 px-2.5 py-1 rounded-xl">
          <Text className="text-[11px] font-bold text-blue-600">{item.role}</Text>
        </View>
      </View>

      <View className="flex-row items-center mt-1">
        <Mail size={14} color="#64748b" />
        <Text className="text-[13px] text-slate-500 ml-1.5">{item.email}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="flex-row justify-between items-center px-5 pt-5 pb-6">
        <View>
          <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">Staff Management</Text>
          <Text className="text-sm text-slate-500 mt-1">Manage your firm's employees.</Text>
        </View>
        <TouchableOpacity
          className="w-11 h-11 bg-blue-600 rounded-xl items-center justify-center"
          onPress={() => navigation.navigate('AddNewStaff')}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-3 text-slate-500">Loading staff from MongoDB...</Text>
        </View>
      ) : error ? (
        <View className="m-5 bg-red-50 p-4 rounded-lg border border-red-200">
          <Text className="text-red-500">Failed to load staff: {error}</Text>
        </View>
      ) : (
        <FlatList
          data={staff}
          keyExtractor={item => item._id}
          renderItem={renderStaff}
          contentContainerClassName="px-5 pb-10"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="p-8 items-center border border-slate-200 rounded-xl border-dashed">
              <Text className="text-slate-500">No staff members found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
