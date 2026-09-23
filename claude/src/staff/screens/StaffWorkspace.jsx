import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { User, Phone, Mail, MapPin } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function StaffWorkspace() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyClients = async () => {
    setLoading(true);
    try {
      const [profileRes, casesRes, clientsRes] = await Promise.all([
        axios.get(`${API_URL}/auth/me`),
        axios.get(`${API_URL}/cases`),
        axios.get(`${API_URL}/clients`)
      ]);

      const user = profileRes.data;
      
      // Get cases assigned to this user
      const myCases = casesRes.data.filter(c => 
        c.assignedTo && c.assignedTo.some(id => id === user._id || id._id === user._id)
      );
      
      // Get unique client IDs from my cases
      const myClientIds = new Set();
      myCases.forEach(c => {
        if (c.client) {
          myClientIds.add(typeof c.client === 'object' ? c.client._id : c.client);
        }
      });
      
      // Filter clients
      const myClients = clientsRes.data.filter(client => myClientIds.has(client._id));
      setClients(myClients);

    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyClients();
    }, [])
  );

  return (
    <ScrollView className="flex-1 bg-slate-100" showsVerticalScrollIndicator={false}>
      <View className="p-5 pt-2.5 mb-2">
        <Text className="text-2xl font-bold text-slate-900">My Clients</Text>
        <Text className="text-sm text-slate-500 mt-1">Clients associated with your assigned cases.</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : clients.length === 0 ? (
        <View className="flex-1 items-center justify-center pt-20 px-5">
          <View className="w-20 h-20 bg-slate-200 rounded-full items-center justify-center mb-5">
            <User size={32} color="#94a3b8" />
          </View>
          <Text className="text-lg font-bold text-slate-700 mb-2">No Clients Yet</Text>
          <Text className="text-center text-slate-500">You don't have any cases with clients assigned to you at the moment.</Text>
        </View>
      ) : (
        <View className="px-5 pb-10">
          {clients.map(client => (
            <TouchableOpacity key={client._id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3 border border-blue-200">
                  <Text className="text-lg font-bold text-blue-700">{client.name.charAt(0)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900">{client.name}</Text>
                  <Text className="text-xs text-slate-500">{client.type || 'Individual'}</Text>
                </View>
                <View className={`px-2 py-1 rounded-lg ${client.status === 'Active' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                  <Text className={`text-[10px] font-bold ${client.status === 'Active' ? 'text-emerald-700' : 'text-slate-600'}`}>{client.status?.toUpperCase()}</Text>
                </View>
              </View>

              {client.email && (
                <View className="flex-row items-center mb-2">
                  <Mail size={14} color="#64748b" />
                  <Text className="text-[13px] text-slate-600 ml-2">{client.email}</Text>
                </View>
              )}
              
              {client.phone && (
                <View className="flex-row items-center mb-2">
                  <Phone size={14} color="#64748b" />
                  <Text className="text-[13px] text-slate-600 ml-2">{client.phone}</Text>
                </View>
              )}

              {client.address && (
                <View className="flex-row items-center">
                  <MapPin size={14} color="#64748b" />
                  <Text className="text-[13px] text-slate-600 ml-2" numberOfLines={1}>{client.address}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
