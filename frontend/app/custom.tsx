import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Fuel, 
  Utensils, 
  Camera, 
  Pizza, 
  Coffee, 
  MapPin, 
  Check, 
  X 
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeOutScale, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GlassView } from '@/components/ui/GlassView';
import { useWayfinder, Stop } from '@/context/WayfinderContext';

const INITIAL_STOPS: Stop[] = [
  { id: '1', type: 'gas', name: 'Shell Station', address: '1450 Main St', distance: '45 mi' },
  { id: '2', type: 'coffee', name: 'Starbucks', address: 'Highway 1 Rest Stop', distance: '80 mi' },
  { id: '3', type: 'tourist', name: 'Golden Gate Overlook', address: 'Merchant Rd', distance: '110 mi' },
  { id: '4', type: 'fastfood', name: 'In-N-Out Burger', address: '2040 Redwood Hwy', distance: '150 mi' },
  { id: '5', type: 'slowfood', name: 'Rustic Tavern', address: '12 Valley Dr', distance: '210 mi' },
];

const ICONS = {
  gas: Fuel,
  fastfood: Pizza,
  tourist: Camera,
  coffee: Coffee,
  slowfood: Utensils,
};

export default function CustomItineraryScreen() {
  const router = useRouter();
  const [stops, setLocalStops] = useState<Stop[]>(INITIAL_STOPS);
  const { setStops: saveStopsToContext } = useWayfinder();

  const removeStop = (id: string) => {
    setLocalStops(prev => prev.filter(s => s.id !== id));
  };

  const handleFinalize = () => {
    saveStopsToContext(stops);
    router.push('/final');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={28} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Customize Route</Text>
          <Text style={styles.subtitle}>
            Review and approve the suggested stops for your trip.
          </Text>
        </View>

        {/* Scrollable List */}
        <ScrollView 
          style={styles.list}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {stops.map((stop, index) => {
            const Icon = ICONS[stop.type];
            return (
              <Animated.View
                key={stop.id}
                layout={Layout.springify()}
                entering={FadeInUp.delay(index * 100)}
                exiting={FadeOutScale}
              >
                <GlassView style={styles.stopCard}>
                  {/* Left: Icon & Info */}
                  <View style={styles.stopInfo}>
                    <View style={styles.iconContainer}>
                      <Icon size={20} color="#2563EB" />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.stopName} numberOfLines={1}>{stop.name}</Text>
                      <View style={styles.addressRow}>
                        <MapPin size={12} color="#9CA3AF" style={{ marginRight: 4 }} />
                        <Text style={styles.stopAddress} numberOfLines={1}>{stop.address}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Right: Actions */}
                  <View style={styles.actions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => {}}
                    >
                      <Check size={18} color="#10B981" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.removeButton]}
                      onPress={() => removeStop(stop.id)}
                    >
                      <X size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </GlassView>
              </Animated.View>
            );
          })}

          {stops.length === 0 && (
            <Text style={styles.emptyText}>All stops removed. Enjoy your drive!</Text>
          )}
        </ScrollView>

        {/* Bottom Button */}
        <LinearGradient
          colors={['rgba(249,250,251,0)', '#F9FAFB', '#F9FAFB']}
          style={styles.footer}
        >
          <PrimaryButton 
            title="Finalize Trip" 
            onPress={handleFinalize} 
          />
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
  },
  navbar: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
    marginTop: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  list: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 120,
  },
  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: 80,
  },
  stopInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stopAddress: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  removeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 48,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 40,
    fontSize: 15,
  },
});
