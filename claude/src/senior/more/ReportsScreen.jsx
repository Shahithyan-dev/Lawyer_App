import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Briefcase, CheckCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function ReportsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [metrics, setMetrics] = useState({
    activeCases: 0,
    totalCases: 0,
    completedTasks: 0,
    totalTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [casesRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/cases`),
        axios.get(`${API_URL}/tasks`)
      ]);

      const casesData = casesRes.data;
      const tasksData = tasksRes.data;

      const activeCases = casesData.filter(c => c.status === 'Open' || c.status === 'Pending').length;
      const completedTasks = tasksData.filter(t => t.status === 'Completed').length;

      setMetrics({
        activeCases,
        totalCases: casesData.length,
        completedTasks,
        totalTasks: tasksData.length
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const KPICard = ({ title, value, subValue, icon: Icon, color, bgColor }) => (
    <View className="bg-white rounded-2xl p-5 flex-row items-center shadow-sm shadow-black/5 elevation-2 mb-4 border border-slate-100">
      <View className={`p-4 rounded-xl mr-4 ${bgColor}`}>
        <Icon size={24} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-[13px] text-slate-500 font-medium mb-1">{title}</Text>
        <Text className="text-2xl font-bold text-slate-900">
          {value}
          {subValue && <Text className="text-sm text-slate-400 font-medium"> {subValue}</Text>}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-[#FAF7F2] justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-slate-500">Calculating metrics...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="p-5">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#17211F] mb-1 font-serif">Reports & Analytics</Text>
          <Text className="text-sm text-slate-500">Overview of firm performance.</Text>
        </View>

        {error && (
          <View className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
            <Text className="text-red-500">Error: {error}</Text>
          </View>
        )}

        {!error && (
          <View className="gap-4">
            <KPICard
              title="Active Cases"
              value={metrics.activeCases}
              subValue={`/ ${metrics.totalCases}`}
              icon={Briefcase}
              color="#383d41"
              bgColor="bg-slate-200"
            />
            <KPICard
              title="Cases Assigned & Completed"
              value={metrics.completedTasks}
              subValue={`/ ${metrics.totalTasks}`}
              icon={CheckCircle}
              color="#155724"
              bgColor="bg-green-100"
            />

            {/* Progress Section */}
            <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
              <Text className="text-base font-bold text-slate-900 mb-4">Case Resolution Rate</Text>
              <View className="flex-row items-center">
                <View className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden mr-3">
                  <View 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${metrics.totalCases > 0 ? ((metrics.totalCases - metrics.activeCases) / metrics.totalCases) * 100 : 0}%` }} 
                  />
                </View>
                <Text className="font-bold text-slate-900 w-10 text-right">
                  {metrics.totalCases > 0 ? Math.round(((metrics.totalCases - metrics.activeCases) / metrics.totalCases) * 100) : 0}%
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
              <Text className="text-base font-bold text-slate-900 mb-4">Assigned Case Completion Rate</Text>
              <View className="flex-row items-center">
                <View className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden mr-3">
                  <View 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${metrics.totalTasks > 0 ? (metrics.completedTasks / metrics.totalTasks) * 100 : 0}%` }} 
                  />
                </View>
                <Text className="font-bold text-slate-900 w-10 text-right">
                  {metrics.totalTasks > 0 ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) : 0}%
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
