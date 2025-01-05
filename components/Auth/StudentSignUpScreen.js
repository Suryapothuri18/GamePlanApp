import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../../utils/firebaseConfig'; // Import Firebase instances
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function StudentSignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [trainerID, setTrainerID] = useState('');
  const [address, setAddress] = useState('');
  const [sport, setSport] = useState('');
  const [gender, setGender] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [studentID, setStudentID] = useState('');

  const generateStudentID = () => {
    const generatedID = Math.floor(100000 + Math.random() * 900000).toString();
    setStudentID(generatedID);
    Alert.alert('Student ID Generated', `Your Student ID is: ${generatedID}`);
  };

  const handleSignUp = async () => {
    if (!fullName || !age || !sport || !gender || !email || !password || !confirmPassword || !trainerID || !studentID) {
      Alert.alert('Error', 'Please fill in all mandatory fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Create student account in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save student data to Firestore
      const studentData = {
        name: fullName,
        age: parseInt(age, 10),
        email,
        trainerID,
        studentID,
        address,
        sport,
        gender,
        emergencyContact,
        image: 'https://via.placeholder.com/150', // Default profile image
      };

      await setDoc(doc(db, 'students', user.uid), studentData);

      Alert.alert('Success', 'Student account created successfully!');
      navigation.navigate('Login'); // Redirect to login screen after successful sign-up
    } catch (error) {
      console.error('Error saving student data:', error);
      Alert.alert('Error', `Failed to create account: ${error.message}`);
    }
  };

  return (
    <LinearGradient
      colors={['#171717', '#444444']} // Gradient background
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Student Sign Up</Text>
        <Text style={styles.subheading}>Create your student profile and start your sports journey</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#CCCCCC"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          placeholderTextColor="#CCCCCC"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
            dropdownIconColor="#EDEDED"
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Prefer not to say" value="Prefer not to say" />
          </Picker>
        </View>

        {/* Email Address */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#CCCCCC"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#CCCCCC"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter your password"
          placeholderTextColor="#CCCCCC"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Trainer ID */}
        <Text style={styles.label}>Trainer ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your trainer ID"
          placeholderTextColor="#CCCCCC"
          value={trainerID}
          onChangeText={setTrainerID}
        />

        {/* Student ID */}
        <Text style={styles.label}>Student ID</Text>
        <View style={styles.studentIDContainer}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: '#555555', color: '#AAAAAA' }]}
            value={studentID}
            editable={false}
            placeholder="Student ID will be generated"
            placeholderTextColor="#CCCCCC"
          />
          <TouchableOpacity style={styles.generateButton} onPress={generateStudentID}>
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>
        </View>

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          placeholderTextColor="#CCCCCC"
          value={address}
          onChangeText={setAddress}
        />

        {/* Sport */}
        <Text style={styles.label}>Sport</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sport}
            onValueChange={(itemValue) => setSport(itemValue)}
            style={styles.picker}
            dropdownIconColor="#EDEDED"
          >
            <Picker.Item label="Select Sport" value="" />
            {[
              'Badminton',
              'Basketball',
              'Cricket',
              'Cycling',
              'Football',
              'Ice Hockey',
              'Karate',
              'Skying',
              'Swimming',
              'Volleyball',
            ].map((sportOption) => (
              <Picker.Item key={sportOption} label={sportOption} value={sportOption} />
            ))}
          </Picker>
        </View>

        {/* Emergency Contact */}
        <Text style={styles.label}>Emergency Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter emergency contact number"
          placeholderTextColor="#CCCCCC"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          keyboardType="phone-pad"
        />

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Already Have an Account */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginRedirect}>Already have an account? Log in here.</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EDEDED',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#CCCCCC',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  label: {
    fontSize: 16,
    color: '#EDEDED',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
  },
  studentIDContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#DA0037',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: '#1E1E1E',
    marginBottom: 20,
  },
  picker: {
    color: '#FFFFFF',
    height: Platform.OS === 'android' ? 50 : undefined,
  },
  signupButton: {
    backgroundColor: '#DA0037',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#DA0037',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginRedirect: {
    textAlign: 'center',
    color: '#DA0037',
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});