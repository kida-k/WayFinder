import { View, Text, StyleSheet } from 'react-native';

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Saved Trips</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  }
});