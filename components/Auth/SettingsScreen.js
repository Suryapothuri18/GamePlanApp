import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTrainerContext } from './TrainerContext'; // Import TrainerContext

export default function SettingsScreen({ navigation }) {
  const { trainerData, updateTrainerData } = useTrainerContext(); // Access trainer data
  const { trainerID, name, age, sportSpecialty, email, address } = trainerData;

  const [fullName, setFullName] = useState(name || '');
  const [trainerAge, setTrainerAge] = useState(age || '');
  const [specialty, setSpecialty] = useState(sportSpecialty || '');
  const [emailAddress, setEmailAddress] = useState(email || '');
  const [trainerAddress, setTrainerAddress] = useState(address || '');

  const getInitialLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const saveChanges = () => {
    if (!fullName || !trainerAge || !specialty || !emailAddress || !trainerAddress) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    updateTrainerData({
      name: fullName,
      age: trainerAge,
      sportSpecialty: specialty,
      email: emailAddress,
      address: trainerAddress,
    });

    Alert.alert('Success', 'Profile updated successfully!');
    navigation.goBack();
  };

  return (
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profilePlaceholder}>
          <Text style={styles.profileInitial}>{getInitialLetter(fullName)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#CCCCCC"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#CCCCCC"
          keyboardType="numeric"
          value={trainerAge}
          onChangeText={setTrainerAge}
        />

        <Text style={styles.sectionTitle}>Professional Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Sport Specialty"
          placeholderTextColor="#CCCCCC"
          value={specialty}
          onChangeText={setSpecialty}
        />

        <Text style={styles.sectionTitle}>Contact Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#CCCCCC"
          keyboardType="email-address"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#CCCCCC"
          value={trainerAddress}
          onChangeText={setTrainerAddress}
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, padding: 20 },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DA0037',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileInitial: { fontSize: 36, color: '#FFFFFF', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, color: '#DA0037', marginBottom: 10 },
  input: {
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555555',
  },
  saveButton: { backgroundColor: '#DA0037', padding: 15, borderRadius: 10, marginTop: 20 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
