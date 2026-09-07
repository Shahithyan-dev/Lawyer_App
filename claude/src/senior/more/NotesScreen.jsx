import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { FileText, Calendar } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function NotesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-slate-500">Loading notes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="p-5">
        <View className="mb-6">
          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Notes</Text>
          <Text className="text-sm text-slate-500">Your personal and case notes.</Text>
        </View>

        {error && (
          <View className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
            <Text className="text-red-500">Error: {error}</Text>
          </View>
        )}

        {notes.length === 0 && !error ? (
          <View className="p-8 items-center border border-slate-200 rounded-2xl border-dashed">
            <Text className="text-slate-500">No notes created yet.</Text>
          </View>
        ) : (
          notes.map((note) => (
            <View key={note._id} className="bg-white rounded-2xl p-4 mb-4 flex-row items-start shadow-sm shadow-black/5 elevation-2 border border-slate-100">
              <View className="bg-blue-50 p-3 rounded-xl mr-4">
                <FileText size={20} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-slate-900 mb-1" numberOfLines={1}>{note.title}</Text>
                <Text className="text-sm text-slate-500 mb-2 leading-5" numberOfLines={2}>{note.content}</Text>
                <View className="flex-row items-center">
                  <Calendar size={12} color="#94a3b8" />
                  <Text className="text-xs text-slate-400 ml-1">{new Date(note.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
