import React, { useState, useEffect } from 'react';
import {
  Platform, StyleSheet, ActivityIndicator, TextInput,
  KeyboardAvoidingView, TouchableOpacity, Alert, View,
  Linking, SafeAreaView, ScrollView, Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@/constants/api';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<any[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [customStopQuery, setCustomStopQuery] = useState('');

  const { loadedStops } = useLocalSearchParams();

  useEffect(() => {
    if (loadedStops) {
      try {
        const parsedStops = JSON.parse(loadedStops as string);
        setStops(parsedStops);
      } catch (e) {
        console.error("Failed to parse loaded stops", e);
      }
    }
  }, [loadedStops]);

  const handleSuggestRoute = async () => {
    if (!origin || !destination) return Alert.alert("Missing info", "Enter start and end.");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/suggest-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, date: new Date().toISOString().split('T')[0] }),
      });
      const data = await response.json();
      setStops(data.stops || []);
    } catch (e) {
      Alert.alert("Error", "Server unreachable");
    } finally {
      setLoading(false);
    }
  };

  const addCustomStop = async () => {
    if (!customStopQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: customStopQuery, currentStops: stops }),
      });
      const data = await response.json();
      if (data.newStop) setStops([...stops, data.newStop]);
      setCustomStopQuery('');
    } catch (e) {
      Alert.alert("Error", "AI search failed");
    } finally {
      setLoading(false);
    }
  };

  const executeSave = async (tripName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripName: tripName || `Trip to ${destination}`,
          stops
        }),
      });
      if (response.ok) {
        Alert.alert("Saved!", "Trip saved to your library.");
      } else {
        Alert.alert("Error", "Failed to save trip.");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to reach server");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = () => {
    if (stops.length === 0) return Alert.alert("Error", "No route to save.");
    if (Platform.OS === 'ios') {
      Alert.prompt(
        "Name Your Trip",
        "Enter a name for this journey:",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Save", onPress: (name: string | undefined) => executeSave(name || "") }
        ],
        "plain-text",
        `Trip to ${destination}`
      );
    } else {
      executeSave(`Trip to ${destination}`);
    }
  };

  const handleNavigate = () => {
    if (stops.length === 0) return;
    const waypoints = stops.map(s => `${s.lat},${s.lng}`).join('%7C');
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${waypoints}&travelmode=driving`;
    Linking.openURL(url);
  };

  const deleteStop = (index: number) => {
    setStops(prev => prev.filter((_, i) => i !== index));
  };

  const typeConfig: Record<string, { icon: string; color: string }> = {
    restaurant: { icon: '🍔', color: '#FF6B6B' },
    tourist_attraction: { icon: '🎡', color: '#4ECDC4' },
    gas_station: { icon: '⛽', color: '#FFE66D' },
    hotel: { icon: '🏨', color: '#A8E6CF' },
    default: { icon: '📍', color: '#3B6FE8' },
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>WayFinder</Text>
            <Text style={styles.subtitle}>Plan your perfect road trip</Text>
          </View>

          {/* Input Card */}
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <View style={styles.inputDot} />
              <TextInput
                style={styles.input}
                placeholder="Starting point"
                placeholderTextColor="#666"
                value={origin}
                onChangeText={setOrigin}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.inputRow}>
              <View style={[styles.inputDot, { backgroundColor: '#3B6FE8' }]} />
              <TextInput
                style={styles.input}
                placeholder="Destination"
                placeholderTextColor="#666"
                value={destination}
                onChangeText={setDestination}
              />
            </View>

            <TouchableOpacity
              style={[styles.planBtn, loading && { opacity: 0.6 }]}
              onPress={handleSuggestRoute}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="map" size={18} color="#fff" />
                  <Text style={styles.planBtnText}>Plan Trip</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Stops */}
          {stops.length > 0 && (
            <View style={styles.stopsSection}>
              <View style={styles.stopsHeader}>
                <Text style={styles.stopsTitle}>Your Route</Text>
                <TouchableOpacity onPress={() => setStops([])}>
                  <Text style={styles.clearText}>Clear all</Text>
                </TouchableOpacity>
              </View>

              {/* Add custom stop */}
              <View style={styles.addRow}>
                <TextInput
                  style={styles.addInput}
                  placeholder="Add a stop... (e.g. Chipotle near Wichita)"
                  placeholderTextColor="#555"
                  value={customStopQuery}
                  onChangeText={setCustomStopQuery}
                />
                <TouchableOpacity style={styles.addBtn} onPress={addCustomStop}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Ionicons name="add" size={22} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Stop cards */}
              {stops.map((stop, i) => {
                const config = typeConfig[stop.type] || typeConfig.default;
                return (
                  <View key={i} style={styles.stopCard}>
                    <View style={[styles.stopIcon, { backgroundColor: config.color + '22' }]}>
                      <Text style={styles.stopEmoji}>{config.icon}</Text>
                    </View>
                    <View style={styles.stopInfo}>
                      <Text style={styles.stopName}>{stop.name}</Text>
                      <Text style={styles.stopDesc}>{stop.description || stop.address}</Text>
                      {stop.rating && (
                        <Text style={styles.stopRating}>⭐ {stop.rating}</Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => deleteStop(i)} style={styles.deleteBtn}>
                      <Ionicons name="close" size={18} color="#666" />
                    </TouchableOpacity>
                  </View>
                );
              })}

              {/* Action buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTrip}>
                  <Ionicons name="bookmark-outline" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.goBtn} onPress={handleNavigate}>
                  <Ionicons name="navigate" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>Start Trip</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginTop: 16, marginBottom: 24 },
  title: { fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#666', marginTop: 4 },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  inputDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#444' },
  input: { flex: 1, fontSize: 16, color: '#fff', paddingVertical: 10 },
  divider: { height: 1, backgroundColor: '#2C2C2E', marginLeft: 22, marginVertical: 4 },
  planBtn: {
    backgroundColor: '#3B6FE8',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  planBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  stopsSection: { gap: 10 },
  stopsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  stopsTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  clearText: { color: '#FF3B30', fontSize: 14, fontWeight: '500' },
  addRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  addInput: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#3B6FE8',
    borderRadius: 12,
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stopIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopEmoji: { fontSize: 20 },
  stopInfo: { flex: 1 },
  stopName: { fontSize: 15, fontWeight: '600', color: '#fff', marginBottom: 2 },
  stopDesc: { fontSize: 12, color: '#888' },
  stopRating: { fontSize: 12, color: '#FFE66D', marginTop: 2 },
  deleteBtn: { padding: 4 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  saveBtn: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  goBtn: {
    flex: 2,
    backgroundColor: '#3B6FE8',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});