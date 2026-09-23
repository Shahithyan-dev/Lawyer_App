import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';
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
  ArrowRight,
  CheckCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Activity');
  const [loading, setLoading] = useState(true);
  
  // Dashboard State
  const [userProfile, setUserProfile] = useState(null);
  const [metrics, setMetrics] = useState({
    activeCases: 0,
    totalClients: 0,
    totalCases: 0,
    pendingTasks: 0,
    hearingsThisWeek: 0,
    completedCases: 0
  });
  const [todaysCases, setTodaysCases] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const fetchDashboardData = async () => {
    try {
      const [casesRes, tasksRes, profileRes] = await Promise.all([
        axios.get(`${API_URL}/cases`),
        axios.get(`${API_URL}/tasks`),
        axios.get(`${API_URL}/auth/me`)
      ]);

      const casesData = casesRes.data || [];
      const tasksData = tasksRes.data || [];
      
      if (profileRes.data) {
        setUserProfile(profileRes.data);
      }

      // Calculate Metrics
      const activeCases = casesData.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
      
      // Get unique clients count from cases (since we don't have a dedicated clients route)
      const uniqueClients = new Set(casesData.filter(c => c.clientName).map(c => c.clientName)).size;
      
      const completedCases = casesData.filter(c => c.status === 'Closed').length;
      const pendingTasks = tasksData.filter(t => t.status !== 'Completed').length;
      
      setMetrics({
        activeCases,
        totalClients: uniqueClients > 0 ? uniqueClients : casesData.length, // Fallback if no client names
        totalCases: casesData.length,
        pendingTasks,
        hearingsThisWeek: casesData.filter(c => c.nextHearingDate).length, // simplified for MVP
        completedCases
      });

      // Calculate Today's Schedule (mock filtering for MVP based on any cases with upcoming dates)
      // For real app, we'd check if date is today. Here we just take up to 3 upcoming ones.
      const upcoming = casesData
        .filter(c => c.status !== 'Closed')
        .slice(0, 3)
        .map((c, index) => {
          const hours = [10, 12, 14][index % 3];
          const mins = ['30', '00', '30'][index % 3];
          return {
            id: c._id || String(index),
            time: `${hours}:${mins} ${hours >= 12 ? 'PM' : 'AM'}`,
            title: c.title,
            type: c.caseNumber || `CAS-${1000 + index}`,
            court: c.court || 'District Court',
            in: `${index + 2}h`,
            raw: c
          };
        });
        
      setTodaysCases(upcoming);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Minimalist & Attractive Metric Card (Small)
  const MetricCard = ({ title, value, subtitle, icon: Icon, color, bg, onPress }) => (
    <TouchableOpacity 
      className="bg-white rounded-[16px] p-3 mb-2.5 shadow-sm elevation-1"
      style={{ borderCurve: 'continuous', borderColor: '#f1f5f9', borderWidth: 1 }}
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon size={14} color={color} strokeWidth={2.5} />
        </View>
        <View className="bg-emerald-50 px-1.5 py-0.5 rounded flex-row items-center">
          <TrendingUp size={8} color="#10b981" />
          <Text className="text-[9px] text-emerald-600 font-bold ml-1">{subtitle.split(' ')[0]}</Text>
        </View>
      </View>
      <View>
        <Text className="text-[22px] font-black text-slate-800 tracking-tight leading-6">{value}</Text>
        <Text className="text-[11px] text-slate-500 font-medium mt-0.5">{title}</Text>
      </View>
    </TouchableOpacity>
  );

  const carouselRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (!todaysCases || todaysCases.length <= 1) return prevIndex;
        const nextIndex = (prevIndex + 1) % todaysCases.length;
        carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000); // Auto slide every 3 seconds
    return () => clearInterval(timer);
  }, [todaysCases]);

  const renderCarouselItem = ({ item }) => (
    <View className="bg-blue-900 rounded-[20px] p-5 shadow-lg shadow-blue-900/30 elevation-5" style={{ width: width - 48, marginRight: 16 }}>
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center bg-emerald-400/15 px-3 py-1.5 rounded-full border border-emerald-400/30">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
          <Text className="text-emerald-400 text-xs font-semibold">Hearing in {item.in}</Text>
        </View>
        <Text className="text-blue-300 text-[12px] font-medium">{displayDate} • {item.time}</Text>
      </View>
      
      <Text className="text-[20px] font-bold text-white mb-1">{item.title}</Text>
      <Text className="text-xs text-blue-200 font-medium">{item.type}</Text>
      
      <View className="h-[1px] bg-white/10 my-3" />
      
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MapPin size={12} color="#93c5fd" style={{ marginRight: 6 }} />
          <Text className="text-blue-300 text-[12px]">{item.court}</Text>
        </View>
        <TouchableOpacity 
          className="flex-row items-center bg-white px-3 py-1.5 rounded-full"
          onPress={() => navigation.navigate('CaseDetails', { caseData: item.raw })}
        >
          <Text className="text-blue-900 text-[11px] font-bold mr-1">Details</Text>
          <ArrowRight size={12} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Custom Top Bar spacing using insets */}
      <View className="px-6 bg-slate-50 pb-4" style={{ paddingTop: Math.max(insets.top, 20) }}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-sm text-slate-500 font-medium mb-1">{greeting}</Text>
            <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {userProfile ? userProfile.name : 'Advocate'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        <View className="pt-2">
          
          {/* Auto-Sliding Carousel for Today's Hearings */}
          <View className="mb-6 pl-6">
            {todaysCases && todaysCases.length > 0 ? (
              <FlatList
                ref={carouselRef}
                data={todaysCases}
                renderItem={renderCarouselItem}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - 48 + 16}
                decelerationRate="fast"
                onScrollToIndexFailed={(info) => {
                  if (info.index === null || info.index === undefined || isNaN(info.index)) return;
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                    carouselRef.current?.scrollToIndex({ index: info.index, animated: true });
                  });
                }}
              />
            ) : (
              <View className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 items-center justify-center py-8" style={{ width: width - 48 }}>
                <Text className="text-slate-400 font-medium">No upcoming hearings for today</Text>
              </View>
            )}
          </View>

          {/* Quick Actions Row */}
          <View className="px-6">
            <View className="flex-row justify-between mb-8">
              <ActionPill icon={Plus} label="New Case" onPress={() => navigation.navigate('FileNewCase')} />
            </View>

            {/* Metrics Grid */}
            <Text className="text-[18px] font-bold text-slate-900 mb-4">Overview</Text>
            <View className="flex-row justify-between mb-6">
              <View className="flex-1 mx-1.5">
                <MetricCard 
                  title="Active Cases" 
                  value={metrics.activeCases.toString()} 
                  subtitle="Live cases" 
                  icon={Briefcase} 
                  color="#2563eb" 
                  bg="#eff6ff" 
                  onPress={() => navigation.navigate('Cases', { initialView: 'Cases', initialTab: 'Active' })}
                />
                <MetricCard 
                  title="Total Clients" 
                  value={metrics.totalClients.toString()} 
                  subtitle="In system" 
                  icon={Users} 
                  color="#0ea5e9" 
                  bg="#f0f9ff" 
                  onPress={() => navigation.navigate('Cases', { initialView: 'Clients' })}
                />
                <MetricCard 
                  title="Total Cases" 
                  value={metrics.totalCases.toString()} 
                  subtitle="All time" 
                  icon={FileText} 
                  color="#f59e0b" 
                  bg="#fef3c7" 
                  onPress={() => navigation.navigate('Cases', { initialView: 'Cases' })}
                />
              </View>
              <View className="flex-1 mx-1.5">
                <MetricCard 
                  title="Pending Tasks" 
                  value={metrics.pendingTasks.toString()} 
                  subtitle="To be done" 
                  icon={CheckSquare} 
                  color="#4f46e5" 
                  bg="#eef2ff" 
                  onPress={() => navigation.navigate('Tasks', { initialFilter: 'Pending' })}
                />
                <MetricCard 
                  title="Hearings" 
                  value={metrics.hearingsThisWeek.toString()} 
                  subtitle="Scheduled" 
                  icon={Scale} 
                  color="#8b5cf6" 
                  bg="#f5f3ff" 
                  onPress={() => navigation.navigate('Cases', { initialView: 'Cases' })}
                />
                <MetricCard 
                  title="Completed Cases" 
                  value={metrics.completedCases.toString()} 
                  subtitle="Closed" 
                  icon={CheckCircle} 
                  color="#10b981" 
                  bg="#d1fae5" 
                  onPress={() => navigation.navigate('Cases', { initialView: 'Cases', initialTab: 'Closed' })}
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
              
              {todaysCases.length === 0 ? (
                <View className="items-center py-6">
                  <Text className="text-slate-400 text-[14px]">No scheduled items for today.</Text>
                </View>
              ) : (
                todaysCases.map((item, index) => {
                  const isLast = index === todaysCases.length - 1;
                  const colors = ['#2563eb', '#64748b', '#64748b']; // First is blue, rest slate
                  const color = colors[index % colors.length];
                  const timeParts = item.time.split(' ');
                  
                  return (
                    <View className="flex-row" key={item.id}>
                      <View className="w-12 items-end pr-4 pt-1">
                        <Text className="text-[13px] font-bold text-slate-900">{timeParts[0]}</Text>
                        <Text className="text-[10px] text-slate-500 font-bold">{timeParts[1]}</Text>
                      </View>
                      <View className="w-5 items-center">
                        <View className={`w-3.5 h-3.5 rounded-full border-2 items-center justify-center bg-slate-50 mt-1 z-10`} style={{ borderColor: color }}>
                          <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        </View>
                        {!isLast && <View className="w-0.5 flex-1 bg-slate-200 -mt-1 -mb-1 z-0" />}
                      </View>
                      <View className="flex-1 pl-4 pb-6">
                        <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm elevation-2">
                          <View className="flex-row justify-between items-center mb-1.5">
                            <Text className="text-xs font-bold mb-1" style={{ color: color }}>{item.type}</Text>
                            {index === 0 && (
                              <View className="bg-blue-50 px-2 py-1 rounded-lg">
                                <Text className="text-blue-600 text-[10px] font-bold">Upcoming</Text>
                              </View>
                            )}
                          </View>
                          <Text className="text-[15px] font-bold text-slate-800 mb-1" numberOfLines={1}>{item.title}</Text>
                          <Text className="text-[13px] text-slate-500">{item.court}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
              
            </View>

            <View className="h-10" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
