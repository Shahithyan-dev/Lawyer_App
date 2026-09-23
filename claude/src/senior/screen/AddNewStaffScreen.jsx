import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, UserPlus, Save, ChevronDown, Check } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../../config/api';

const InputField = ({ label, value, onChangeText, placeholder, required, secureTextEntry }) => (
  <View className="mb-4">
    <Text className="text-[13px] font-semibold text-slate-600 mb-2">
      {label} {required && <Text className="text-red-500">*</Text>}
    </Text>
    <TextInput
      className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-[52px] text-[15px] text-slate-900"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const DropdownField = ({ label, value, options, onSelect, required }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View className="mb-4">
        <Text className="text-[13px] font-semibold text-slate-600 mb-2">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
        <TouchableOpacity className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-[52px] flex-row items-center justify-between" activeOpacity={0.8} onPress={() => setModalVisible(true)}>
          <Text className={`text-[15px] flex-1 pr-2 ${!value ? 'text-slate-400' : 'text-slate-900'}`}>
            {value || 'Select an option'}
          </Text>
          <ChevronDown size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity className="flex-1 bg-black/50 justify-end" activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View className="bg-white rounded-t-3xl p-6 max-h-[60%]">
            <Text className="text-lg font-bold text-slate-900 mb-4">Select {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center justify-between py-4 border-b border-slate-100"
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text className={`text-base ${value === item.value ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>
                    {item.label}
                  </Text>
                  {value === item.value && <Check size={20} color="#2563eb" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default function AddNewStaffScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [seniorAdvocates, setSeniorAdvocates] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Junior Advocate',
    supervisor: ''
  });

  useEffect(() => {
    axios.get(`${API_URL}/users`)
      .then(res => {
        const seniors = res.data.filter(u => u.role === 'Senior Advocate');
        setSeniorAdvocates(seniors);
      })
      .catch(console.error);
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid full email address (e.g., name@example.com).');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users`, {
        ...formData,
      });

      Alert.alert('Success', 'Staff member added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add staff member.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { label: 'Senior Advocate', value: 'Senior Advocate' },
    { label: 'Junior Advocate', value: 'Junior Advocate' },
    { label: 'Paralegal', value: 'Paralegal' },
    { label: 'Clerk', value: 'Clerk' },
    { label: 'Admin', value: 'Admin' },
  ];

  const supervisorOptions = [
    { label: '-- None --', value: '' },
    ...seniorAdvocates.map(s => ({ label: `${s.name} (${s.email})`, value: s._id }))
  ];

  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 -ml-1">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 font-serif">Add Staff Member</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="p-5" keyboardShouldPersistTaps="handled">

          <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
            <View className="flex-row items-center mb-5 pb-4 border-b border-slate-100">
              <UserPlus size={22} color="#2563eb" strokeWidth={2} />
              <Text className="text-lg font-bold text-slate-900 ml-2.5">Employee Details</Text>
            </View>

            <InputField
              label="Full Name"
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              required
            />

            <InputField
              label="Email Address"
              placeholder="e.g. jdoe@example.com"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              required
            />

            <InputField
              label="Temporary Password"
              placeholder="Enter password"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
              required
            />

            <DropdownField
              label="Access Role"
              value={formData.role}
              options={roleOptions}
              onSelect={(val) => handleChange('role', val)}
              required
            />

            {formData.role === 'Junior Advocate' && (
              <DropdownField
                label="Assign Supervisor (Senior Advocate)"
                value={supervisorOptions.find(o => o.value === formData.supervisor)?.label || ''}
                options={supervisorOptions}
                onSelect={(val) => handleChange('supervisor', val)}
              />
            )}

            <TouchableOpacity
              className={`bg-blue-600 rounded-xl h-14 flex-row items-center justify-center mt-4 shadow-sm shadow-blue-600/30 elevation-4 ${loading ? 'opacity-70' : ''}`}
              onPress={handleSave}
              disabled={loading}
            >
              <Save color="#ffffff" size={20} style={{ marginRight: 8 }} />
              <Text className="color-white text-base font-bold">{loading ? 'Saving...' : 'Add Member'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
