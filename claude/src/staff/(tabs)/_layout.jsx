import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, Briefcase, Gavel, User } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Import screens
import StaffDashboard from '../screens/StaffDashboard';
import StaffCases from '../screens/StaffCases';
import StaffHearings from '../screens/StaffHearings';
import StaffWorkspace from '../screens/StaffWorkspace';
import StaffProfile from './profile';
import StaffTasks from '../screens/StaffTasks';

const Tab = createBottomTabNavigator();

const StaffHeader = ({ title, profileImage, onImageError }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  return (
    <View className="bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="w-10 h-10 rounded-full bg-[#0f172a] overflow-hidden items-center justify-center border-2 border-[#b48d3d]">
          <Image 
            source={require('../../../assets/logo.png')} 
            className="w-10 h-10 rounded-full" 
            resizeMode="cover"
          />
        </View>
        <Text className="text-lg font-bold text-slate-900 flex-1 text-center tracking-wide">{title}</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full overflow-hidden items-center justify-center border-2 border-slate-200" onPress={() => navigation.navigate('Profile')}>
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              className="w-full h-full" 
              resizeMode="cover"
              onError={onImageError}
            />
          ) : (
            <View className="bg-slate-100 w-full h-full items-center justify-center">
              <User size={20} color="#64748b" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function StaffLayout({ navigation }) {
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadProfileImage = async () => {
        try {
          const savedImage = await AsyncStorage.getItem('staffProfileImage');
          if (savedImage !== null) {
            setProfileImage(savedImage);
          }
        } catch (error) {
          console.error('Failed to load profile image', error);
        }
      };
      loadProfileImage();

      const subscription = DeviceEventEmitter.addListener('staffProfileImageUpdated', () => {
        loadProfileImage();
      });

      return () => {
        subscription.remove();
      };
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation: tabNavigation }) => ({
        header: () => {
          let title = 'Staff Dashboard';
          if (route.name === 'Cases') title = 'Assigned Cases';
          if (route.name === 'Hearings') title = 'Hearings & Tasks';
          if (route.name === 'Workspace') title = 'My Clients';
          if (route.name === 'Profile') title = 'Staff Profile';
          
          return <StaffHeader title={title} navigation={tabNavigation} profileImage={profileImage} onImageError={() => setProfileImage(null)} />;
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
          else if (route.name === 'Workspace') IconComponent = User;
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
      <Tab.Screen name="Profile" component={StaffProfile} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="Tasks" component={StaffTasks} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}
