import React, { useState } from 'react';
import { Image } from 'expo-image';
import { 
  Platform, StyleSheet, Button, ActivityIndicator, TextInput, 
  KeyboardAvoidingView, TouchableOpacity, Keyboard, Alert, View 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the delete icon

import { API_URL } from '@/constants/api';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<any[]>([]); // Dynamic stops array
  const [origin, setOrigin] = useState('Dallas, TX');
  const [destination, setDestination] = useState('Austin, TX');
  const [customStopQuery, setCustomStopQuery] = useState('');

  const handleSuggestRoute = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/suggest-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStops(data.stops || []); // Initialize dynamic state
      } else {
        alert(data.error || "Server Error");
      }
    } catch (error) {
      alert("Connection failed. Check your local IP.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Remove a stop from the local list
  const deleteStop = (index: number) => {
    const updatedStops = stops.filter((_, i) => i !== index);
    setStops(updatedStops);
  };

  // CUSTOM ADD: Send custom query to MCP bridge
  const addCustomStop = async () => {
    if (!customStopQuery) return;
    setLoading(true);
    try {
      // Logic: Send the query to your chat/mcp endpoint to resolve the location
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Add this to my route: ${customStopQuery}`,
          currentStops: stops 
        }),
      });
      
      const data = await response.json();
      if (data.newStop) {
        setStops([...stops, data.newStop]);
        setCustomStopQuery('');
      }
    } catch (e) {
      alert("Could not process custom stop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
      >
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>WayFinder</ThemedText>

          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">Start</ThemedText>
            <TextInput style={styles.input} value={origin} onChangeText={setOrigin} />
            <ThemedText type="defaultSemiBold">End</ThemedText>
            <TextInput style={styles.input} value={destination} onChangeText={setDestination} />
            
            {loading ? <ActivityIndicator size="small" color="#1D3D47" /> : (
              <Button title="Plan My Trip" onPress={handleSuggestRoute} />
            )}
          </ThemedView>

          {stops.length > 0 && (
            <ThemedView style={styles.results}>
              <ThemedText type="subtitle">Route Customization</ThemedText>
              
              {/* CUSTOM ADD BOX */}
              <View style={styles.addStopRow}>
                <TextInput 
                  style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                  placeholder="Add e.g. 'Buc-ee's on the way'"
                  value={customStopQuery}
                  onChangeText={setCustomStopQuery}
                />
                <TouchableOpacity style={styles.addButton} onPress={addCustomStop}>
                  <Ionicons name="add-circle" size={32} color="#1D3D47" />
                </TouchableOpacity>
              </View>

              {stops.map((stop, i) => (
                <ThemedView key={i} style={styles.stopCard}>
                  <View style={styles.stopHeader}>
                    <ThemedText style={styles.stopTitle}>{stop.name}</ThemedText>
                    <TouchableOpacity onPress={() => deleteStop(i)}>
                      <Ionicons name="trash-outline" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                  <ThemedText style={styles.desc}>{stop.description}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { marginBottom: 15 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 15, gap: 8 },
  input: { height: 45, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 5, color: '#000' },
  results: { marginTop: 20 },
  addStopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  addButton: { padding: 5 },
  stopCard: { backgroundColor: '#e3f2fd', padding: 15, borderRadius: 12, marginVertical: 6 },
  stopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stopTitle: { fontSize: 17, fontWeight: '700', color: '#002D62' },
  desc: { fontSize: 14, color: '#333', marginTop: 4 },
  reactLogo: { height: 178, width: 290, position: 'absolute', bottom: 0, left: 0 },
});