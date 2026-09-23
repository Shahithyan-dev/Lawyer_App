import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Linking, ActivityIndicator } from 'react-native';
import { Search, Filter, Plus, Calendar, Phone, Mail } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function CasesScreen({ navigation, route }) {
  const [viewMode, setViewMode] = useState(route.params?.initialView || 'Cases');
  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'Active');
  
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchCasesAndClients = async () => {
    setLoading(true);
    try {
      const [casesRes, clientsRes] = await Promise.all([
        axios.get(`${API_URL}/cases`),
        axios.get(`${API_URL}/clients`)
      ]);
      setCases(casesRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCasesAndClients();
      if (route.params?.initialView) setViewMode(route.params.initialView);
      if (route.params?.initialTab) setActiveTab(route.params.initialTab);
    }, [route.params])
  );
  
  const handleCall = (phone) => Linking.openURL(`tel:${phone}`);
  const handleEmail = (email) => Linking.openURL(`mailto:${email}`);

  const filteredCases = cases.filter(c => {
    if (activeTab === 'Active') {
      return c.status === 'Open' || c.status === 'In Progress';
    }
    return c.status === activeTab;
  });
  
  const renderCase = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm elevation-2 border border-slate-100"
      onPress={() => navigation.navigate('CaseDetails', { caseData: item })}
    >
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-[13px] font-bold text-blue-600">{item.caseId}</Text>
          <Text className="text-[15px] font-bold text-slate-900 mt-1">{item.title}</Text>
          <Text className="text-xs text-slate-500 mt-0.5">{item.type}</Text>
          
          <View className="flex-row items-center mt-2">
            <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <Text className={`text-xs font-medium ${item.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>{item.status}</Text>
          </View>
        </View>
        
        {item.nextHearing && (
          <View className="items-center bg-blue-50 p-2 rounded-xl border border-blue-200 min-w-[70px]">
            <Calendar size={14} color="#64748b" />
            <Text className="text-xs font-bold text-blue-900 mt-1">
              {new Date(item.nextHearing).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </Text>
            <Text className="text-[10px] text-slate-500 mt-0.5">Hearing</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderClient = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm elevation-2 border border-slate-100"
      onPress={() => navigation.navigate('ClientDetails', { clientData: item })}
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-start">
        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
          <Text className="text-base font-bold text-blue-600">{item.name ? item.name.charAt(0).toUpperCase() : 'C'}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-slate-900 mt-1">{item.name}</Text>
          <Text className="text-xs text-slate-500 mt-0.5">{item.clientId}</Text>
        </View>
        <View className={`px-2 py-1 rounded-xl ${item.status === 'Active' ? 'bg-emerald-50' : 'bg-slate-100'}`}>
          <Text className={`text-[10px] font-bold ${item.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'}`}>
            {item.status}
          </Text>
        </View>
      </View>
      <View className="flex-row border-t border-slate-100 pt-3 mt-3">
        <TouchableOpacity className="flex-row items-center flex-1 justify-center" onPress={() => handleCall(item.mobile)}>
          <Phone size={16} color="#64748b" />
          <Text className="text-[13px] text-slate-500 ml-2 font-medium">{item.mobile}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center flex-1 justify-center" onPress={() => handleEmail(item.email)}>
          <Mail size={16} color="#64748b" />
          <Text className="text-[13px] text-slate-500 ml-2 font-medium">Email</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="mt-5 mb-4">
          <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">Casebook</Text>
          <Text className="text-sm text-slate-500 mt-1">Manage your active litigations and clients.</Text>
        </View>

        {/* Search & Actions */}
        <View className="flex-row gap-3 mb-5">
          <View className="flex-1 flex-row items-center bg-white rounded-xl px-3 border border-slate-200">
            <Search size={18} color="#94a3b8" />
            <TextInput 
              className="flex-1 ml-2 h-11 text-slate-900"
              placeholder="Search cases..."
              placeholderTextColor="#94a3b8"
            />
          </View>
          <TouchableOpacity className="w-11 h-11 bg-white rounded-xl items-center justify-center border border-slate-200">
            <Filter size={20} color="#17211F" />
          </TouchableOpacity>
          <TouchableOpacity className="w-11 h-11 bg-blue-600 rounded-xl items-center justify-center" onPress={() => navigation.navigate('FileNewCase')}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Top-Level Toggle */}
        <View className="flex-row bg-slate-200 rounded-xl p-1 mb-4">
          <TouchableOpacity 
            className={`flex-1 py-2 items-center rounded-lg ${viewMode === 'Cases' ? 'bg-white' : ''}`} 
            onPress={() => setViewMode('Cases')}
          >
            <Text className={`text-sm font-semibold ${viewMode === 'Cases' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>Cases</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 items-center rounded-lg ${viewMode === 'Clients' ? 'bg-white' : ''}`} 
            onPress={() => setViewMode('Clients')}
          >
            <Text className={`text-sm font-semibold ${viewMode === 'Clients' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>Clients</Text>
          </TouchableOpacity>
        </View>

        {/* Sub-Tabs (Only for Cases) */}
        {viewMode === 'Cases' && (
          <View className="flex-row border-b border-slate-200 mb-4">
            {['Active', 'Pending', 'Closed'].map(tab => {
              const count = cases.filter(c => {
                if (tab === 'Active') return c.status === 'Open' || c.status === 'In Progress';
                return c.status === tab;
              }).length;
              return (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className={`py-3 mr-6 ${activeTab === tab ? 'border-b-2 border-blue-600' : ''}`}>
                  <Text className={`text-sm font-medium ${activeTab === tab ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                    {tab} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* List */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : viewMode === 'Cases' ? (
          <FlatList
            data={filteredCases}
            keyExtractor={item => item._id}
            renderItem={renderCase}
            contentContainerClassName="pb-10"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center py-10">
                <Text className="text-slate-400 text-base">No cases found.</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={clients}
            keyExtractor={item => item._id}
            renderItem={renderClient}
            contentContainerClassName="pb-10"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center py-10">
                <Text className="text-slate-400 text-base">No clients found.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
