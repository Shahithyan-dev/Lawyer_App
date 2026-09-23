import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, Save, ChevronDown, Check, Briefcase } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../../config/api';

const InputField = ({ label, value, onChangeText, placeholder, required, multiline }) => (
  <View className="mb-4">
    <Text className="text-[13px] font-semibold text-slate-600 mb-2">
      {label} {required && <Text className="text-red-500">*</Text>}
    </Text>
    <TextInput
      className={`bg-slate-50 border border-slate-200 rounded-xl px-4 text-[15px] text-slate-900 ${multiline ? 'h-24 pt-4 pb-4' : 'h-[52px]'}`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      textAlignVertical={multiline ? 'top' : 'center'}
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
          <Text className={`text-[15px] flex-1 pr-2 ${!value ? 'text-slate-400' : 'text-slate-900'}`} numberOfLines={1}>
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
                  <Text className={`text-base ${value === item.value ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
                    {item.label}
                  </Text>
                  {value === item.value && <Check size={20} color="#2563eb" />}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default function AddEventScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [eventType, setEventType] = useState('Task/Meeting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [casesRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/cases`),
        axios.get(`${API_URL}/users`)
      ]);
      setCases(casesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter an event title.');
      return;
    }
    if (!eventDate.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid date (YYYY-MM-DD).');
      return;
    }

    setLoading(true);
    try {
      if (eventType === 'Court Hearing') {
        if (!selectedCase) {
          Alert.alert('Validation Error', 'Please select a case for this hearing.');
          setLoading(false);
          return;
        }
        await axios.put(`${API_URL}/cases/${selectedCase}`, {
          nextHearingDate: eventDate
        });
      } else {
        if (!assignedTo) {
          Alert.alert('Validation Error', 'Please select a staff member.');
          setLoading(false);
          return;
        }
        const taskPayload = {
          title: title,
          description: description,
          dueDate: eventDate,
          status: 'Pending',
          priority: 'Medium',
          assignedTo: assignedTo
        };

        await axios.post(`${API_URL}/tasks`, taskPayload);
      }

      Alert.alert('Success', 'Calendar event created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to schedule event.');
    } finally {
      setLoading(false);
    }
  };

  const caseOptions = cases.map(c => ({ label: `${c.caseNumber} - ${c.title}`, value: c._id }));
  const userOptions = users.map(u => ({ label: `${u.name} (${u.role})`, value: u._id }));

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full">
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-center text-slate-900 mr-8">Add Event</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1" contentContainerClassName="p-5 pb-10" showsVerticalScrollIndicator={false}>
          
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity 
              onPress={() => setEventType('Task/Meeting')}
              className={`flex-1 py-3 items-center rounded-l-xl border ${eventType === 'Task/Meeting' ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'}`}
            >
              <Text className={`font-semibold ${eventType === 'Task/Meeting' ? 'text-white' : 'text-slate-600'}`}>Task / Meeting</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setEventType('Court Hearing')}
              className={`flex-1 py-3 items-center rounded-r-xl border border-l-0 ${eventType === 'Court Hearing' ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'}`}
            >
              <Text className={`font-semibold ${eventType === 'Court Hearing' ? 'text-white' : 'text-slate-600'}`}>Court Hearing</Text>
            </TouchableOpacity>
          </View>

          <InputField label="Event Title" value={title} onChangeText={setTitle} placeholder="Enter title" required />
          <InputField label="Description" value={description} onChangeText={setDescription} placeholder="Enter details..." multiline />
          <InputField label="Date (YYYY-MM-DD)" value={eventDate} onChangeText={setEventDate} placeholder="e.g. 2026-10-15" required />

          {eventType === 'Task/Meeting' ? (
            <DropdownField 
              label="Assign To (Staff)"
              value={users.find(u => u._id === assignedTo)?.name}
              options={userOptions}
              onSelect={setAssignedTo}
              required
            />
          ) : (
            <DropdownField 
              label="Select Case"
              value={cases.find(c => c._id === selectedCase)?.title}
              options={caseOptions}
              onSelect={setSelectedCase}
              required
            />
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View className="px-5 py-4 border-t border-slate-100 bg-white" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <TouchableOpacity
          className={`h-14 rounded-2xl flex-row items-center justify-center ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Calendar size={20} color="#fff" />
          <Text className="text-white font-bold text-base ml-2">
            {loading ? 'Scheduling...' : 'Schedule Event'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
