import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView,
  Share,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Share2, 
  Navigation, 
  Calendar, 
  Clock, 
  Map as MapIcon,
  CheckCircle2
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GlassView } from '@/components/ui/GlassView';
import { useWayfinder } from '@/context/WayfinderContext';

export default function FinalScreen() {
  const router = useRouter();
  const { state, reset } = useWayfinder();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my road trip itinerary from ${state.origin} to ${state.destination}!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartNavigation = () => {
    Alert.alert(
      "Start Navigation",
      "Ready to start your trip with all 5 stops confirmed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Let's Go!", 
          onPress: () => {
            reset();
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1D4ED8', '#1E40AF']}
        style={styles.topSection}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Navbar */}
          <View style={styles.navbar}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.navButton}
            >
              <ChevronLeft size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleShare}
              style={styles.navButton}
            >
              <Share2 size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Hero Content */}
          <View style={styles.hero}>
            <View style={styles.successBadge}>
              <CheckCircle2 size={20} color="#fff" />
              <Text style={styles.badgeText}>Trip Ready</Text>
            </View>
            <Text style={styles.heroTitle}>Your Road Trip is Set!</Text>
            <Text style={styles.heroSubtitle}>
              From {state.origin} to {state.destination}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Stats & Details */}
      <View style={styles.detailsSection}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Key Stats */}
          <View style={styles.statsGrid}>
            <GlassView style={styles.statCard}>
              <Clock size={20} color="#2563EB" />
              <Text style={styles.statValue}>4h 15m</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </GlassView>
            <GlassView style={styles.statCard}>
              <MapIcon size={20} color="#2563EB" />
              <Text style={styles.statValue}>260 mi</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </GlassView>
            <GlassView style={styles.statCard}>
              <Calendar size={20} color="#2563EB" />
              <Text style={styles.statValue}>Today</Text>
              <Text style={styles.statLabel}>Date</Text>
            </GlassView>
          </View>

          {/* Map Preview Placeholder */}
          <View style={styles.mapPreview}>
             <LinearGradient
                colors={['#F3F4F6', '#E5E7EB']}
                style={StyleSheet.absoluteFill}
             />
             <View style={styles.mapPin}>
                <Navigation size={24} color="#2563EB" />
             </View>
             <Text style={styles.mapLabel}>View Full Map</Text>
          </View>

          {/* Trip Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Trip Summary</Text>
            <GlassView style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryDot} />
                <Text style={styles.summaryText}>5 Curated stops planned</Text>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryDot} />
                <Text style={styles.summaryText}>Preferences optimized</Text>
              </View>
              <View style={[styles.summaryRow, { marginBottom: 0 }]}>
                <View style={styles.summaryDot} />
                <Text style={styles.summaryText}>Real-time weather alerts on</Text>
              </View>
            </GlassView>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Start Button */}
        <SafeAreaView style={styles.footer}>
          <PrimaryButton 
            title="Start Navigation" 
            onPress={handleStartNavigation}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    paddingBottom: 40,
  },
  safeArea: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  hero: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
  detailsSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 24,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  mapPreview: {
    height: 180,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapPin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
  },
  mapLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  summarySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  summaryCard: {
    padding: 20,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginRight: 12,
  },
  summaryText: {
    fontSize: 15,
    color: '#4B5563',
  },
  spacer: {
    height: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
