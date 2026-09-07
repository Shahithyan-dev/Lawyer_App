import "./global.css";
// Polyfill for DOMRect to prevent crashes from web-only libraries in React Native
if (typeof global.DOMRect === 'undefined') {
  global.DOMRect = class DOMRect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x; this.y = y; this.width = width; this.height = height;
      this.top = y; this.bottom = y + height;
      this.left = x; this.right = x + width;
    }
    static fromRect(other) { return new DOMRect(other.x, other.y, other.width, other.height); }
    toJSON() { return { x: this.x, y: this.y, width: this.width, height: this.height, top: this.top, bottom: this.bottom, left: this.left, right: this.right }; }
  };
}

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/auth/LoginScreen';
import MainLayout from './src/navigation/MainLayout';
import StaffLayout from './src/staff/(tabs)/_layout';
import ClientsScreen from './src/senior/screen/ClientsScreen';
import MyProfileScreen from './src/senior/screen/MyProfileScreen';
import ChangePasswordScreen from './src/senior/screen/ChangePasswordScreen';
import NotificationSettingsScreen from './src/senior/screen/NotificationSettingsScreen';
import AppSettingsScreen from './src/senior/screen/AppSettingsScreen';
import HelpSupportScreen from './src/senior/screen/HelpSupportScreen';
import FileNewCaseScreen from './src/senior/screen/FileNewCaseScreen';
import ProfileDashboardScreen from './src/senior/more/ProfileDashboardScreen';
import WorkspaceScreen from './src/senior/more/WorkspaceScreen';
import AddNewStaffScreen from './src/senior/screen/AddNewStaffScreen';
import AddNewTaskScreen from './src/senior/screen/AddNewTaskScreen';
import CaseDetailsScreen from './src/senior/screen/CaseDetailsScreen';
import ClientDetailsScreen from './src/senior/screen/ClientDetailsScreen';

const Stack = createNativeStackNavigator();

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const initialRoute = 'Dashboard'; // BYPASS LOGIN - go straight to Dashboard

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('accessToken');
  //       if (token) {
  //         setInitialRoute('Dashboard');
  //       }
  //     } catch (error) {
  //       console.error('Error checking auth token', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={MainLayout} />
          <Stack.Screen name="StaffDashboard" component={StaffLayout} />
          <Stack.Screen name="Clients" component={ClientsScreen} />
          <Stack.Screen name="MyProfile" component={MyProfileScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="FileNewCase" component={FileNewCaseScreen} />
          <Stack.Screen name="ProfileDashboard" component={ProfileDashboardScreen} />
          <Stack.Screen name="Workspace" component={WorkspaceScreen} />
          <Stack.Screen name="AddNewStaff" component={AddNewStaffScreen} />
          <Stack.Screen name="AddNewTask" component={AddNewTaskScreen} />
          <Stack.Screen name="CaseDetails" component={CaseDetailsScreen} />
          <Stack.Screen name="ClientDetails" component={ClientDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
