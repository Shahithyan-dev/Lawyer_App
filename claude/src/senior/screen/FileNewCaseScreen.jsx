import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView,
  Alert, Modal, FlatList, Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, User, Briefcase, ChevronDown, Save, ArrowRight, Check, CheckSquare } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../../config/api';

// Import India states and districts data
import indiaData from '../../data/states-and-districts.json';

const InputField = ({ label, value, onChangeText, placeholder, multiline, keyboardType, required, maxLength }) => (
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
      keyboardType={keyboardType || 'default'}
      textAlignVertical={multiline ? 'top' : 'center'}
      maxLength={maxLength}
    />
  </View>
);

const DropdownField = ({ label, value, options, onSelect, required, searchable = false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = searchable && searchText.trim() !== ''
    ? (options || []).filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()))
    : (options || []);

  return (
    <>
      <View className="mb-4">
        <Text className="text-[13px] font-semibold text-slate-600 mb-2">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
        <TouchableOpacity className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-[52px] flex-row items-center justify-between" activeOpacity={0.8} onPress={() => { setSearchText(''); setModalVisible(true); }}>
          <Text className={`text-[15px] ${!value ? 'text-slate-400' : 'text-slate-900'}`} numberOfLines={1}>
            {options?.find(o => o.value === value)?.label || value || `Select ${label}`}
          </Text>
          <ChevronDown size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity className="flex-1 bg-black/50 justify-end" activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View className={`bg-white rounded-t-3xl p-6 ${searchable ? 'max-h-[80%]' : 'max-h-[60%]'}`}>
            <Text className="text-lg font-bold text-slate-900 mb-4">Select {label}</Text>
            {searchable && (
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 mb-4 text-[15px] text-slate-900"
                placeholder={`Search ${label}...`}
                placeholderTextColor="#94a3b8"
                value={searchText}
                onChangeText={setSearchText}
              />
            )}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center justify-between py-4 border-b border-slate-100"
                  onPress={() => {
                    if (onSelect) onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text className={`text-base ${value === item.value ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>
                    {item.label}
                  </Text>
                  {value === item.value && <Check size={20} color="#2563eb" />}
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text className="text-center text-slate-400 mt-4 text-sm">No results found.</Text>}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const CASE_CATEGORIES = {
  'Civil': [
    'Principal Munsif',
    'Munsif (below 1 lakh)',
    'Sub court (1 - 10 lakh)',
    'District court (10 lakh - 2 crore)',
    'High court (Above 2 crore)'
  ],
  'Criminal': [
    'J.M. (3 yrs or 50k fine)',
    'C.J.M. (7 yrs imprisonment)',
    'District / Session court (7 yrs to life)',
    'High court (Death penalty)'
  ],
  'Special Court': [
    'Mahila court (ladies / POSCO cases)',
    'MCOP court (Accident / Insurance)',
    'NDPS court (Drugs related cases)',
    'CBI & CBCID court',
    'SC/ST court',
    'NIA court',
    'Economic offense court',
    'Prevention of corruption Act court',
    'MP/MLA special court',
    'Rent court'
  ],
  'Family': [
    'Divorce - Civil',
    'Maintenance - Criminal'
  ],
  'Tribunal': [
    'Corporate (Individual vs company)'
  ],
  'Tax': [
    'Tax Court',
    'Income Tax Appellate Tribunal (ITAT)',
    'Customs, Excise and Service Tax Appellate Tribunal (CESTAT)'
  ]
};

const CASE_TITLES = [
  // Criminal
  { label: 'IPC 302 - Murder', value: 'IPC 302 - Murder', type: 'Criminal' },
  { label: 'IPC 307 - Attempt to Murder', value: 'IPC 307 - Attempt to Murder', type: 'Criminal' },
  { label: 'IPC 376 - Rape', value: 'IPC 376 - Rape', type: 'Criminal' },
  { label: 'IPC 378 - Theft', value: 'IPC 378 - Theft', type: 'Criminal' },
  { label: 'IPC 420 - Cheating', value: 'IPC 420 - Cheating', type: 'Criminal' },
  { label: 'IPC 498A - Cruelty by Husband/Relatives', value: 'IPC 498A - Cruelty by Husband/Relatives', type: 'Criminal' },
  { label: 'IPC 120B - Criminal Conspiracy', value: 'IPC 120B - Criminal Conspiracy', type: 'Criminal' },
  { label: 'Negotiable Instruments Act Sec 138 (Cheque Bounce)', value: 'NI Act Sec 138 (Cheque Bounce)', type: 'Criminal' },
  
  // Civil
  { label: 'Property Dispute', value: 'Property Dispute', type: 'Civil' },
  { label: 'Breach of Contract', value: 'Breach of Contract', type: 'Civil' },
  { label: 'Injunction', value: 'Injunction', type: 'Civil' },
  { label: 'Specific Performance', value: 'Specific Performance', type: 'Civil' },
  
  // Special Court
  { label: 'POCSO Act (Child Protection)', value: 'POCSO Act (Child Protection)', type: 'Special Court' },
  { label: 'NDPS Act (Narcotics)', value: 'NDPS Act (Narcotics)', type: 'Special Court' },
  { label: 'Prevention of Corruption Act', value: 'Prevention of Corruption Act', type: 'Special Court' },
  { label: 'SC/ST (Prevention of Atrocities) Act', value: 'SC/ST (Prevention of Atrocities) Act', type: 'Special Court' },
  
  // Family
  { label: 'Hindu Marriage Act Sec 13 (Divorce)', value: 'Hindu Marriage Act Sec 13 (Divorce)', type: 'Family' },
  { label: 'Sec 125 CrPC (Maintenance)', value: 'Sec 125 CrPC (Maintenance)', type: 'Family' },
  { label: 'Child Custody / Guardianship', value: 'Child Custody / Guardianship', type: 'Family' },
  { label: 'Domestic Violence Act (DVC)', value: 'Domestic Violence Act (DVC)', type: 'Family' },
  
  // Tribunal
  { label: 'Corporate / NCLT Dispute', value: 'Corporate / NCLT Dispute', type: 'Tribunal' },
  { label: 'Motor Accident Claim (MCOP)', value: 'Motor Accident Claim (MCOP)', type: 'Tribunal' },
  
  // Tax
  { label: 'Income Tax Dispute', value: 'Income Tax Dispute', type: 'Tax' },
  { label: 'GST Dispute', value: 'GST Dispute', type: 'Tax' },
];

export default function FileNewCaseScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users for the Assign Case step
    axios.get(`${API_URL}/users`)
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, []);

  // Client State
  const [clientName, setClientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [clientStatus, setClientStatus] = useState('Active');
  const [address, setAddress] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');

  // Case State
  const [caseTitle, setCaseTitle] = useState('');
  const [caseType, setCaseType] = useState('Civil');
  const [courtName, setCourtName] = useState('');
  const [caseStatus, setCaseStatus] = useState('Open');
  const [hearingDate, setHearingDate] = useState('');

  // Assign Case State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');

  const [savedCaseId, setSavedCaseId] = useState(null);

  const handleProceedToCase = () => {
    Keyboard.dismiss();
    if (!clientName.trim()) { Alert.alert('Validation Error', 'Please enter the client\'s full name.'); return; }
    
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile.trim()) { Alert.alert('Validation Error', 'Please enter the client\'s mobile number.'); return; } 
    else if (!mobileRegex.test(mobile.trim())) { Alert.alert('Validation Error', 'Please enter a valid 10-digit Indian mobile number.'); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email.trim())) { Alert.alert('Validation Error', 'Please enter a valid email address.'); return; }

    if (!address.trim()) { Alert.alert('Validation Error', 'Please enter the client\'s address.'); return; } 
    else if (address.trim().length < 10) { Alert.alert('Validation Error', 'Please enter a complete address (at least 10 characters).'); return; }

    if (!stateName.trim()) { Alert.alert('Validation Error', 'Please select the state.'); return; }
    if (!district.trim()) { Alert.alert('Validation Error', 'Please select the district.'); return; }
    
    setStep(2);
  };

  const handleProceedToAssign = () => {
    Keyboard.dismiss();
    if (!caseTitle.trim()) { Alert.alert('Validation Error', 'Please select a case title / section.'); return; }
    if (!courtName.trim()) { Alert.alert('Validation Error', 'Please select the court name.'); return; }
    setStep(3);
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!assignedTo) { Alert.alert('Validation Error', 'Please select a staff member to assign the case.'); return; }

    setLoading(true);
    try {
      // 1. Create Client
      const clientPayload = {
        name: clientName, email: email, mobile: mobile,
        address: `${address}, ${district}, ${stateName}`.replace(/^, | ,/g, '').trim(),
        status: clientStatus
      };
      const clientRes = await axios.post(`${API_URL}/clients`, clientPayload);
      const savedClient = clientRes.data;
      
      // 2. Create Case
      const casePayload = {
        title: caseTitle, type: caseType, court: courtName,
        client: savedClient._id, status: caseStatus, nextHearing: hearingDate || null,
        caseNumber: `CASE-${Math.floor(Date.now() / 1000)}`,
        assignedTo: [assignedTo]
      };
      const caseRes = await axios.post(`${API_URL}/cases`, casePayload);
      const savedCase = caseRes.data;

      // 3. Assign Task
      const taskPayload = {
        title: taskTitle || caseTitle,
        description: taskDescription,
        relatedCase: savedCase._id,
        relatedClient: savedClient._id,
        priority: priority,
        status: 'Pending',
        assignedTo: assignedTo
      };

      await axios.post(`${API_URL}/tasks`, taskPayload);
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving data:', error);
      const serverMessage = error.response?.data?.message || error.message || 'Unknown error';
      Alert.alert('Error', `Failed to save to the database. Server says: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCaseTitleSelect = (val) => {
    setCaseTitle(val);
    const selectedItem = CASE_TITLES.find(t => t.value === val);
    if (selectedItem) {
      setCaseType(selectedItem.type);
      setCourtName(''); // Reset court name when case type changes
    }
    // Auto-populate task title
    setTaskTitle(val);
  };

  const userOptions = users.map(u => ({ label: `${u.name} (${u.role})`, value: u._id }));
  const priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Urgent', value: 'Urgent' },
  ];

  return (
    <View className="flex-1 bg-[#FAF7F2]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5">
        <TouchableOpacity onPress={() => { if (step > 1) setStep(step - 1); else navigation.goBack(); }} className="p-1 -ml-1">
          <ChevronLeft color="#0f172a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 font-serif">File New Case</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1" keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}>
        <ScrollView contentContainerClassName="p-5" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          {/* Progress Indicator */}
          <View className="flex-row items-center justify-center mb-2 px-6">
            <View className={`w-6 h-6 rounded-full border-4 z-10 ${step >= 1 ? 'bg-blue-600 border-blue-100' : 'bg-slate-200 border-slate-50'}`} />
            <View className={`flex-1 h-[3px] -mx-2 z-0 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <View className={`w-6 h-6 rounded-full border-4 z-10 ${step >= 2 ? 'bg-blue-600 border-blue-100' : 'bg-slate-200 border-slate-50'}`} />
            <View className={`flex-1 h-[3px] -mx-2 z-0 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <View className={`w-6 h-6 rounded-full border-4 z-10 ${step >= 3 ? 'bg-blue-600 border-blue-100' : 'bg-slate-200 border-slate-50'}`} />
          </View>
          <View className="flex-row justify-between mb-8" style={{ paddingHorizontal: 10 }}>
            <Text className={`text-[11px] font-semibold ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>Client Details</Text>
            <Text className={`text-[11px] font-semibold ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>Case Details</Text>
            <Text className={`text-[11px] font-semibold ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>Assign Case</Text>
          </View>

          {/* STEP 1: CLIENT DETAILS */}
          {step === 1 && (
            <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
              <View className="flex-row items-center mb-5 pb-4 border-b border-slate-100">
                <User size={22} color="#2563eb" strokeWidth={2} />
                <Text className="text-lg font-bold text-slate-900 ml-2.5">Client Details</Text>
              </View>

              <InputField label="Full Name" placeholder="Enter client's full name" value={clientName} onChangeText={setClientName} required />
              <InputField label="Mobile Number" placeholder="+91" keyboardType="phone-pad" value={mobile} onChangeText={setMobile} required maxLength={10} />
              <InputField label="Email Address" placeholder="example@email.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
              <InputField label="Address" placeholder="Enter client's residential or office address" value={address} onChangeText={setAddress} required multiline />

              <View className="flex-row justify-between gap-4">
                <View className="flex-1">
                  <DropdownField label="State" value={stateName} options={indiaData.states.map(s => ({ label: s.state, value: s.state }))} onSelect={(val) => { setStateName(val); setDistrict(''); }} required searchable />
                </View>
                <View className="flex-1">
                  <DropdownField label="District" value={district} options={stateName ? indiaData.states.find(s => s.state === stateName)?.districts.map(d => ({ label: d, value: d })) || [] : []} onSelect={setDistrict} required searchable />
                </View>
              </View>

              <TouchableOpacity className="bg-blue-600 rounded-xl h-14 flex-row items-center justify-center mt-4 shadow-sm shadow-blue-600/30 elevation-4" onPress={handleProceedToCase}>
                <Text className="color-white text-base font-bold">Proceed to Case Details</Text>
                <ArrowRight color="#ffffff" size={20} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: CASE DETAILS */}
          {step === 2 && (
            <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
              <View className="flex-row items-center mb-5 pb-4 border-b border-slate-100">
                <Briefcase size={22} color="#2563eb" strokeWidth={2} />
                <Text className="text-lg font-bold text-slate-900 ml-2.5">Case Details</Text>
              </View>

              <DropdownField 
                label="Case Title / Section" 
                value={caseTitle} 
                options={CASE_TITLES} 
                onSelect={handleCaseTitleSelect} 
                required 
                searchable
              />

              <View className="mb-4">
                <Text className="text-[13px] font-semibold text-slate-600 mb-2">Client <Text className="text-red-500">*</Text></Text>
                <View className="bg-slate-100 border border-slate-200 rounded-xl px-4 h-[52px] justify-center">
                  <Text className="text-[15px] text-slate-500">{clientName || 'Select Client'}</Text>
                </View>
              </View>

              <DropdownField label="Case Type" value={caseType} options={Object.keys(CASE_CATEGORIES).map(k => ({ label: k, value: k }))} onSelect={(val) => { setCaseType(val); setCourtName(''); }} />
              <DropdownField label="Court Name" value={courtName} options={caseType && CASE_CATEGORIES[caseType] ? CASE_CATEGORIES[caseType].map(c => ({ label: c, value: c })) : []} onSelect={setCourtName} required />

              <TouchableOpacity className="bg-blue-600 rounded-xl h-14 flex-row items-center justify-center mt-4 shadow-sm shadow-blue-600/30 elevation-4" onPress={handleProceedToAssign} disabled={loading}>
                <Text className="color-white text-base font-bold">Proceed to Assign Case</Text>
                <ArrowRight color="#ffffff" size={20} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 3: ASSIGN CASE */}
          {step === 3 && (
            <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
              <View className="flex-row items-center mb-5 pb-4 border-b border-slate-100">
                <CheckSquare size={22} color="#2563eb" strokeWidth={2} />
                <Text className="text-lg font-bold text-slate-900 ml-2.5">Assign Case</Text>
              </View>

              <DropdownField
                label="Assign To (Staff)"
                value={assignedTo}
                options={userOptions}
                onSelect={setAssignedTo}
                required
              />

              <InputField
                label="Task Title"
                placeholder="e.g. Initial Research & Draft"
                value={taskTitle}
                onChangeText={setTaskTitle}
              />

              <InputField
                label="Description & Instructions"
                placeholder="Add details about the case assignment..."
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline
              />

              <DropdownField
                label="Priority"
                value={priority}
                options={priorityOptions}
                onSelect={setPriority}
              />

              <TouchableOpacity 
                className={`bg-blue-600 rounded-xl h-14 flex-row items-center justify-center mt-4 shadow-sm shadow-blue-600/30 elevation-4 ${loading ? 'opacity-70' : ''}`} 
                onPress={handleSave}
                disabled={loading}
              >
                <Save color="#ffffff" size={20} style={{ marginRight: 8 }} />
                <Text className="color-white text-base font-bold">{loading ? 'Saving All...' : 'Save & Assign Case'}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modern Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View className="flex-1 bg-slate-900/70 justify-center items-center p-5">
          <View className="bg-white rounded-3xl p-8 items-center w-full max-w-[340px] shadow-lg shadow-black/10 elevation-10">
            <View className="w-20 h-20 rounded-full bg-emerald-500 justify-center items-center mb-6 shadow-sm shadow-emerald-500/30 elevation-6">
              <Check size={40} color="#fff" strokeWidth={3} />
            </View>
            <Text className="text-2xl font-bold text-slate-900 mb-3">Success!</Text>
            <Text className="text-[15px] color-slate-500 text-center mb-8 leading-6">Client, Case, and Task assignment saved successfully!</Text>
            
            <TouchableOpacity 
              className="bg-blue-600 rounded-2xl w-full h-[52px] justify-center items-center mb-3 shadow-sm shadow-blue-600/20" 
              activeOpacity={0.8} 
              onPress={() => { setShowSuccessModal(false); navigation.goBack(); }}
            >
              <Text className="text-white text-base font-bold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
