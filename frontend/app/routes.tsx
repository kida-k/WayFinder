import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Zap, DollarSign, Coffee, Sliders, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView } from '@/components/ui/GlassView';
import { useWayfinder } from '@/context/WayfinderContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ROUTES = [
  { 
    id: 'fastest', 
    title: 'Fastest Route', 
    time: '4h 15m', 
    distance: '260 mi', 
    icon: Zap, 
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  { 
    id: 'cheapest', 
    title: 'Cheapest', 
    time: '5h 30m', 
    distance: '290 mi', 
    icon: DollarSign, 
    color: '#10B981',
    bgColor: '#ECFDF5',
    sub: 'Saves $20'
  },
  { 
    id: 'relaxed', 
    title: 'Most Breaks', 
    time: '6h 00m', 
    distance: '265 mi', 
    icon: Coffee, 
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    sub: 'Relaxed Pace'
  },
];

export default function RouteSelectionScreen() {
  const router = useRouter();
  const { setSelectedRouteId } = useWayfinder();

  const handleSelect = (id: string) => {
    setSelectedRouteId(id);
    if (id === 'custom') {
      router.push('/custom');
    } else {
      router.push('/final');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Half: Mock Map */}
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={['#E5E7EB', '#F3F4F6']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Placeholder for Map Visuals */}
        <View style={styles.mapMock}>
          <View style={[styles.dot, { left: '20%', top: '70%', backgroundColor: '#2563EB' }]} />
          <View style={[styles.dot, { left: '80%', top: '20%', backgroundColor: '#1D4ED8' }]}>
            <View style={styles.pin}>
               <MapPin size={12} color="#fff" />
            </View>
          </View>
          {/* Mock Route Line */}
          <View style={styles.routeLine} />
        </View>

        <SafeAreaView style={styles.mapOverlay}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={28} color="#111827" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Bottom Half: Route Cards */}
      <View style={styles.selectionContainer}>
        <View style={styles.handle} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Select Route</Text>

          <View style={styles.routeList}>
            {ROUTES.map((route) => {
              const Icon = route.icon;
              return (
                <TouchableOpacity
                  key={route.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelect(route.id)}
                >
                  <GlassView style={styles.routeCard}>
                    <View style={[styles.iconBox, { backgroundColor: route.bgColor }]}>
                      <Icon size={24} color={route.color} />
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeTitle}>{route.title}</Text>
                      <Text style={styles.routeMeta}>
                        {route.time} • {route.distance}
                        {route.sub && <Text style={{ color: route.color, fontWeight: '600' }}> • {route.sub}</Text>}
                      </Text>
                    </View>
                  </GlassView>
                </TouchableOpacity>
              );
            })}

            {/* Custom Option */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSelect('custom')}
            >
              <LinearGradient
                colors={['#2563EB', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.customCard}
              >
                <View style={styles.customIconBox}>
                  <Sliders size={24} color="#fff" />
                </View>
                <View style={styles.routeInfo}>
                  <Text style={[styles.routeTitle, { color: '#fff' }]}>Custom Itinerary</Text>
                  <Text style={{ color: '#BFDBFE', fontSize: 14 }}>Manage all stops & preferences</Text>
                </View>
                <ChevronLeft size={24} color="rgba(255,255,255,0.5)" style={{ transform: [{ rotate: '180deg' }] }} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mapContainer: {
    height: '45%',
    width: '100%',
  },
  mapMock: {
    flex: 1,
    position: 'relative',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  pin: {
    position: 'absolute',
    top: -24,
    left: -4,
    backgroundColor: '#1D4ED8',
    padding: 4,
    borderRadius: 12,
  },
  routeLine: {
    position: 'absolute',
    left: '20%',
    top: '45%',
    width: '65%',
    height: 4,
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    borderRadius: 2,
    transform: [{ rotate: '-35deg' }],
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    marginLeft: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectionContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 12,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  routeList: {
    gap: 14,
    paddingBottom: 40,
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  routeMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  customCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
  },
  customIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
});
