import React from 'react';
import { View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, Briefcase, Gavel, Layout, User } from 'lucide-react-native';

// Import screens
import StaffDashboard from '../screens/StaffDashboard';
import StaffCases from '../screens/StaffCases';
import StaffHearings from '../screens/StaffHearings';
import StaffWorkspace from '../screens/StaffWorkspace';
import StaffProfile from './profile';

const Tab = createBottomTabNavigator();

const StaffHeader = ({ title, navigation }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View className="bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="p-1">
          <Image 
            source={require('../../../assets/logo.png')} 
            className="w-8 h-8" 
            resizeMode="contain"
          />
        </View>
        <Text className="text-lg font-bold text-slate-900 flex-1 text-center tracking-wide">{title}</Text>
        <TouchableOpacity className="p-2 bg-slate-100 rounded-full" onPress={() => navigation.navigate('Profile')}>
          <User size={22} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function StaffLayout({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation: tabNavigation }) => ({
        header: () => {
          let title = 'Staff Dashboard';
          if (route.name === 'Cases') title = 'Assigned Cases';
          if (route.name === 'Hearings') title = 'Hearings';
          if (route.name === 'Workspace') title = 'My Workspace';
          if (route.name === 'Profile') title = 'Staff Profile';
          
          return <StaffHeader title={title} navigation={tabNavigation} />;
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 6,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent;
          if (route.name === 'Dashboard') IconComponent = LayoutDashboard;
          else if (route.name === 'Cases') IconComponent = Briefcase;
          else if (route.name === 'Hearings') IconComponent = Gavel;
          else if (route.name === 'Workspace') IconComponent = Layout;
          else if (route.name === 'Profile') IconComponent = User;
          else IconComponent = LayoutDashboard;

          return <IconComponent color={focused ? '#2563eb' : '#94a3b8'} size={24} strokeWidth={focused ? 2 : 1.5} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={StaffDashboard} />
      <Tab.Screen name="Cases" component={StaffCases} />
      <Tab.Screen name="Hearings" component={StaffHearings} />
      <Tab.Screen name="Workspace" component={StaffWorkspace} />
      <Tab.Screen name="Profile" component={StaffProfile} options={{ tabBarItemStyle: { display: 'none' } }} />
    </Tab.Navigator>
  );
}
