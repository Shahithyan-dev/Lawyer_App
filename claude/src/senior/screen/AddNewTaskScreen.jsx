import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, CheckSquare, Save, ChevronDown, Check, Paperclip, X } from 'lucide-react-native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
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

export default function AddNewTaskScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseReference: '',
    priority: 'NORMAL',
    status: 'To Do',
    assignedTo: '',
    dueDate: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        copyToCacheDirectory: true
      });
      if (!result.canceled && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      console.log('Error picking document', err);
    }
  };

  useEffect(() => {
    // Fetch cases and users in parallel
    Promise.all([
      axios.get(`${API_URL}/cases`),
      axios.get(`${API_URL}/users`)
    ])
      .then(([casesRes, usersRes]) => {
        setCases(casesRes.data);
        setUsers(usersRes.data);
      })
      .catch(console.error);
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.assignedTo) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.caseReference) {
        formDataToSend.append('caseReference', formData.caseReference);
      }
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('assignedTo', formData.assignedTo);

      if (selectedFile) {
        formDataToSend.append('document', {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || 'application/octet-stream',
        });
      }

      await axios.post(`${API_URL}/tasks`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Case assigned successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to assign case.');
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map(u => ({ label: `${u.name} (${u.role})`, value: u._id }));
  const caseOptions = [
    { label: 'No Case', value: '' },
    ...cases.map(c => ({ label: `${c.caseId} - ${c.title}`, value: c._id }))
  ];
  const priorityOptions = [
    { label: 'LOW', value: 'LOW' },
    { label: 'NORMAL', value: 'NORMAL' },
    { label: 'HIGH PRIORITY', value: 'HIGH PRIORITY' },
  ];

  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 -ml-1">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 font-serif">Assign New Case</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="p-5" keyboardShouldPersistTaps="handled">

          <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
            <View className="flex-row items-center mb-5 pb-4 border-b border-slate-100">
              <CheckSquare size={22} color="#2563eb" strokeWidth={2} />
              <Text className="text-lg font-bold text-slate-900 ml-2.5">Case Details</Text>
            </View>

            <InputField
              label="Case Title"
              placeholder="e.g. Draft Bail Petition"
              value={formData.title}
              onChangeText={(text) => handleChange('title', text)}
              required
            />

            <InputField
              label="Description"
              placeholder="Add details about the case assignment..."
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              multiline
            />

            <DropdownField
              label="Assign To"
              value={userOptions.find(o => o.value === formData.assignedTo)?.label || ''}
              options={userOptions}
              onSelect={(val) => handleChange('assignedTo', val)}
              required
            />

            <DropdownField
              label="Related Case"
              value={caseOptions.find(o => o.value === formData.caseReference)?.label || ''}
              options={caseOptions}
              onSelect={(val) => handleChange('caseReference', val)}
            />

            <DropdownField
              label="Priority"
              value={formData.priority}
              options={priorityOptions}
              onSelect={(val) => handleChange('priority', val)}
            />

            {/* Document Upload Section */}
            <View className="mt-3 mb-5">
              <Text className="text-[13px] font-semibold text-slate-600 mb-2">Case Document (PDF/Word)</Text>
              {!selectedFile ? (
                <TouchableOpacity className="bg-slate-50 border border-slate-200 border-dashed rounded-xl h-[52px] flex-row items-center justify-center" onPress={handleSelectFile}>
                  <Paperclip size={20} color="#64748b" />
                  <Text className="text-slate-500 font-semibold ml-2">Attach Document</Text>
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-xl p-3 justify-between">
                  <View className="flex-row items-center flex-1">
                    <Paperclip size={20} color="#3B82F6" />
                    <Text className="color-blue-900 font-medium ml-2 flex-1" numberOfLines={1}>{selectedFile.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedFile(null)} className="p-1">
                    <X size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              className={`bg-blue-600 rounded-xl h-14 flex-row items-center justify-center mt-4 shadow-sm shadow-blue-600/30 elevation-4 ${loading ? 'opacity-70' : ''}`}
              onPress={handleSave}
              disabled={loading}
            >
              <Save color="#ffffff" size={20} style={{ marginRight: 8 }} />
              <Text className="color-white text-base font-bold">{loading ? 'Saving...' : 'Assign Case'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
