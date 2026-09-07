import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Check, Edit3, UploadCloud, Search } from 'lucide-react-native';

export default function StaffWorkspace() {
  const [todos, setTodos] = useState([
    { id: 1, task: 'Email client regarding document signatures', completed: false },
    { id: 2, task: 'Review new case files from senior advocate', completed: true },
    { id: 3, task: 'Prepare briefing for tomorrow\'s hearing', completed: false },
    { id: 4, task: 'Update case notes for Smith v. State', completed: false },
  ]);

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const quickActions = [
    { id: 1, title: 'New Note', icon: Edit3, color: '#3B82F6', bgClass: 'bg-blue-50' },
    { id: 2, title: 'Upload', icon: UploadCloud, color: '#10B981', bgClass: 'bg-emerald-50' },
    { id: 3, title: 'Search', icon: Search, color: '#F59E0B', bgClass: 'bg-amber-50' },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-100" showsVerticalScrollIndicator={false}>
      <View className="p-5 pt-2.5">
        <Text className="text-2xl font-bold text-slate-900">My Workspace</Text>
      </View>

      <View className="flex-row px-4 justify-between mb-6">
        {quickActions.map(action => (
          <TouchableOpacity key={action.id} className="flex-1 bg-white p-4 rounded-2xl mx-1 items-center shadow-sm shadow-black/5 elevation-2">
            <View className={`w-12 h-12 rounded-full justify-center items-center mb-3 ${action.bgClass}`}>
              <action.icon size={24} color={action.color} />
            </View>
            <Text className="text-[13px] font-semibold text-slate-900">{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="px-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-slate-900">Daily Checklist</Text>
          <TouchableOpacity className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-xl">
            <Plus size={16} color="#3B82F6" />
            <Text className="text-blue-500 font-bold ml-1 text-[13px]">Add</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl p-2 shadow-sm shadow-black/5 elevation-2 mb-10">
          {todos.map(todo => (
            <TouchableOpacity 
              key={todo.id} 
              className="flex-row items-center p-3 border-b border-slate-100 last:border-b-0"
              onPress={() => toggleTodo(todo.id)}
            >
              <View className={`w-[22px] h-[22px] rounded-full border-2 justify-center items-center mr-3 ${todo.completed ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                {todo.completed ? <Check size={14} color="#fff" /> : null}
              </View>
              <Text className={`text-sm flex-1 ${todo.completed ? 'color-slate-400 line-through' : 'color-slate-800'}`}>
                {todo.task}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
