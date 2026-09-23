import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { ChevronLeft, Calendar, Briefcase, ChevronRight, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { width } = Dimensions.get('window');

export default function WorkspaceScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [myCases, setMyCases] = useState([]);
  const [myHearings, setMyHearings] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchWorkspaceData();
    }, [])
  );

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      const [casesRes, profileRes] = await Promise.all([
        axios.get(`${API_URL}/cases`),
        axios.get(`${API_URL}/auth/me`)
      ]);

      const currentUser = profileRes.data;
      const allCases = casesRes.data || [];
      
      setUser(currentUser);

      // Filter cases where the admin is assigned
      const assignedCases = allCases.filter(c => {
        if (!c.assignedTo) return false;
        // assignedTo can be array of objects or strings depending on backend population
        return c.assignedTo.some(u => {
          if (typeof u === 'object' && u !== null) return u._id === currentUser._id;
          return u === currentUser._id;
        });
      });

      setMyCases(assignedCases);

      // Extract hearings from assigned cases
      const upcomingHearings = assignedCases
        .filter(c => c.nextHearingDate && new Date(c.nextHearingDate) >= new Date(new Date().setHours(0,0,0,0)))
        .sort((a, b) => new Date(a.nextHearingDate) - new Date(b.nextHearingDate));
        
      setMyHearings(upcomingHearings);
    } catch (error) {
      console.error('Error fetching workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHearingCard = ({ item }) => {
    const date = new Date(item.nextHearingDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    
    return (
      <TouchableOpacity 
        className="bg-blue-600 rounded-2xl p-4 mr-4 shadow-sm elevation-2"
        style={{ width: width * 0.7 }}
        onPress={() => navigation.navigate('CaseDetails', { caseData: item })}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="bg-white/20 rounded-xl py-1.5 px-3 items-center justify-center">
            <Text className="text-white text-lg font-bold">{day}</Text>
            <Text className="text-white/80 text-[10px] font-bold uppercase">{month}</Text>
          </View>
          <View className="bg-white/20 px-2 py-1 rounded-md">
            <Text className="text-white text-[10px] font-bold uppercase">{item.caseNumber}</Text>
          </View>
        </View>
        
        <Text className="text-white font-bold text-[15px] mb-1" numberOfLines={1}>{item.title}</Text>
        <View className="flex-row items-center">
          <Clock size={12} color="rgba(255,255,255,0.7)" />
          <Text className="text-white/80 text-[11px] ml-1">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          <Text className="text-white/50 mx-1">•</Text>
          <Text className="text-white/80 text-[11px]" numberOfLines={1}>{item.court || 'TBD'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCaseItem = ({ item }) => {
    const statusColor = item.status === 'Open' || item.status === 'In Progress' ? 'bg-emerald-500' : 'bg-amber-500';
    const statusText = item.status === 'Open' || item.status === 'In Progress' ? 'text-emerald-500' : 'text-amber-500';

    return (
      <TouchableOpacity 
        className="bg-white rounded-2xl p-4 mb-3 shadow-sm elevation-2 border border-slate-100 flex-row items-center justify-between"
        onPress={() => navigation.navigate('CaseDetails', { caseData: item })}
      >
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mr-3">
            <Briefcase size={20} color="#2563eb" />
          </View>
          <View className="flex-1 pr-3">
            <Text className="text-xs text-blue-600 font-bold mb-0.5">{item.caseNumber}</Text>
            <Text className="text-slate-900 font-bold text-[15px]" numberOfLines={1}>{item.title}</Text>
            <View className="flex-row items-center mt-1">
              <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusColor}`} />
              <Text className={`text-[10px] font-bold ${statusText}`}>{item.status}</Text>
              <Text className="text-slate-400 mx-1.5">•</Text>
              <Text className="text-slate-500 text-[11px]">{item.type}</Text>
            </View>
          </View>
        </View>
        <ChevronRight size={18} color="#cbd5e1" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#FAF7F2] justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2.5 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 -ml-1">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#001f3f] font-serif">Workspace</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={myCases}
        keyExtractor={(item) => item._id}
        renderItem={renderCaseItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="mb-6">
            <View className="mb-6">
              <Text className="text-2xl font-bold text-[#001f3f] font-serif">My Workspace</Text>
              <Text className="text-sm text-slate-500 mt-1">
                Cases and hearings assigned to you.
              </Text>
            </View>

            {/* Upcoming Hearings */}
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-[17px] font-bold text-slate-900">Upcoming Hearings</Text>
                <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                  <Text className="text-blue-700 text-[10px] font-bold">{myHearings.length}</Text>
                </View>
              </View>
              
              {myHearings.length > 0 ? (
                <FlatList
                  horizontal
                  data={myHearings}
                  keyExtractor={(item) => item._id}
                  renderItem={renderHearingCard}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={width * 0.7 + 16} // card width + margin
                  decelerationRate="fast"
                />
              ) : (
                <View className="bg-white rounded-2xl p-6 items-center border border-slate-100 shadow-sm elevation-1">
                  <Calendar size={32} color="#94a3b8" />
                  <Text className="text-slate-600 font-semibold mt-3">No upcoming hearings</Text>
                  <Text className="text-slate-400 text-xs mt-1 text-center">
                    You have no hearings scheduled in the near future.
                  </Text>
                </View>
              )}
            </View>

            {/* My Cases Header */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[17px] font-bold text-slate-900">Assigned Cases</Text>
              <View className="bg-slate-200 px-2 py-0.5 rounded-full">
                <Text className="text-slate-700 text-[10px] font-bold">{myCases.length}</Text>
              </View>
            </View>
            
            {myCases.length === 0 && (
              <View className="bg-white rounded-2xl p-6 items-center border border-slate-100 shadow-sm elevation-1 mt-2">
                <Briefcase size={32} color="#94a3b8" />
                <Text className="text-slate-600 font-semibold mt-3">No cases assigned</Text>
                <Text className="text-slate-400 text-xs mt-1 text-center">
                  You do not have any active cases assigned to you.
                </Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
