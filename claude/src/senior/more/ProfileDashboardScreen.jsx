import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView, Alert, Animated, Modal, Pressable } from 'react-native';
import { User, Lock, Bell, Settings, HelpCircle, LogOut, ChevronRight, Camera, ChevronLeft, Edit2, Image as ImageIcon, Camera as CameraIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileDashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);

  React.useEffect(() => {
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
  }, []);

  const pickImage = async (useCamera = false) => {
    let result;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for the circular avatar
      quality: 0.8,
    };

    try {
      if (useCamera) {
        // Ask for permission first
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
        await AsyncStorage.setItem('profileImage', selectedUri);
      }
      setActionSheetVisible(false);
    } catch (error) {
      setActionSheetVisible(false);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const handleCameraPress = () => {
    // Show modal immediately for instant feedback
    setActionSheetVisible(true);
    
    // Run the 180 degree spin animation concurrently
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      spinAnim.setValue(0); // reset for next time
    });
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  const MenuItem = ({ icon: Icon, title, onPress, isDanger }) => (
    <TouchableOpacity className={`flex-row items-center py-4 px-5 border-b border-slate-100`} onPress={onPress}>
      <Icon size={22} color={isDanger ? "#ef4444" : "#475569"} strokeWidth={1.5} />
      <Text className={`flex-1 text-base font-semibold ml-4 ${isDanger ? 'text-red-500' : 'text-slate-900'}`}>{title}</Text>
      {!isDanger && <ChevronRight size={20} color="#cbd5e1" />}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-5 pt-2.5 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 -ml-1">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#001f3f] font-serif">Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyProfile')} className="p-1 -mr-1">
          <Edit2 color="#64748b" size={22} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pt-6 pb-10">
        
        {/* Profile Header Card */}
        <View className="bg-white rounded-2xl py-8 items-center mb-6 border border-slate-100 shadow-sm shadow-black/5 elevation-2">
          <View className="relative mb-4">
            <Image 
              source={{ uri: profileImage }} 
              className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-sm shadow-black/10 elevation-4" 
            />
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={handleCameraPress}
              className="absolute bottom-0 right-1"
            >
              <View className="bg-[#17211F] w-9 h-9 rounded-full items-center justify-center border-2 border-white shadow-sm elevation-2">
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Camera size={16} color="#fff" strokeWidth={2.5} />
                </Animated.View>
              </View>
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-bold text-[#001f3f] font-serif mb-1">Advocate Kumar</Text>
          <Text className="text-base text-slate-500 mb-2">Senior Advocate</Text>
          <Text className="text-[15px] text-slate-500 mb-1">kumarlawchambers@gmail.com</Text>
          <Text className="text-[15px] text-slate-500">+91 98765 43210</Text>
        </View>

        {/* Menu Items */}
        <View className="bg-white rounded-xl py-2 border border-slate-100 shadow-sm shadow-black/5 elevation-2">
          <MenuItem 
            icon={User} 
            title="My Profile" 
            onPress={() => navigation.navigate('MyProfile')} 
          />
          <MenuItem 
            icon={Lock} 
            title="Change Password" 
            onPress={() => navigation.navigate('ChangePassword')} 
          />
          <MenuItem 
            icon={Bell} 
            title="Notification Settings" 
            onPress={() => navigation.navigate('NotificationSettings')} 
          />
          <MenuItem 
            icon={Settings} 
            title="App Settings" 
            onPress={() => navigation.navigate('AppSettings')} 
          />
          <MenuItem 
            icon={HelpCircle} 
            title="Help & Support" 
            onPress={() => navigation.navigate('HelpSupport')} 
          />
          <MenuItem 
            icon={LogOut} 
            title="Logout" 
            isDanger 
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })} 
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Custom Action Sheet Modal */}
      <Modal
        visible={isActionSheetVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActionSheetVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <Pressable className="absolute top-0 bottom-0 left-0 right-0 bg-black/40" onPress={() => setActionSheetVisible(false)} />
          <View className="bg-white rounded-3xl w-[85%] px-6 pt-6 pb-6 shadow-md shadow-black/10 elevation-10">
            <View className="mb-5 items-center">
              <Text className="text-lg font-bold text-[#001f3f] mb-1">Update Profile Photo</Text>
              <Text className="text-sm text-slate-500">Choose a new photo for your profile</Text>
            </View>
            
            <TouchableOpacity className="flex-row items-center py-4 border-b border-slate-100" onPress={() => pickImage(true)}>
              <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-4 border border-slate-200">
                <CameraIcon size={20} color="#17211F" />
              </View>
              <Text className="text-base font-semibold text-slate-900">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4 border-b border-slate-100" onPress={() => pickImage(false)}>
              <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-4 border border-slate-200">
                <ImageIcon size={20} color="#17211F" />
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
