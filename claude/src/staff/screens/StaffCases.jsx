import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Briefcase, ChevronRight, Clock, Download, FileText } from 'lucide-react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { API_URL } from '../../config/api';

export default function StaffCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setCases(response.data);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      Alert.alert('Error', 'Could not load cases from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDownload = async (documentUrl, documentName) => {
    try {
      const fullUrl = `${API_URL.replace('/api', '')}${documentUrl}`;
      const safeFileName = (documentName || 'case_document.pdf').replace(/[^a-zA-Z0-9.\-_]/g, '_');
      
      const downloadResumable = FileSystem.createDownloadResumable(
        fullUrl,
        FileSystem.documentDirectory + safeFileName
      );

      const { uri, status } = await downloadResumable.downloadAsync();
      
      if (status !== 200) {
        throw new Error(`Server returned status code: ${status}`);
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Success', `File downloaded to: ${uri}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Failed', error.message || 'An unknown error occurred.');
    }
  };

  const getStatusColorClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'IN PROGRESS': return { text: 'text-blue-500', bg: 'bg-blue-50' };
      case 'TO DO': return { text: 'text-amber-500', bg: 'bg-amber-50' };
      case 'COMPLETED': return { text: 'text-emerald-500', bg: 'bg-emerald-50' };
      default: return { text: 'text-slate-500', bg: 'bg-slate-50' };
    }
  };

  const renderCaseCard = ({ item }) => {
    const formattedDate = new Date(item.dueDate).toLocaleDateString();
    const statusColors = getStatusColorClass(item.status);
    
    return (
      <TouchableOpacity className="bg-white rounded-2xl p-4 mb-4 shadow-sm shadow-black/5 elevation-2 border border-slate-100">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <Briefcase size={18} color="#0F172A" />
            <Text className="text-base font-bold text-slate-900 ml-2" numberOfLines={1}>{item.title}</Text>
          </View>
          <ChevronRight size={20} color="#cbd5e1" />
        </View>
        
        {item.caseReference && (
          <Text className="text-sm text-slate-500 mt-2 ml-7">Case Ref: {item.caseReference.title}</Text>
        )}
        
        <View className="flex-row mt-3 ml-7">
          <View className={`px-2.5 py-1 rounded-xl mr-2 ${statusColors.bg}`}>
            <Text className={`text-xs font-semibold ${statusColors.text}`}>{item.status}</Text>
          </View>
          <View className="px-2.5 py-1 rounded-xl bg-slate-100">
            <Text className="text-xs font-medium text-slate-500">{item.priority}</Text>
          </View>
        </View>

        {item.documentUrl && (
          <TouchableOpacity 
            className="flex-row items-center bg-blue-50 p-3 rounded-xl mt-4"
            onPress={() => handleDownload(item.documentUrl, item.documentName)}
          >
            <FileText size={16} color="#3B82F6" />
            <Text className="text-blue-900 ml-2 text-[13px] font-medium flex-1">{item.documentName || 'View Document'}</Text>
            <Download size={16} color="#3B82F6" className="ml-auto" />
          </TouchableOpacity>
        )}
        
        <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-slate-100">
          <View className="flex-row items-center">
            <Clock size={14} color="#64748b" />
            <Text className="text-[13px] text-slate-500 ml-1.5 font-medium">Due: {formattedDate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-100">
      <View className="p-5 pt-2.5">
        <Text className="text-2xl font-bold text-slate-900">Assigned Cases</Text>
        <Text className="text-sm text-slate-500 mt-1">You have {cases.length} active cases</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" className="mt-10" />
      ) : (
        <FlatList
          data={cases}
          keyExtractor={item => item._id}
          renderItem={renderCaseCard}
          contentContainerClassName="px-5 pb-10"
          showsVerticalScrollIndicator={false}
          onRefresh={fetchCases}
          refreshing={loading}
        />
      )}
    </View>
  );
}
