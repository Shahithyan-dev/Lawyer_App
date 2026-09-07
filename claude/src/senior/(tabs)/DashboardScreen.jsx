import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  CheckSquare,
  FileText,
  Scale,
  MapPin,
  TrendingUp,
  Activity,
  User,
  Plus,
  ArrowRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Activity');

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  
  let greeting = 'Good Morning,';
  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good Afternoon,';
  } else if (currentHour >= 17) {
    greeting = 'Good Evening,';
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const displayDate = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}`;

  // Pill Action Button
  const ActionPill = ({ icon: Icon, label, onPress }) => (
    <TouchableOpacity 
      className="flex-1 flex-row items-center justify-center bg-white py-3.5 rounded-full mx-1.5 border border-slate-200 shadow-sm elevation-2"
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Icon size={16} color="#2563eb" strokeWidth={2.5} style={{ marginRight: 6 }} />
      <Text className="text-sm font-semibold text-slate-800">{label}</Text>
    </TouchableOpacity>
  );

  // Grid Metric Card
  const MetricCard = ({ title, value, subtitle, icon: Icon, color, bg, onPress }) => (
    <TouchableOpacity 
      className="bg-white rounded-[20px] p-4 mb-3 border border-slate-100 shadow-sm elevation-2"
      activeOpacity={0.8} 
      onPress={onPress}
    >
      <View className="mb-4">
        <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon size={20} color={color} strokeWidth={2} />
        </View>
      </View>
      <Text className="text-[26px] font-bold text-slate-900 mb-1">{value}</Text>
      <Text className="text-[13px] text-slate-500 font-medium mb-2.5">{title}</Text>
      <View className="flex-row items-center mt-auto">
        <TrendingUp size={12} color="#10b981" style={{ marginRight: 4 }} />
        <Text className="text-xs text-emerald-500 font-semibold">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50">
      {/* Custom Top Bar spacing using insets */}
      <View className="px-6 bg-slate-50 pb-4" style={{ paddingTop: Math.max(insets.top, 20) }}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-sm text-slate-500 font-medium mb-1">{greeting}</Text>
            <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">Advocate Kumar</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        <View className="px-6 pt-2">
          
          {/* Feature Card (Next Hearing) */}
          <View className="bg-blue-900 rounded-[24px] p-6 mb-6 shadow-lg shadow-blue-900/30 elevation-10">
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center bg-emerald-400/15 px-3 py-1.5 rounded-full border border-emerald-400/30">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                <Text className="text-emerald-400 text-xs font-semibold">Next Hearing in 2h</Text>
              </View>
              <Text className="text-blue-300 text-[13px] font-medium">{displayDate}</Text>
            </View>
            
            <Text className="text-[22px] font-bold text-white mb-1.5">Raj Kumar vs State</Text>
            <Text className="text-sm text-blue-200 font-medium">CR-1023</Text>
            
            <View className="h-[1px] bg-white/10 my-4" />
            
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <MapPin size={14} color="#93c5fd" style={{ marginRight: 6 }} />
                <Text className="text-blue-300 text-[13px]">District Court, No. 4</Text>
              </View>
              <TouchableOpacity className="flex-row items-center bg-white px-4 py-2 rounded-full">
                <Text className="text-blue-900 text-[13px] font-bold mr-1">Details</Text>
                <ArrowRight size={14} color="#2563eb" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions Row */}
          <View className="flex-row justify-between mb-8">
            <ActionPill icon={Plus} label="New Case" onPress={() => navigation.navigate('FileNewCase')} />
          </View>

          {/* Metrics Grid */}
          <Text className="text-[18px] font-bold text-slate-900 mb-4">Overview</Text>
          <View className="flex-row justify-between mb-6">
            <View className="flex-1 mx-1.5">
              <MetricCard 
                title="Active Cases" 
                value="46" 
                subtitle="+3 this week" 
                icon={Briefcase} 
                color="#2563eb" 
                bg="#eff6ff" 
                onPress={() => navigation.navigate('Cases')}
              />
              <MetricCard 
                title="Total Clients" 
                value="128" 
                subtitle="+12 this month" 
                icon={Users} 
                color="#0ea5e9" 
                bg="#f0f9ff" 
                onPress={() => navigation.navigate('Cases')}
              />
            </View>
            <View className="flex-1 mx-1.5">
              <MetricCard 
                title="Pending Tasks" 
                value="28" 
                subtitle="5 due today" 
                icon={CheckSquare} 
                color="#4f46e5" 
                bg="#eef2ff" 
                onPress={() => navigation.navigate('Tasks')}
              />
              <MetricCard 
                title="Hearings" 
                value="12" 
                subtitle="This week" 
                icon={Scale} 
                color="#8b5cf6" 
                bg="#f5f3ff" 
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Today's Schedule (Redesigned Timeline) */}
          <View className="flex-row justify-between items-center mb-4 mt-2">
            <Text className="text-[18px] font-bold text-slate-900">Today's Schedule</Text>
            <TouchableOpacity>
              <Text className="text-sm text-blue-600 font-semibold">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="pl-1">
            
            {/* Schedule Item 1 */}
            <View className="flex-row">
              <View className="w-12 items-end pr-4 pt-1">
                <Text className="text-[13px] font-bold text-slate-900">10:30</Text>
                <Text className="text-[10px] text-slate-500 font-bold">AM</Text>
              </View>
              <View className="w-5 items-center">
                <View className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 items-center justify-center bg-slate-50 mt-1 z-10">
                  <View className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </View>
                <View className="w-0.5 flex-1 bg-slate-200 -mt-1 -mb-1 z-0" />
              </View>
              <View className="flex-1 pl-4 pb-6">
                <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm elevation-2">
                  <View className="flex-row justify-between items-center mb-1.5">
                    <Text className="text-xs text-blue-600 font-bold mb-1">CR-1023</Text>
                    <View className="bg-blue-50 px-2 py-1 rounded-lg">
                      <Text className="text-blue-600 text-[10px] font-bold">Upcoming</Text>
                    </View>
                  </View>
                  <Text className="text-[15px] font-bold text-slate-800 mb-1">Raj Kumar vs State</Text>
                  <Text className="text-[13px] text-slate-500">District Court</Text>
                </View>
              </View>
            </View>

            {/* Schedule Item 2 */}
            <View className="flex-row">
              <View className="w-12 items-end pr-4 pt-1">
                <Text className="text-[13px] font-bold text-slate-900">12:00</Text>
                <Text className="text-[10px] text-slate-500 font-bold">PM</Text>
              </View>
              <View className="w-5 items-center">
                <View className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 items-center justify-center bg-slate-50 mt-1 z-10">
                  <View className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </View>
                <View className="w-0.5 flex-1 bg-slate-200 -mt-1 -mb-1 z-0" />
              </View>
              <View className="flex-1 pl-4 pb-6">
                <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm elevation-2">
                  <Text className="text-xs text-blue-600 font-bold mb-1">CIV-2041</Text>
                  <Text className="text-[15px] font-bold text-slate-800 mb-1">Arun Enterprises vs Suresh</Text>
                  <Text className="text-[13px] text-slate-500">High Court</Text>
                </View>
              </View>
            </View>

            {/* Schedule Item 3 */}
            <View className="flex-row">
              <View className="w-12 items-end pr-4 pt-1">
                <Text className="text-[13px] font-bold text-slate-900">02:30</Text>
                <Text className="text-[10px] text-slate-500 font-bold">PM</Text>
              </View>
              <View className="w-5 items-center">
                <View className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 items-center justify-center bg-slate-50 mt-1 z-10">
                  <View className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </View>
              </View>
              <View className="flex-1 pl-4 pb-6">
                <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm elevation-2">
                  <Text className="text-xs text-blue-600 font-bold mb-1">FM-1022</Text>
                  <Text className="text-[15px] font-bold text-slate-800 mb-1">Priya Sharma vs Rohit</Text>
                  <Text className="text-[13px] text-slate-500">Family Court</Text>
                </View>
              </View>
            </View>
            
          </View>

          <View className="h-10" />
        </View>
      </ScrollView>
    </View>
  );
}
