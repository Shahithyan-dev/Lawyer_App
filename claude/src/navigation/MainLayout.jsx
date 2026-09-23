import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Dimensions, Image, Animated, Easing, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  LayoutDashboard, 
  Briefcase, 
  CalendarDays, 
  Settings, 
  Menu,
  Layout,
  Users,
  Gavel,
  Scale,
  CheckSquare,
  StickyNote,
  Users2,
  PieChart,
  Bell,
  X,
  Edit2,
  ChevronLeft
} from 'lucide-react-native';

import DashboardScreen from '../senior/(tabs)/DashboardScreen';
import CasesScreen from '../senior/(tabs)/CasesScreen';
import CalendarScreen from '../senior/(tabs)/CalendarScreen';
import SettingsScreen from '../senior/more/SettingsScreen';
import HearingsScreen from '../senior/more/HearingsScreen';
import CourtsScreen from '../senior/more/CourtsScreen';
import TasksScreen from '../senior/screen/TasksScreen';
import NotesScreen from '../senior/more/NotesScreen';
import StaffScreen from '../senior/more/StaffScreen';
import ReportsScreen from '../senior/more/ReportsScreen';
import NotificationsScreen from '../senior/more/NotificationsScreen';

const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get('window');

const CustomHeader = ({ title, isProfile = false, showBack = false, onBackPress, onNotifPress, onProfilePress, onEditPress, profileImage, onImageError }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  return (
    <View className="bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} className="p-2 -ml-2">
            <ChevronLeft size={28} color="#0f172a" strokeWidth={2.5} />
          </TouchableOpacity>
        ) : (
          <View className="w-10 h-10 rounded-full bg-[#0f172a] overflow-hidden items-center justify-center border-2 border-[#b48d3d]">
            <Image 
              source={require('../../assets/logo.png')} 
              className="w-10 h-10 rounded-full" 
              resizeMode="cover"
            />
          </View>
        )}
        
        <Text className="text-lg font-bold text-slate-900 flex-1 text-center tracking-wide">{title}</Text>
        
        <View className="flex-row items-center">
          {isProfile ? (
            <TouchableOpacity onPress={onEditPress} className="p-2">
              <Edit2 size={22} color="#64748b" strokeWidth={1.5} />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={onNotifPress} className="p-2">
                <Bell size={22} color="#64748b" strokeWidth={1.5} />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={onProfilePress} className="ml-2">
                <Image 
                  source={{ uri: profileImage || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                  className="w-9 h-9 rounded-full border-2 border-blue-200" 
                  onError={onImageError}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View className="h-[1px] bg-slate-100" />
    </View>
  );
};

export default function MainLayout({ navigation }) {
  const [activeMenuRoute, setActiveMenuRoute] = useState('Home');
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      const loadProfileImage = async () => {
        try {
          const savedImage = await AsyncStorage.getItem('profileImage');
          if (savedImage !== null) {
            setProfileImage(savedImage);
          }
        } catch (error) {
          console.error('Failed to load profile image', error);
        }
      };
      loadProfileImage();
    }, [])
  );

  const menuItems = [
    { title: 'MAIN', items: [
      { name: 'Dashboard', icon: LayoutDashboard, route: 'Home' },
      { name: 'My Workspace', icon: Layout, route: 'Workspace' },
    ]},
    { title: 'CASEWORK', items: [
      { name: 'Hearings', icon: Gavel, route: 'Hearings' },
      { name: 'Courts', icon: Scale, route: 'Courts' },
    ]},
    { title: 'WORKSPACE', items: [
      { name: 'Assign Cases', icon: CheckSquare, route: 'Tasks' },
      { name: 'Notes', icon: StickyNote, route: 'Notes' },
    ]},
    { title: 'MANAGEMENT', items: [
      { name: 'Staff', icon: Users2, route: 'Staff' },
      { name: 'Reports', icon: PieChart, route: 'Reports' },
    ]},
    { title: 'SYSTEM', items: [
      { name: 'Notifications', icon: Bell, route: 'Notifications' },
    ]},
  ];

  const handleMenuPress = (route) => {
    setActiveMenuRoute(route);
    if (route) {
      // If navigating to a tab screen, we need to pass it as a parameter to the Dashboard stack
      const tabRoutes = ['Home', 'Cases', 'Calendar', 'Settings', 'Hearings', 'Courts', 'Tasks', 'Notes', 'Staff', 'Reports', 'Notifications'];
      if (tabRoutes.includes(route)) {
        navigation.navigate('Dashboard', { screen: route });
      } else {
        navigation.navigate(route);
      }
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route, navigation: tabNavigation }) => ({
          header: () => {
            let title = 'Dashboard';
            if (route.name === 'Cases') title = 'My Cases';
            if (route.name === 'Calendar') title = 'Calendar';
            if (route.name === 'Settings') title = 'Profile';
            if (route.name === 'Hearings') title = 'Hearings';
            if (route.name === 'Courts') title = 'Courts';
            if (route.name === 'Tasks') title = 'Assign Cases';
            if (route.name === 'Notes') title = 'Notes';
            if (route.name === 'Staff') title = 'Staff Management';
            if (route.name === 'Reports') title = 'Reports & Analytics';
            if (route.name === 'Notifications') title = 'Notifications';
            if (route.name === 'Notifications') title = 'Notifications';
            if (route.name === 'More') title = 'Menu';
            
            return (
              <CustomHeader 
                title={title} 
                isProfile={route.name === 'Settings'}
                showBack={route.name !== 'Home'}
                onBackPress={() => tabNavigation.navigate('Home')}
                profileImage={profileImage}
                onImageError={() => setProfileImage(null)}
                onNotifPress={() => tabNavigation.navigate('Notifications')}
                onProfilePress={() => navigation.navigate('ProfileDashboard')}
                onEditPress={() => console.log('Edit Profile')}
              />
            );
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
          tabBarStyle: ['Hearings', 'Courts', 'Tasks', 'Notes', 'Staff', 'Reports', 'Notifications'].includes(route.name) 
            ? { display: 'none' } 
            : {
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
            if (route.name === 'Home') IconComponent = LayoutDashboard;
            else if (route.name === 'Cases') IconComponent = Briefcase;
            else if (route.name === 'Calendar') IconComponent = CalendarDays;
            else if (route.name === 'Settings') IconComponent = Settings;
            else if (route.name === 'More') IconComponent = Menu;
            else IconComponent = LayoutDashboard;

            return <IconComponent color={focused ? '#2563eb' : '#94a3b8'} size={24} strokeWidth={focused ? 2 : 1.5} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={DashboardScreen} listeners={{ focus: () => setActiveMenuRoute('Home') }} />
        <Tab.Screen name="Cases" component={CasesScreen} listeners={{ focus: () => setActiveMenuRoute('Cases') }} />
        <Tab.Screen name="Calendar" component={CalendarScreen} listeners={{ focus: () => setActiveMenuRoute('Calendar') }} />
        <Tab.Screen name="Settings" component={SettingsScreen} listeners={{ focus: () => setActiveMenuRoute('Settings') }} />
        <Tab.Screen name="Hearings" component={HearingsScreen} options={{ tabBarItemStyle: { display: 'none' } }} listeners={{ focus: () => setActiveMenuRoute('Hearings') }} />
        <Tab.Screen name="Courts" component={CourtsScreen} options={{ tabBarItemStyle: { display: 'none' } }} listeners={{ focus: () => setActiveMenuRoute('Courts') }} />
        <Tab.Screen name="Tasks" component={TasksScreen} options={{ tabBarItemStyle: { display: 'none' } }} listeners={{ focus: () => setActiveMenuRoute('Tasks') }} />
        <Tab.Screen name="Notes" component={NotesScreen} options={{ tabBarItemStyle: { display: 'none' } }} listeners={{ focus: () => setActiveMenuRoute('Notes') }} />
        <Tab.Screen name="Staff" component={StaffScreen} options={{ tabBarItemStyle: { display: 'none' } }} listeners={{ focus: () => setActiveMenuRoute('Staff') }} />
        <Tab.Screen name="Reports" component={ReportsScreen} options={{ tabBarItemStyle: { display: 'none' } }} listeners={{ focus: () => setActiveMenuRoute('Reports') }} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarItemStyle: { display: 'none' } }} listeners={{ focus: () => setActiveMenuRoute('Notifications') }} />
        <Tab.Screen name="More">
          {props => (
            <View className="flex-1 bg-slate-50 pt-5">
              <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5">
                {menuItems.map((section, idx) => (
                  <View key={idx} className="mb-6">
                    <Text className="text-[11px] font-bold text-slate-400 mb-2 tracking-widest px-3 uppercase">{section.title}</Text>
                    {section.items.map((item, itemIdx) => {
                      const isActive = activeMenuRoute === item.route;
                      return (
                         <TouchableOpacity 
                          key={itemIdx} 
                          className={`flex-row items-center py-[13px] px-4 rounded-xl mb-1 ${isActive ? 'bg-blue-50' : ''}`}
                          onPress={() => handleMenuPress(item.route)}
                        >
                          <item.icon size={20} color={isActive ? "#2563eb" : "#64748b"} strokeWidth={1.5} />
                          <Text className={`ml-4 text-[15px] ${isActive ? 'text-blue-600 font-bold' : 'text-slate-600 font-medium'}`}>{item.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
                <View className="h-10" />
              </ScrollView>
            </View>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
}


