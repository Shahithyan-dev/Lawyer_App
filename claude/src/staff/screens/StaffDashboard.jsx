import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Briefcase, Gavel, CheckSquare, Clock, AlertCircle } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function StaffDashboard() {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [metrics, setMetrics] = useState({
    activeCases: 0,
    hearings: 0,
    tasks: 0,
  });
  const [priorityTasks, setPriorityTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, casesRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/auth/me`),
        axios.get(`${API_URL}/cases`),
        axios.get(`${API_URL}/tasks`)
      ]);

      const user = profileRes.data;
      setUserProfile(user);

      // Robust ID comparison function
      const safeIdStr = (idObj) => {
        if (!idObj) return null;
        return (idObj._id ? idObj._id.toString() : idObj.toString());
      };
      
      const myId = safeIdStr(user);

      // Filter tasks assigned to this user
      const myTasks = tasksRes.data.filter(t => 
        t.assignedTo && safeIdStr(t.assignedTo) === myId
      );
      
      const caseIdsFromTasks = myTasks.map(t => safeIdStr(t.relatedCase)).filter(Boolean);

      // Filter cases assigned to this user (directly or via a task)
      const myCases = casesRes.data.filter(c => {
        const isDirectlyAssigned = c.assignedTo && c.assignedTo.some(id => safeIdStr(id) === myId);
        const hasTaskInCase = caseIdsFromTasks.includes(safeIdStr(c));
        return isDirectlyAssigned || hasTaskInCase;
      });

      setMetrics({
        activeCases: myCases.length,
        hearings: myCases.filter(c => c.nextHearingDate).length,
        tasks: myTasks.filter(t => t.status !== 'Completed').length,
      });

      // Get up to 3 pending tasks
      const recentTasks = myTasks
        .filter(t => t.status !== 'Completed')
        .slice(0, 3)
        .map(t => {
          const relatedCaseId = t.relatedCase?._id || t.relatedCase;
          const caseData = casesRes.data.find(c => {
            const cid = c._id.toString();
            const rid = relatedCaseId ? relatedCaseId.toString() : null;
            return cid === rid;
          });
          return {
            id: t._id,
            title: t.title,
            case: caseData ? caseData.title : 'General Task',
            deadline: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No deadline',
            urgency: t.priority || 'Medium',
            caseData: caseData || null
          };
        });

      setPriorityTasks(recentTasks);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    { id: 1, title: 'Active Cases', count: metrics.activeCases, icon: Briefcase, color: '#3B82F6', bgClass: 'bg-blue-50', route: 'Cases' },
    { id: 2, title: 'Hearings', count: metrics.hearings, icon: Gavel, color: '#F59E0B', bgClass: 'bg-amber-50', route: 'Hearings' },
    { id: 3, title: 'Tasks', count: metrics.tasks, icon: CheckSquare, color: '#10B981', bgClass: 'bg-emerald-50', route: 'Tasks' },
  ];

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  
  let greeting = 'Good Morning,';
  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good Afternoon,';
  } else if (currentHour >= 17) {
    greeting = 'Good Evening,';
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const displayDate = `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  if (loading && !userProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-100">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-100" showsVerticalScrollIndicator={false}>
      <View className="px-6 py-6 bg-blue-900 rounded-b-[28px] pb-9">
        <Text className="text-sm text-blue-300 font-medium">{greeting}</Text>
        <Text className="text-[26px] font-extrabold text-white mt-1 tracking-tight">{userProfile?.name || 'Staff Member'}</Text>
        <Text className="text-[13px] text-blue-200 mt-2">{displayDate}</Text>
      </View>

      <View className="flex-row px-4 mt-[-20px] justify-between">
        {metricCards.map(item => (
          <TouchableOpacity 
            key={item.id} 
            className="flex-1 bg-white p-4 rounded-2xl mx-1 items-center shadow-sm shadow-blue-900/10 elevation-4 border border-slate-100"
            onPress={() => item.route && navigation.navigate(item.route)}
          >
            <View className={`w-10 h-10 rounded-xl justify-center items-center mb-3 ${item.bgClass}`}>
              <item.icon size={22} color={item.color} />
            </View>
            <Text className="text-[22px] font-bold text-slate-900">{item.count}</Text>
            <Text className="text-[11px] text-slate-500 mt-1 text-center">{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="p-5 mt-3">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-slate-900">Priority Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Hearings')}>
            <Text className="text-sm text-blue-600 font-semibold">See All</Text>
          </TouchableOpacity>
        </View>

        {priorityTasks.length === 0 ? (
          <View className="bg-white p-6 rounded-2xl items-center justify-center border border-slate-100">
            <Text className="text-slate-400">No priority tasks assigned.</Text>
          </View>
        ) : (
          priorityTasks.map(task => (
            <TouchableOpacity 
              key={task.id} 
              className="bg-white p-4 rounded-2xl mb-3 border-l-4 border-l-blue-600 shadow-sm shadow-black/5 elevation-2 border-y border-r border-slate-100"
              onPress={() => {
                if (task.caseData) {
                  navigation.navigate('CaseDetails', { caseData: task.caseData });
                }
              }}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-[15px] font-semibold text-slate-800 flex-1 mr-2">{task.case}</Text>
                {(task.urgency === 'High' || task.urgency === 'Urgent') && <AlertCircle size={16} color="#EF4444" />}
              </View>
              <Text className="text-[13px] text-blue-600 mt-1.5 font-medium">Task: {task.title}</Text>
              <View className="flex-row items-center mt-3">
                <Clock size={14} color="#64748b" />
                <Text className="text-xs text-slate-500 ml-1.5">{task.deadline}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
