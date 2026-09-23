import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Clock, MapPin, ChevronRight, Plus } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

// Helper to get local date in YYYY-MM-DD
const getLocalDateString = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const [casesRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/cases`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/tasks`).catch(() => ({ data: [] }))
      ]);

      const fetchedEvents = {};

      // Map Cases (Hearings)
      casesRes.data.forEach(c => {
        if (c.nextHearingDate) {
          const dateKey = getLocalDateString(new Date(c.nextHearingDate));
          if (!fetchedEvents[dateKey]) fetchedEvents[dateKey] = [];
          
          fetchedEvents[dateKey].push({
            time: '09:00 AM', // Default time if none provided
            title: c.title,
            location: c.court,
            type: 'Hearing',
            raw: c
          });
        }
      });

      // Map Tasks (Deadlines / Meetings)
      tasksRes.data.forEach(t => {
        if (t.dueDate) {
          const dateKey = getLocalDateString(new Date(t.dueDate));
          if (!fetchedEvents[dateKey]) fetchedEvents[dateKey] = [];
          
          fetchedEvents[dateKey].push({
            time: '10:00 AM', // Default time
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

  // Create marked dates object for the calendar
  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#2563eb' };
    return acc;
  }, {});

  // Add the currently selected date
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: '#2563eb'
  };

  const selectedEvents = events[selectedDate] || [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-5 mb-5">
          <View>
            <Text className="text-[28px] font-extrabold text-slate-900 tracking-tight">Calendar</Text>
            <Text className="text-sm text-slate-500 mt-1">Track hearings, deadlines, and tasks.</Text>
          </View>
          <TouchableOpacity 
            className="w-11 h-11 bg-blue-600 rounded-xl items-center justify-center"
            onPress={() => navigation.navigate('AddEvent')}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Calendar Widget */}
        <View className="bg-white rounded-[20px] overflow-hidden shadow-md shadow-blue-900/10 elevation-4 mb-6 border border-slate-200">
          <Calendar
            current={selectedDate}
            onDayPress={day => {
              setSelectedDate(day.dateString);
            }}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#94a3b8',
              selectedDayBackgroundColor: '#2563eb',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#2563eb',
              todayBackgroundColor: '#eff6ff',
              dayTextColor: '#0f172a',
              textDisabledColor: '#cbd5e1',
              dotColor: '#2563eb',
              selectedDotColor: '#ffffff',
              arrowColor: '#2563eb',
              monthTextColor: '#0f172a',
              textMonthFontWeight: 'bold',
              textDayFontSize: 15,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 13
            }}
          />
        </View>

        {/* Events for Selected Date */}
        <View className="flex-1">
          <Text className="text-base font-bold text-slate-900 mb-4">
            Schedule for {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
          </Text>
          
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-5">
              {selectedEvents.length === 0 ? (
                <View className="p-8 items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed">
                  <Text className="text-slate-400 text-sm">No events scheduled for this day.</Text>
                </View>
              ) : (
                selectedEvents.map((event, index) => (
                  <TouchableOpacity 
                    key={index} 
                    className="flex-row items-center bg-white rounded-2xl p-4 mb-3 shadow-sm elevation-2 border border-slate-100"
                    onPress={() => {
                      if (event.type === 'Hearing') {
                        navigation.navigate('CaseDetails', { caseData: event.raw });
                      }
                    }}
                  >
                    <View className="items-center w-[60px] mr-4 border-r border-slate-200 pr-4">
                      <Text className="text-xs font-bold text-slate-500">{event.time}</Text>
                      <View className={`w-2 h-2 rounded-full mt-2 ${
                        event.type === 'Hearing' ? 'bg-amber-500' :
                        event.type === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'
                      }`} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[15px] font-bold text-slate-900 mb-2">{event.title}</Text>
                      <View className="flex-row items-center gap-2 flex-wrap">
                        <View className="flex-row items-center bg-slate-100 px-2 py-1 rounded-md">
                          <MapPin size={12} color="#64748b" style={{ marginRight: 4 }} />
                          <Text className="text-[11px] color-slate-500 font-medium">{event.location}</Text>
                        </View>
                        <View className={`px-2 py-1 rounded-md ${
                          event.type === 'Hearing' ? 'bg-amber-100' : 
                          event.type === 'Completed' ? 'bg-emerald-100' : 'bg-indigo-100'
                        }`}>
                          <Text className={`text-[11px] font-bold ${
                            event.type === 'Hearing' ? 'text-amber-600' : 
                            event.type === 'Completed' ? 'text-emerald-600' : 'text-indigo-600'
                          }`}>{event.type}</Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#cbd5e1" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
