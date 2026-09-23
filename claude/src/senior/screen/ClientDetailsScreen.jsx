import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, Alert, Modal, TextInput, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Plus, X, Check, CreditCard } from 'lucide-react-native';

export default function ClientDetailsScreen({ route }) {
  const { clientData } = route.params;

  // ── Payment state ──
  const [payments, setPayments] = useState([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [payDate, setPayDate] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`).catch(() =>
      Alert.alert('Error', 'Unable to make call.')
    );
  };

  const handleEmail = (emailAddress) => {
    if (!emailAddress) return;
    Linking.openURL(`mailto:${emailAddress}`).catch(() =>
      Alert.alert('Error', 'Unable to open email.')
    );
  };

  const handleAddPayment = () => {
    if (!payDate.trim()) {
      Alert.alert('Required', 'Please enter a date or hearing reference.');
      return;
    }
    setPayments(prev => [
      { id: Date.now().toString(), date: payDate.trim(), amount: payAmount.trim(), note: payNote.trim(), paid: false },
      ...prev
    ]);
    setPayDate(''); setPayAmount(''); setPayNote('');
    setShowAddPayment(false);
  };

  const togglePaid = (id) =>
    setPayments(prev => prev.map(p => p.id === id ? { ...p, paid: !p.paid } : p));

  const deletePayment = (id) =>
    Alert.alert('Delete', 'Remove this payment record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setPayments(prev => prev.filter(p => p.id !== id)) }
    ]);

  const totalPaid = payments.filter(p => p.paid).length;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-5 pb-16">

        {/* ── Header Profile ── */}
        <View className="items-center bg-white p-6 rounded-2xl mb-5 border border-slate-200 shadow-sm elevation-2 shadow-black/5">
          <View className="w-20 h-20 rounded-full bg-blue-50 items-center justify-center mb-4 border-2 border-blue-200">
            <Text className="text-[32px] font-bold text-blue-600">
              {clientData.name ? clientData.name.charAt(0).toUpperCase() : 'C'}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-slate-900 mb-1 text-center">{clientData.name}</Text>
          <Text className="text-sm text-slate-500 mb-4">Client ID: {clientData.clientId}</Text>
          <View className={`px-4 py-1.5 rounded-full ${clientData.status === 'Active' ? 'bg-emerald-100' : 'bg-red-100'}`}>
            <Text className={`text-[13px] font-semibold ${clientData.status === 'Active' ? 'text-emerald-800' : 'text-red-800'}`}>
              {clientData.status || 'Active'}
            </Text>
          </View>
        </View>

        {/* ── Contact Information ── */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-slate-200 shadow-sm elevation-1 shadow-black/5">
          <Text className="text-base font-bold text-slate-900 mb-4">Contact Information</Text>

          <TouchableOpacity
            className="flex-row items-center bg-slate-50 p-4 rounded-xl mb-3 border border-slate-200"
            onPress={() => handleCall(clientData.mobile)}
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
              <Phone size={20} color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] text-slate-500 mb-1">Mobile</Text>
              <Text className="text-base font-semibold text-blue-600">{clientData.mobile || 'Not Provided'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-slate-50 p-4 rounded-xl border border-slate-200"
            onPress={() => handleEmail(clientData.email)}
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
              <Mail size={20} color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] text-slate-500 mb-1">Email</Text>
              <Text className="text-base font-semibold text-blue-600">{clientData.email || 'Not Provided'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── General Details ── */}
        <View className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm elevation-1 shadow-black/5 mb-5">
          <Text className="text-base font-bold text-slate-900 mb-4">General Details</Text>

          <View className="flex-row items-center py-3 border-b border-slate-100">
            <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-4">
              <Briefcase size={18} color="#64748b" />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] text-slate-500 mb-1">Company / Occupation</Text>
              <Text className="text-[15px] text-slate-800 font-medium">{clientData.company || 'Not Provided'}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3 border-b border-slate-100">
            <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-4">
              <MapPin size={18} color="#64748b" />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] text-slate-500 mb-1">Address</Text>
              <Text className="text-[15px] text-slate-800 font-medium">{clientData.address || 'Not Provided'}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3">
            <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-4">
              <Calendar size={18} color="#64748b" />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] text-slate-500 mb-1">Client Since</Text>
              <Text className="text-[15px] text-slate-800 font-medium">
                {clientData.createdAt ? new Date(clientData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* ══════════════ PAYMENT LOG ══════════════ */}
        <View className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm elevation-1 shadow-black/5">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <CreditCard size={20} color="#2563eb" />
              <Text className="text-base font-bold text-slate-900 ml-2">Payment Log</Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center bg-blue-600 px-3 py-2 rounded-xl"
              onPress={() => setShowAddPayment(true)}
            >
              <Plus size={16} color="#fff" />
              <Text className="text-white text-[13px] font-bold ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {/* Summary pills */}
          {payments.length > 0 && (
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 items-center">
                <Text className="text-[11px] text-emerald-600 font-semibold">Paid</Text>
                <Text className="text-xl font-bold text-emerald-600">{totalPaid}</Text>
              </View>
              <View className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-3 items-center">
                <Text className="text-[11px] text-amber-600 font-semibold">Pending</Text>
                <Text className="text-xl font-bold text-amber-600">{payments.length - totalPaid}</Text>
              </View>
              <View className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 items-center">
                <Text className="text-[11px] text-slate-500 font-semibold">Total</Text>
                <Text className="text-xl font-bold text-slate-700">{payments.length}</Text>
              </View>
            </View>
          )}

          {/* Empty state */}
          {payments.length === 0 ? (
            <View className="border border-dashed border-slate-200 rounded-xl p-10 items-center">
              <CreditCard size={28} color="#cbd5e1" />
              <Text className="text-slate-400 text-sm mt-2">No payments logged yet.</Text>
              <Text className="text-slate-400 text-xs mt-1">Tap "Add" to record a payment.</Text>
            </View>
          ) : (
            payments.map((item) => (
              <View
                key={item.id}
                className={`flex-row items-center p-4 rounded-xl mb-3 border ${item.paid ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}
              >
                {/* Paid toggle */}
                <TouchableOpacity
                  onPress={() => togglePaid(item.id)}
                  className={`w-8 h-8 rounded-full border-2 items-center justify-center mr-4 ${item.paid ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}
                >
                  {item.paid && <Check size={16} color="#fff" strokeWidth={3} />}
                </TouchableOpacity>

                {/* Info */}
                <View className="flex-1">
                  <Text className={`text-[13px] font-bold ${item.paid ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {item.date}
                  </Text>
                  {item.amount ? (
                    <Text className="text-sm font-semibold text-slate-900 mt-0.5">₹ {item.amount}</Text>
                  ) : null}
                  {item.note ? (
                    <Text className="text-xs text-slate-500 mt-0.5">{item.note}</Text>
                  ) : null}
                </View>

                {/* Badge */}
                <View className={`px-2 py-1 rounded-lg mr-2 ${item.paid ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                  <Text className={`text-[11px] font-bold ${item.paid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {item.paid ? 'Paid' : 'Pending'}
                  </Text>
                </View>

                {/* Delete */}
                <TouchableOpacity onPress={() => deletePayment(item.id)} className="p-1">
                  <X size={16} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* ─── Add Payment Modal ─── */}
      <Modal visible={showAddPayment} transparent animationType="slide">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowAddPayment(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-xl font-bold text-slate-900">Add Payment Record</Text>
                <TouchableOpacity onPress={() => setShowAddPayment(false)}>
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <Text className="text-[13px] font-semibold text-slate-600 mb-2">
                Date / Hearing <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-[52px] text-[15px] text-slate-900 mb-4"
                placeholder="e.g. 04 Sep 2026  or  Hearing 3"
                placeholderTextColor="#94a3b8"
                value={payDate}
                onChangeText={setPayDate}
              />

              <Text className="text-[13px] font-semibold text-slate-600 mb-2">Amount (₹) — optional</Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-[52px] text-[15px] text-slate-900 mb-4"
                placeholder="e.g. 5000"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={payAmount}
                onChangeText={setPayAmount}
              />

              <Text className="text-[13px] font-semibold text-slate-600 mb-2">Note — optional</Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-[52px] text-[15px] text-slate-900 mb-6"
                placeholder="e.g. After 2nd hearing"
                placeholderTextColor="#94a3b8"
                value={payNote}
                onChangeText={setPayNote}
              />

              <TouchableOpacity
                className="bg-blue-600 rounded-xl h-14 items-center justify-center elevation-4"
                onPress={handleAddPayment}
              >
                <Text className="text-white text-base font-bold">Save Payment Record</Text>
              </TouchableOpacity>
              <View className="h-6" />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
