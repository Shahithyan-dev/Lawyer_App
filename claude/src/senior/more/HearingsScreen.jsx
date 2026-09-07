import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function HearingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHearings();
  }, []);

  const fetchHearings = async () => {
    try {
      const response = await axios.get(`${API_URL}/cases`);
      // Filter cases that have a nextHearing date and sort by nearest date
      const upcomingHearings = response.data
        .filter((c) => c.nextHearing)
        .sort((a, b) => new Date(a.nextHearing).getTime() - new Date(b.nextHearing).getTime());
      setCases(upcomingHearings);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-slate-500">Loading hearings...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="p-5">
        <View className="mb-6">
          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Hearings</Text>
          <Text className="text-sm text-slate-500">Track your upcoming court dates.</Text>
        </View>

        {error && (
          <View className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
            <Text className="text-red-500">Error: {error}</Text>
          </View>
        )}

        {cases.length === 0 && !error ? (
          <View className="p-8 items-center border border-slate-200 rounded-2xl border-dashed">
            <Text className="text-slate-500">No upcoming hearings scheduled.</Text>
          </View>
        ) : (
          cases.map((c) => {
            const hearingDate = new Date(c.nextHearing);
            return (
              <View key={c._id} className="bg-white rounded-2xl p-4 mb-4 flex-row items-center shadow-sm shadow-black/5 elevation-2 border border-slate-100">
                <View className="bg-blue-50 p-3 rounded-xl items-center justify-center mr-4 min-w-[70px]">
                  <Text className="text-2xl font-bold text-blue-900">{hearingDate.getDate()}</Text>
                  <Text className="text-xs font-bold text-blue-600 uppercase">{hearingDate.toLocaleString('default', { month: 'short' })}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-base font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>{c.caseId} - {c.title}</Text>
                    <View className="bg-blue-50 px-2 py-1 rounded-full">
                      <Text className="text-[10px] font-bold text-blue-600 uppercase">{c.type}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <MapPin size={14} color="#64748b" />
                    <Text className="text-[13px] text-slate-500 ml-1.5 flex-1" numberOfLines={1}>{c.court}</Text>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Calendar size={14} color="#64748b" />
                    <Text className="text-[13px] text-slate-500 ml-1.5">{hearingDate.toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
