import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, CheckSquare, Clock } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function TasksScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(route.params?.initialFilter || 'All'); // All, Pending, Completed

  useEffect(() => {
    fetchTasks();
    if (route.params?.initialFilter) setFilter(route.params.initialFilter);
  }, [route.params]);

  const fetchTasks = async () => {
    try {
      const [profileRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/auth/me`),
        axios.get(`${API_URL}/tasks`)
      ]);
      const user = profileRes.data.data || profileRes.data;
      const allTasks = tasksRes.data.data || tasksRes.data;
      
      const safeIdStr = (idObj) => {
        if (!idObj) return null;
        return (idObj._id ? idObj._id.toString() : idObj.toString());
      };
      const myId = safeIdStr(user);

      const myTasks = allTasks.filter(t => t.assignedTo && safeIdStr(t.assignedTo) === myId);
      
      setTasks(myTasks);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Pending') return t.status !== 'Completed';
    if (filter === 'Completed') return t.status === 'Completed';
    return true;
  });

  const renderTask = ({ item }) => {
    const isHighPriority = item.priority === 'HIGH PRIORITY';
    const isCompleted = item.status === 'Completed';
    const isOverdue = new Date(item.dueDate) < new Date() && !isCompleted;

    return (
      <View className={`bg-white rounded-2xl p-5 mb-4 shadow-sm elevation-2 shadow-black/5 border-t-4 ${isHighPriority ? 'border-t-red-500' : 'border-t-slate-200'}`}>
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-1.5">
            <View className={`w-2 h-2 rounded-full ${isHighPriority ? 'bg-red-500' : 'bg-slate-500'}`} />
            <Text className={`text-[11px] font-bold ${isHighPriority ? 'text-red-500' : 'text-slate-500'}`}>
              {item.priority}
            </Text>
          </View>
          <View className={`px-2 py-1 rounded border ${item.status === 'In Progress' ? 'bg-blue-50 border-transparent' : 'bg-white border-slate-200'}`}>
            <Text className={`text-[11px] font-bold ${item.status === 'In Progress' ? 'text-blue-500' : 'text-slate-500'}`}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text className={`text-lg font-bold mb-2 ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>{item.title}</Text>
        {item.description ? (
          <Text className="text-sm text-slate-500 leading-5 mb-4" numberOfLines={2}>{item.description}</Text>
        ) : null}

        <View className="bg-slate-50 p-3 rounded-xl gap-2 mb-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-slate-500">Case:</Text>
            <Text className="text-[13px] font-bold text-blue-600">{item.caseReference ? item.caseReference.caseId : 'N/A'}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-slate-500">Assigned:</Text>
            <Text className="text-[13px] font-bold text-blue-600">{item.assignedTo ? item.assignedTo.name : 'Unassigned'}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-slate-500">Due:</Text>
            <View className="flex-row items-center gap-1">
              <Clock size={12} color={isOverdue ? '#ef4444' : '#0f172a'} />
              <Text className={`text-[13px] font-bold ${isOverdue ? 'text-red-500' : 'text-slate-900'}`}>
                {new Date(item.dueDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity className="bg-white border border-slate-200 rounded-lg py-3 items-center">
          <Text className="text-sm font-bold text-slate-900">
            {isCompleted ? 'View Details' : 'Update Status'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="flex-row justify-between items-center px-5 pt-5 pb-4">
        <View>
          <Text className="text-[28px] font-extrabold text-slate-900 tracking-tight">Tasks</Text>
          <Text className="text-sm text-slate-500 mt-1">Manage your assigned tasks.</Text>
        </View>
      </View>

      <View className="flex-row px-5 mb-4 gap-2">
        {['All', 'Pending', 'Completed'].map(f => (
          <TouchableOpacity
            key={f}
            className={`px-4 py-2 rounded-full border ${filter === f ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
            onPress={() => setFilter(f)}
          >
            <Text className={`text-[13px] font-semibold ${filter === f ? 'text-white' : 'text-slate-500'}`}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-3 text-slate-500">Loading cases from MongoDB...</Text>
        </View>
      ) : error ? (
        <View className="m-5 bg-red-50 p-4 rounded-lg border border-red-200">
          <Text className="text-red-500">Failed to load cases: {error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item._id}
          renderItem={renderTask}
          contentContainerClassName="px-5 pb-10"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="p-8 items-center border border-slate-200 rounded-xl border-dashed">
              <Text className="text-slate-500">No assigned cases found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
