import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native';
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
  ArrowRight,
  CheckCircle
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

  const todaysCases = [
    { id: '1', time: '10:30 AM', title: 'Raj Kumar vs State', type: 'CR-1023', court: 'District Court, No. 4', in: '2h' },
    { id: '2', time: '12:00 PM', title: 'Arun Enterprises vs Suresh', type: 'CIV-2041', court: 'High Court', in: '3.5h' },
    { id: '3', time: '02:30 PM', title: 'Priya Sharma vs Rohit', type: 'FM-1022', court: 'Family Court', in: '6h' }
  ];

  const carouselRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % todaysCases.length;
        carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000); // Auto slide every 3 seconds
    return () => clearInterval(timer);
  }, []);

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
        <TouchableOpacity className="flex-row items-center bg-white px-3 py-1.5 rounded-full">
          <Text className="text-blue-900 text-[11px] font-bold mr-1">Details</Text>
          <ArrowRight size={12} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
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
        <View className="pt-2">
          
          {/* Auto-Sliding Carousel for Today's Hearings */}
          <View className="mb-6 pl-6">
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
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  carouselRef.current?.scrollToIndex({ index: info.index, animated: true });
                });
              }}
            />
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
                <MetricCard 
                  title="Total Cases" 
                  value="324" 
                  subtitle="All time" 
                  icon={FileText} 
                  color="#f59e0b" 
                  bg="#fef3c7" 
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
                <MetricCard 
                  title="Completed Cases" 
                  value="278" 
                  subtitle="+15 this year" 
                  icon={CheckCircle} 
                  color="#10b981" 
                  bg="#d1fae5" 
                  onPress={() => navigation.navigate('Cases')}
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
        </View>
      </ScrollView>
    </View>
  );
}
