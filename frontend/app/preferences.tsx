import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Switch,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Fuel, Utensils, Camera, Pizza } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GlassView } from '@/components/ui/GlassView';
import { useWayfinder } from '@/context/WayfinderContext';

const STOP_OPTIONS = [
  { id: 'gas', title: 'Gas', icon: Fuel, color: '#3B82F6' },
  { id: 'fastfood', title: 'Fast Food', icon: Pizza, color: '#EF4444' },
  { id: 'tourist', title: 'Tourist Attractions', icon: Camera, color: '#10B981' },
  { id: 'slowfood', title: 'Slow Food', icon: Utensils, color: '#F59E0B' },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const { state, togglePreference } = useWayfinder();

  return (
    <LinearGradient
      colors={['#F9FAFB', '#FFFFFF', '#F9FAFB']}
      style={styles.container}
    >
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

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Stop Options</Text>
            <Text style={styles.subtitle}>
              Customize what types of stops you want along the way.
            </Text>
          </View>

          {/* List */}
          <View style={styles.list}>
            {STOP_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.7}
                  onPress={() => togglePreference(option.id)}
                >
                  <GlassView style={styles.optionCard}>
                    <View style={styles.optionLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: `${option.color}15` }]}>
                        <Icon size={22} color={option.color} />
                      </View>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                    </View>
                    
                    <Switch
                      value={state.preferences[option.id]}
                      onValueChange={() => togglePreference(option.id)}
                      trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                      thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : state.preferences[option.id] ? '#FFFFFF' : '#F4F3F4'}
                      ios_backgroundColor="#E5E7EB"
                    />
                  </GlassView>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <PrimaryButton 
              title="Generate Routes" 
              onPress={() => router.push('/routes')} 
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 32,
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
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    height: 72,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  footer: {
    marginTop: 32,
  },
});
