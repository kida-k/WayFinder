import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/constants/api';

const CATEGORIES = [
  { label: 'Food', icon: '🍔', query: 'restaurant' },
  { label: 'Coffee', icon: '☕', query: 'coffee' },
  { label: 'Hotels', icon: '🏨', query: 'hotel' },
  { label: 'Parks', icon: '🌲', query: 'park' },
  { label: 'Gas', icon: '⛽', query: 'gas station' },
  { label: 'Attractions', icon: '🎡', query: 'tourist attraction' },
];

export default function ExploreScreen() {
  const [city, setCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('restaurant');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) return Alert.alert('Enter a city', 'Type a city to search near');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/explore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, query: selectedCategory }),
      });
      const data = await response.json();
      if (data.error) return Alert.alert('Error', data.error);
      setResults(data.results || []);
    } catch (e) {
      Alert.alert('Error', 'Could not reach server');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (place: any) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover places anywhere</Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="City or location..."
            placeholderTextColor="#555"
            value={city}
            onChangeText={setCity}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pills}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.query}
              style={[styles.pill, selectedCategory === cat.query && styles.pillSelected]}
              onPress={() => setSelectedCategory(cat.query)}>
              <Text style={styles.pillText}>{cat.icon} {cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading && <ActivityIndicator color="#3B6FE8" style={{ marginTop: 40 }} />}

        {!loading && results.length === 0 && city.length > 0 && (
          <Text style={styles.empty}>No results found. Try a different search.</Text>
        )}

        {results.map((place, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.placeName}>{place.name}</Text>
              {place.rating && (
                <Text style={styles.rating}>⭐ {place.rating}</Text>
              )}
            </View>
            <Text style={styles.address}>{place.address}</Text>
            <TouchableOpacity style={styles.mapsBtn} onPress={() => openInMaps(place)}>
              <Ionicons name="navigate-outline" size={16} color="#3B6FE8" />
              <Text style={styles.mapsBtnText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  scroll: { padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 24, marginTop: 4 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: '#3B6FE8',
    borderRadius: 12,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pills: { marginBottom: 20 },
  pill: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillSelected: { borderColor: '#3B6FE8' },
  pillText: { color: '#fff', fontSize: 14 },
  empty: { color: '#888', textAlign: 'center', marginTop: 40 },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  placeName: { fontSize: 17, fontWeight: '600', color: '#fff', flex: 1 },
  rating: { color: '#FFE66D', fontSize: 14 },
  address: { color: '#888', fontSize: 13, marginBottom: 12 },
  mapsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mapsBtnText: { color: '#3B6FE8', fontSize: 14, fontWeight: '600' },
});