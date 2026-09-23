import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Clock, MapPin } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

const getLocalDateString = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

export default function StaffHearings() {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const [profileRes, casesRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/auth/me`),
        axios.get(`${API_URL}/cases`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/tasks`).catch(() => ({ data: [] }))
      ]);

      const user = profileRes.data;
      const fetchedEvents = {};

      const myCases = casesRes.data.filter(c => 
        c.assignedTo && c.assignedTo.some(id => id === user._id || id._id === user._id)
      );

      const myTasks = tasksRes.data.filter(t => 
        t.assignedTo && (t.assignedTo === user._id || t.assignedTo._id === user._id)
      );

      myCases.forEach(c => {
        if (c.nextHearingDate) {
          const dateKey = getLocalDateString(new Date(c.nextHearingDate));
          if (!fetchedEvents[dateKey]) fetchedEvents[dateKey] = [];
          
          fetchedEvents[dateKey].push({
            time: '09:00 AM', 
            title: c.title,
            location: c.court || 'Court',
            type: 'Hearing',
            raw: c
          });
        }
      });

      myTasks.forEach(t => {
        if (t.dueDate) {
          const dateKey = getLocalDateString(new Date(t.dueDate));
          if (!fetchedEvents[dateKey]) fetchedEvents[dateKey] = [];
          
          fetchedEvents[dateKey].push({
            time: '10:00 AM',
            title: t.title,
            location: t.priority || 'Normal Priority',
            type: t.status === 'Completed' ? 'Completed' : 'Task',
            raw: t
          });
        }
      });

      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCalendarData();
    }, [])
  );

  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#2563eb' };
    return acc;
  }, {});

  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: '#2563eb'
  };

  const selectedEvents = events[selectedDate] || [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5">
        <View className="mt-5 mb-5">
          <Text className="text-[28px] font-extrabold text-slate-900 tracking-tight">Calendar</Text>
          <Text className="text-sm text-slate-500 mt-1">Your assigned hearings and tasks.</Text>
        </View>

        <View className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-black/5 elevation-2 mb-6 border border-slate-100">
          <Calendar
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#64748b',
              selectedDayBackgroundColor: '#2563eb',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#2563eb',
              dayTextColor: '#0f172a',
              textDisabledColor: '#cbd5e1',
              dotColor: '#2563eb',
              selectedDotColor: '#ffffff',
              arrowColor: '#0f172a',
              monthTextColor: '#0f172a',
              textMonthFontWeight: 'bold',
              textDayFontSize: 15,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13
            }}
          />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-slate-900">
            {selectedDate === getLocalDateString() ? "Today's Schedule" : new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
        ) : selectedEvents.length === 0 ? (
          <View className="flex-1 items-center justify-center pt-10">
            <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
              <Clock size={24} color="#94a3b8" />
            </View>
            <Text className="text-base font-semibold text-slate-700">No events scheduled</Text>
            <Text className="text-sm text-slate-500 mt-1">Enjoy your free time!</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {selectedEvents.map((event, index) => (
              <View key={index} className="flex-row mb-4">
                <View className="w-16 items-center justify-center">
                  <Text className="text-sm font-bold text-slate-900">{event.time.split(' ')[0]}</Text>
                  <Text className="text-xs font-semibold text-slate-500">{event.time.split(' ')[1]}</Text>
                </View>
                
                <View className="w-4 items-center">
                  <View className="w-3 h-3 rounded-full bg-blue-500 mt-2 z-10 border-2 border-slate-50" />
                  {index !== selectedEvents.length - 1 && <View className="w-0.5 flex-1 bg-slate-200 absolute top-3 bottom-[-16px]" />}
                </View>

                <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm shadow-black/5 elevation-2 border border-slate-100 ml-2">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className={`px-2.5 py-1 rounded-lg ${event.type === 'Hearing' ? 'bg-amber-100' : event.type === 'Completed' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                      <Text className={`text-[10px] font-bold ${event.type === 'Hearing' ? 'text-amber-700' : event.type === 'Completed' ? 'text-emerald-700' : 'text-blue-700'}`}>{event.type.toUpperCase()}</Text>
                    </View>
                  </View>
                  
                  <Text className="text-base font-bold text-slate-900 mb-3">{event.title}</Text>
                  
                  <View className="flex-row items-center">
                    <MapPin size={14} color="#64748b" />
                    <Text className="text-xs text-slate-600 ml-1.5 font-medium">{event.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
