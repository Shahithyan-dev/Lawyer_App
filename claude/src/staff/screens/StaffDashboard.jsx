import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Briefcase, Gavel, CheckSquare, Clock, AlertCircle } from 'lucide-react-native';

export default function StaffDashboard() {
  const metrics = [
    { id: 1, title: 'Active Cases', count: 12, icon: Briefcase, color: '#3B82F6', bgClass: 'bg-blue-50' },
    { id: 2, title: 'Hearings', count: 3, icon: Gavel, color: '#F59E0B', bgClass: 'bg-amber-50' },
    { id: 3, title: 'Tasks', count: 8, icon: CheckSquare, color: '#10B981', bgClass: 'bg-emerald-50' },
  ];

  const priorityTasks = [
    { id: 1, title: 'Draft Motion for Summary Judgment', case: 'Smith v. State', deadline: 'Today, 5:00 PM', urgency: 'High' },
    { id: 2, title: 'Review Witness Depositions', case: 'Doe LLC Dispute', deadline: 'Tomorrow, 10:00 AM', urgency: 'Medium' },
    { id: 3, title: 'File Subpoena Request', case: 'Johnson Real Estate', deadline: 'Oct 15, 2:00 PM', urgency: 'High' },
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

  return (
    <ScrollView className="flex-1 bg-slate-100" showsVerticalScrollIndicator={false}>
      <View className="px-6 py-6 bg-blue-900 rounded-b-[28px] pb-9">
        <Text className="text-sm text-blue-300 font-medium">{greeting}</Text>
        <Text className="text-[26px] font-extrabold text-white mt-1 tracking-tight">Alex Junior</Text>
        <Text className="text-[13px] text-blue-200 mt-2">{displayDate}</Text>
      </View>

      <View className="flex-row px-4 mt-[-20px] justify-between">
        {metrics.map(item => (
          <View key={item.id} className="flex-1 bg-white p-4 rounded-2xl mx-1 items-center shadow-sm shadow-blue-900/10 elevation-4 border border-slate-100">
            <View className={`w-10 h-10 rounded-xl justify-center items-center mb-3 ${item.bgClass}`}>
              <item.icon size={22} color={item.color} />
            </View>
            <Text className="text-[22px] font-bold text-slate-900">{item.count}</Text>
            <Text className="text-[11px] text-slate-500 mt-1 text-center">{item.title}</Text>
          </View>
        ))}
      </View>

      <View className="p-5 mt-3">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-slate-900">Priority Tasks</Text>
          <TouchableOpacity>
            <Text className="text-sm text-blue-600 font-semibold">See All</Text>
          </TouchableOpacity>
        </View>

        {priorityTasks.map(task => (
          <View key={task.id} className="bg-white p-4 rounded-2xl mb-3 border-l-4 border-l-blue-600 shadow-sm shadow-black/5 elevation-2 border-y border-r border-slate-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-[15px] font-semibold text-slate-800 flex-1 mr-2">{task.title}</Text>
              {task.urgency === 'High' && <AlertCircle size={16} color="#EF4444" />}
            </View>
            <Text className="text-[13px] text-blue-600 mt-1.5 font-medium">{task.case}</Text>
            <View className="flex-row items-center mt-3">
              <Clock size={14} color="#64748b" />
              <Text className="text-xs text-slate-500 ml-1.5">{task.deadline}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
