import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, FlatList, ActivityIndicator, RefreshControl, 
  TouchableOpacity, Alert, View 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { API_URL } from '@/constants/api';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SavedScreen() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/api/trips`);
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- NEW: Added onRefresh function ---
  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = (id: string, name: string) => {
    Alert.alert("Delete Trip", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/api/trips/${id}`, { 
              method: 'DELETE' 
            });
            if (response.ok) {
              fetchTrips(); 
            }
          } catch (e) {
            Alert.alert("Error", "Could not delete trip");
          }
        } 
      }
    ]);
  };

  const handleSelectTrip = (trip: any) => {
    // Navigates back to Home and passes the stops as a string parameter
    router.push({
      pathname: '/',
      params: { loadedStops: JSON.stringify(trip.stops) }
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Saved Trips</ThemedText>
      
      <FlatList
        data={trips}
        keyExtractor={(item: any) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <ThemedText style={styles.empty}>No saved trips yet.</ThemedText>
        }
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity style={styles.tripCard} onPress={() => handleSelectTrip(item)}>
            <View style={styles.tripInfo}>
              <Ionicons name="map" size={24} color="#007AFF" />
              <View>
                <ThemedText type="defaultSemiBold">{item.tripName}</ThemedText>
                <ThemedText style={styles.stopCount}>{item.stops.length} stops</ThemedText>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => handleDelete(item.id, item.tripName)}
              style={styles.deleteBtn}
            >
              <Ionicons name="trash-outline" size={22} color="#ff4444" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: { marginBottom: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 50, opacity: 0.6 },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tripInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  stopCount: { fontSize: 12, opacity: 0.7 },
  deleteBtn: { padding: 5 }
});