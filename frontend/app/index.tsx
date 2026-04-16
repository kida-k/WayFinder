import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, MapPin, Flag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useWayfinder } from '@/context/WayfinderContext';

export default function StartScreen() {
  const router = useRouter();
  const { state, setOrigin, setDestination, setStartTime } = useWayfinder();

  const handleNext = () => {
    router.push('/preferences');
  };

  return (
    <LinearGradient
      colors={['#F0F9FF', '#FFFFFF', '#F0F9FF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Plan Your Drive</Text>
            <Text style={styles.subtitle}>
              Enter your details to generate optimal routes.
            </Text>
          </View>

          {/* Inputs */}
          <View style={styles.form}>
            <Input
              label="Start Time"
              value={state.startTime}
              onChangeText={setStartTime}
              placeholder="e.g., 8:00 AM"
              icon={<Clock size={20} color="#2563EB" />}
            />

            <Input
              label="Start Location"
              value={state.origin}
              onChangeText={setOrigin}
              placeholder="Street, City"
              icon={<MapPin size={20} color="#2563EB" />}
            />

            <Input
              label="Destination"
              value={state.destination}
              onChangeText={setDestination}
              placeholder="Street, City"
              icon={<Flag size={20} color="#2563EB" />}
            />
          </View>

          {/* Spacer to push button down */}
          <View style={{ flex: 1 }} />

          {/* Bottom Button */}
          <View style={styles.footer}>
            <PrimaryButton 
              title="Set Preferences" 
              onPress={handleNext} 
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    gap: 8,
  },
  footer: {
    marginTop: 20,
  },
});
