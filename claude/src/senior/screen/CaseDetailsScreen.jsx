import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Linking, Modal, TextInput, FlatList
} from 'react-native';
import { ChevronLeft, FileText, Calendar, Clock, MapPin, Phone, Mail, User, Briefcase, Check, Plus, Edit2, Download, ExternalLink, Activity, ChevronDown, Paperclip, Save, Users } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '../../config/api';
import * as DocumentPicker from 'expo-document-picker';

// ─── Reusable Dropdown ───────────────────────────────────────────────────────
const DropdownField = ({ label, value, options, onSelect, required }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <View className="mb-4">
        <Text className="text-[13px] font-semibold text-slate-600 mb-2">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
        <TouchableOpacity
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-[52px] flex-row items-center justify-between"
          onPress={() => setVisible(true)}
        >
          <Text className={`text-[15px] flex-1 pr-2 ${!value ? 'text-slate-400' : 'text-slate-900'}`} numberOfLines={1}>
            {value || `Select ${label}`}
          </Text>
          <ChevronDown size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity className="flex-1 bg-black/50 justify-end" activeOpacity={1} onPress={() => setVisible(false)}>
          <View className="bg-white rounded-t-3xl p-6 max-h-[60%]">
            <Text className="text-lg font-bold text-slate-900 mb-4">Select {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center justify-between py-4 border-b border-slate-100"
                  onPress={() => { onSelect(item.value); setVisible(false); }}
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

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CaseDetailsScreen({ route, navigation }) {
  const { caseData } = route.params || {};
  const [activeTab, setActiveTab] = useState('Details');

  // ── Details tab state ──
  const [currentStatus, setCurrentStatus] = useState(caseData?.status || 'Active');
  const [statusLoading, setStatusLoading] = useState(false);

  // ── Assign tab state ──
  const [users, setUsers] = useState([]);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);



  useEffect(() => {
    axios.get(`${API_URL}/users`).then(res => setUsers(res.data)).catch(() => {});
  }, []);

  if (!caseData) {
    return <View className="flex-1 justify-center items-center"><Text>No case data found.</Text></View>;
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === currentStatus) return;
    setStatusLoading(true);
    try {
      await axios.put(`${API_URL}/cases/${caseData._id}`, { status: newStatus });
      setCurrentStatus(newStatus);
      Alert.alert('Success', `Case status updated to ${newStatus}`);
    } catch {
      Alert.alert('Error', 'Failed to update case status.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) setSelectedFile(result.assets[0]);
    } catch (err) { console.log('File pick error', err); }
  };

  const handleAssign = async () => {
    if (!assignTitle.trim() || !assignedTo) {
      Alert.alert('Validation', 'Please enter a title and select a staff member.');
      return;
    }
    setAssignLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', assignTitle);
      fd.append('description', assignDesc);
      fd.append('caseReference', caseData._id);
      fd.append('priority', priority);
      fd.append('status', 'To Do');
      fd.append('assignedTo', assignedTo);
      if (selectedFile) {
        fd.append('document', { uri: selectedFile.uri, name: selectedFile.name, type: selectedFile.mimeType || 'application/octet-stream' });
      }
      await axios.post(`${API_URL}/tasks`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('Assigned!', 'Case has been assigned successfully.', [
        { text: 'OK', onPress: () => { setAssignTitle(''); setAssignDesc(''); setAssignedTo(''); setSelectedFile(null); } }
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to assign case.');
    } finally {
      setAssignLoading(false);
    }
  };



  const statusCls = (() => {
    switch (currentStatus) {
      case 'Active': return { bg: 'bg-emerald-500/20', dot: 'bg-emerald-500', text: 'text-emerald-500' };
      case 'Pending': return { bg: 'bg-amber-500/20', dot: 'bg-amber-500', text: 'text-amber-500' };
      case 'Closed': return { bg: 'bg-red-500/20', dot: 'bg-red-500', text: 'text-red-500' };
      default: return { bg: 'bg-slate-500/20', dot: 'bg-slate-500', text: 'text-slate-500' };
    }
  })();

  const TABS = ['Details', 'Assign Case'];
  const userOptions = users.map(u => ({ label: `${u.name} (${u.role})`, value: u._id }));
  const priorityOptions = [{ label: 'LOW', value: 'LOW' }, { label: 'NORMAL', value: 'NORMAL' }, { label: 'HIGH PRIORITY', value: 'HIGH PRIORITY' }];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">

      {/* ── Case Header ── */}
      <View className="bg-white px-4 pt-4 pb-3 border-b border-slate-100">
        <Text className="text-[12px] font-bold text-blue-600 tracking-widest mb-1">{caseData.caseId}</Text>
        <Text className="text-[18px] font-bold text-slate-900" numberOfLines={1}>{caseData.title}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-[13px] text-slate-500 mr-3">{caseData.type}</Text>
          <View className={`flex-row items-center px-2 py-0.5 rounded-full ${statusCls.bg}`}>
            <View className={`w-1.5 h-1.5 rounded-full mr-1 ${statusCls.dot}`} />
            <Text className={`text-[11px] font-semibold ${statusCls.text}`}>{currentStatus}</Text>
          </View>
        </View>
      </View>

      {/* ── Tabs ── */}
      <View className="flex-row bg-white border-b border-slate-200 px-4">
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`py-3 mr-6 ${activeTab === tab ? 'border-b-2 border-blue-600' : ''}`}
          >
            <Text className={`text-[13px] font-semibold ${activeTab === tab ? 'text-blue-600' : 'text-slate-500'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerClassName="p-4 pb-16" showsVerticalScrollIndicator={false}>

        {/* ══════════════ DETAILS TAB ══════════════ */}
        {activeTab === 'Details' && (
          <>
            {/* Client Info */}
            <View className="bg-white p-5 rounded-2xl border border-slate-100 mb-4">
              <Text className="text-base font-bold text-slate-900 mb-4">Client Information</Text>

              <View className="flex-row items-center py-3 border-b border-slate-100">
                <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-4">
                  <Briefcase size={18} color="#64748b" />
                </View>
                <View className="flex-1">
                  <Text className="text-[12px] text-slate-500 mb-0.5">Client Name</Text>
                  <Text className="text-[15px] text-slate-700 font-semibold">{caseData.client?.name || 'Unknown'}</Text>
                </View>
              </View>

              {caseData.client?.email && (
                <View className="flex-row items-center py-3 border-b border-slate-100">
                  <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-4">
                    <Mail size={18} color="#64748b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[12px] text-slate-500 mb-0.5">Email</Text>
                    <Text className="text-[15px] text-slate-700 font-semibold">{caseData.client.email}</Text>
                  </View>
                </View>
              )}

              {caseData.client?.mobile && (
                <TouchableOpacity
                  className="flex-row items-center bg-slate-50 p-4 rounded-xl border border-slate-200 mt-3"
                  onPress={() => Linking.openURL(`tel:${caseData.client.mobile}`)}
                >
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
                    <Phone size={20} color="#2563eb" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[12px] text-slate-500 mb-0.5">Mobile</Text>
                    <Text className="text-base font-semibold text-blue-600">{caseData.client.mobile}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Case Details */}
            <View className="bg-white p-5 rounded-2xl border border-slate-100 mb-4">
              <Text className="text-base font-bold text-slate-900 mb-4">Case Details</Text>
              <View className="flex-row items-center py-3 border-b border-slate-100">
                <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-4">
                  <MapPin size={18} color="#64748b" />
                </View>
                <View className="flex-1">
                  <Text className="text-[12px] text-slate-500 mb-0.5">Court</Text>
                  <Text className="text-[15px] text-slate-700 font-semibold">{caseData.court || 'N/A'}</Text>
                </View>
              </View>
              <View className="flex-row items-center pt-3">
                <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-4">
                  <Calendar size={18} color="#64748b" />
                </View>
                <View className="flex-1">
                  <Text className="text-[12px] text-slate-500 mb-0.5">Next Hearing</Text>
                  <Text className="text-[15px] text-slate-700 font-semibold">
                    {caseData.nextHearing
                      ? new Date(caseData.nextHearing).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
                      : 'Not Scheduled'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Update Status */}
            <View className="bg-white p-5 rounded-2xl border border-slate-100 mb-4">
              <Text className="text-base font-bold text-slate-900 mb-1">Update Status</Text>
              <Text className="text-[12px] text-slate-500 mb-4">Changes will update for everyone in your firm.</Text>
              <View className="flex-row justify-between">
                {[
                  { label: 'Active', color: 'emerald', icon: <CheckCircle2 size={20} color={currentStatus === 'Active' ? '#fff' : '#10b981'} /> },
                  { label: 'Pending', color: 'amber', icon: <Clock size={20} color={currentStatus === 'Pending' ? '#fff' : '#f59e0b'} /> },
                  { label: 'Closed', color: 'red', icon: <CheckCircle size={20} color={currentStatus === 'Closed' ? '#fff' : '#ef4444'} /> },
                ].map(({ label, color, icon }) => (
                  <TouchableOpacity
                    key={label}
                    className={`flex-1 border-[1.5px] rounded-xl py-3 items-center mx-1 border-${color}-500 ${currentStatus === label ? `bg-${color}-500` : ''}`}
                    onPress={() => handleStatusUpdate(label)}
                    disabled={statusLoading}
                  >
                    {icon}
                    <Text className={`text-[13px] font-semibold mt-1.5 ${currentStatus === label ? 'text-white' : 'text-slate-600'}`}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {statusLoading && (
                <View className="flex-row items-center justify-center mt-4">
                  <ActivityIndicator size="small" color="#2563eb" />
                  <Text className="ml-2 text-blue-600 font-semibold text-sm">Updating...</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* ══════════════ ASSIGN CASE TAB ══════════════ */}
        {activeTab === 'Assign Case' && (
          <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm elevation-2">
            <View className="flex-row items-center mb-5 pb-4 border-b border-slate-100">
              <Users size={22} color="#2563eb" strokeWidth={2} />
              <Text className="text-lg font-bold text-slate-900 ml-2.5">Assign to Staff</Text>
            </View>

            {/* Pre-filled case reference */}
            <View className="mb-4">
              <Text className="text-[13px] font-semibold text-slate-600 mb-2">Case Reference</Text>
              <View className="bg-blue-50 border border-blue-200 rounded-xl px-4 h-[52px] justify-center">
                <Text className="text-[14px] text-blue-700 font-semibold" numberOfLines={1}>
                  {caseData.caseId} — {caseData.title}
                </Text>
              </View>
            </View>

            {/* Title */}
            <View className="mb-4">
              <Text className="text-[13px] font-semibold text-slate-600 mb-2">Task Title <Text className="text-red-500">*</Text></Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-[52px] text-[15px] text-slate-900"
                placeholder="e.g. Draft Bail Petition"
                placeholderTextColor="#94a3b8"
                value={assignTitle}
                onChangeText={setAssignTitle}
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-[13px] font-semibold text-slate-600 mb-2">Description</Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-24 text-[15px] text-slate-900"
                placeholder="Add task details..."
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
                style={{ paddingTop: 14 }}
                value={assignDesc}
                onChangeText={setAssignDesc}
              />
            </View>

            <DropdownField
              label="Assign To"
              value={userOptions.find(o => o.value === assignedTo)?.label || ''}
              options={userOptions}
              onSelect={setAssignedTo}
              required
            />

            <DropdownField
              label="Priority"
              value={priority}
              options={priorityOptions}
              onSelect={setPriority}
            />

            {/* Document */}
            <View className="mb-5">
              <Text className="text-[13px] font-semibold text-slate-600 mb-2">Attach Document (optional)</Text>
              {!selectedFile ? (
                <TouchableOpacity
                  className="bg-slate-50 border border-slate-200 border-dashed rounded-xl h-[52px] flex-row items-center justify-center"
                  onPress={handleSelectFile}
                >
                  <Paperclip size={20} color="#64748b" />
                  <Text className="text-slate-500 font-semibold ml-2">Attach PDF / Word</Text>
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-xl p-3 justify-between">
                  <View className="flex-row items-center flex-1">
                    <Paperclip size={20} color="#3B82F6" />
                    <Text className="text-blue-900 font-medium ml-2 flex-1" numberOfLines={1}>{selectedFile.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedFile(null)} className="p-1">
                    <X size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              className={`bg-blue-600 rounded-xl h-14 flex-row items-center justify-center shadow-sm shadow-blue-600/30 elevation-4 ${assignLoading ? 'opacity-70' : ''}`}
              onPress={handleAssign}
              disabled={assignLoading}
            >
              <Save color="#ffffff" size={20} style={{ marginRight: 8 }} />
              <Text className="text-white text-base font-bold">{assignLoading ? 'Assigning...' : 'Assign Case'}</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
