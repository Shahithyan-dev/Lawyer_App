import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Modal, Pressable, Alert, StyleSheet } from 'react-native';
import { User, Mail, Phone, MapPin, ChevronRight, LogOut, Shield, Camera, Image as ImageIcon, Camera as CameraIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StaffProfile({ navigation }) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);

  const profileInfo = {
    name: 'Alex Junior',
    role: 'Junior Associate',
    seniorAdvocate: 'Harvey Specter',
    email: 'alex.junior@lexora.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    casesHandled: 42,
    hoursLogged: 315,
  };

  useEffect(() => {
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
  }, []);

  const pickImage = async (useCamera = false) => {
    let result;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    try {
      if (useCamera) {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Denied', 'You need to grant camera permissions to take a photo.');
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setProfileImage(selectedUri);
        await AsyncStorage.setItem('staffProfileImage', selectedUri);
      }
      setActionSheetVisible(false);
    } catch (error) {
      setActionSheetVisible(false);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const handleCameraPress = () => {
    setActionSheetVisible(true);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      spinAnim.setValue(0);
    });
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View className="flex-1 bg-slate-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white p-6 rounded-b-[32px] shadow-sm shadow-black/5 elevation-2">
          <View className="flex-row items-center">
            <View className="relative">
              <Image 
                source={{ uri: profileImage }} 
                className="w-20 h-20 rounded-full border-[3px] border-slate-100" 
              />
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={handleCameraPress}
                className="absolute bottom-0 right-0"
              >
                <Animated.View className="bg-blue-500 w-7 h-7 rounded-full items-center justify-center border-2 border-white" style={{ transform: [{ rotate: spin }] }}>
                  <Camera size={14} color="#fff" strokeWidth={2.5} />
                </Animated.View>
              </TouchableOpacity>
            </View>
            <View className="ml-4">
              <Text className="text-2xl font-bold text-slate-900">{profileInfo.name}</Text>
              <View className="bg-blue-50 px-3 py-1 rounded-xl mt-1.5 self-start">
                <Text className="text-blue-500 font-bold text-xs">{profileInfo.role}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row mt-6 bg-slate-50 rounded-2xl p-4">
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-slate-900">{profileInfo.casesHandled}</Text>
              <Text className="text-xs text-slate-500 mt-1">Cases Handled</Text>
            </View>
            <View className="w-px bg-slate-200" />
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-slate-900">{profileInfo.hoursLogged}h</Text>
              <Text className="text-xs text-slate-500 mt-1">Hours Logged</Text>
            </View>
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-base font-bold text-slate-900 mb-3">Reporting Structure</Text>
          <View className="bg-white rounded-2xl p-4 flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
              <Shield size={20} color="#3B82F6" />
            </View>
            <View className="ml-4">
              <Text className="text-xs text-slate-500">Assigned Senior Advocate</Text>
              <Text className="text-base font-bold text-slate-900 mt-0.5">{profileInfo.seniorAdvocate}</Text>
            </View>
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-base font-bold text-slate-900 mb-3">Contact Information</Text>
          <View className="bg-white rounded-2xl p-4">
            <View className="flex-row items-center py-2">
              <Mail size={18} color="#64748b" />
              <Text className="text-sm text-slate-800 ml-3">{profileInfo.email}</Text>
            </View>
            <View className="h-px bg-slate-100 my-1" />
            <View className="flex-row items-center py-2">
              <Phone size={18} color="#64748b" />
              <Text className="text-sm text-slate-800 ml-3">{profileInfo.phone}</Text>
            </View>
            <View className="h-px bg-slate-100 my-1" />
            <View className="flex-row items-center py-2">
              <MapPin size={18} color="#64748b" />
              <Text className="text-sm text-slate-800 ml-3">{profileInfo.location}</Text>
            </View>
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-base font-bold text-slate-900 mb-3">Settings</Text>
          <View className="bg-white rounded-2xl p-2">
            <TouchableOpacity className="flex-row items-center p-3">
              <User size={18} color="#0F172A" />
              <Text className="text-[15px] text-slate-900 flex-1 ml-3 font-medium">Edit Profile</Text>
              <ChevronRight size={18} color="#cbd5e1" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="flex-row items-center justify-center mt-8 bg-red-100 p-4 rounded-2xl mx-5" 
          onPress={() => {
            navigation.getParent()?.navigate('Login');
          }}
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="text-red-500 font-bold text-base ml-2">Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Custom Action Sheet Modal */}
      <Modal
        visible={isActionSheetVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActionSheetVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <Pressable className="absolute inset-0 bg-black/40" onPress={() => setActionSheetVisible(false)} />
          <View className="bg-white rounded-[20px] w-[85%] px-6 pt-6 pb-6 shadow-sm shadow-black/10 elevation-5">
            <View className="mb-5 items-center">
              <Text className="text-lg font-bold text-slate-900 mb-1">Update Profile Photo</Text>
              <Text className="text-sm text-slate-500">Choose a new photo for your profile</Text>
            </View>
            
            <TouchableOpacity className="flex-row items-center py-4 border-b border-slate-100" onPress={() => pickImage(true)}>
              <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-4 border border-slate-200">
                <CameraIcon size={20} color="#0F172A" />
              </View>
              <Text className="text-base font-semibold text-slate-900">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4 border-b border-slate-100" onPress={() => pickImage(false)}>
              <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-4 border border-slate-200">
                <ImageIcon size={20} color="#0F172A" />
              </View>
              <Text className="text-base font-semibold text-slate-900">Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="mt-4 bg-slate-100 py-4 rounded-xl items-center" 
              onPress={() => setActionSheetVisible(false)}
            >
              <Text className="text-base font-bold text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
