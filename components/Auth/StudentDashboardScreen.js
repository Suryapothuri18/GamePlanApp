import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { db } from '../../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function StudentDashboardScreen({ navigation, route }) {
  const { studentData } = route.params || {};
  const [tasks, setTasks] = useState({ Exercise: [], Practice: [] });
  const [selectedToggle, setSelectedToggle] = useState('Exercise');
  const [attendanceDates, setAttendanceDates] = useState({});
  const [streak, setStreak] = useState(0);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [isInTargetLocation, setIsInTargetLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trainerDetails, setTrainerDetails] = useState(null);

  useEffect(() => {
    if (!studentData) {
      Alert.alert('Error', 'Student data is missing. Please log in again.');
      navigation.replace('Login');
      return;
    }

    const initializeDashboard = async () => {
      try {
        setLoading(true);
        await loadTasksAndAttendance();
        await fetchTrainerDetails();
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        Alert.alert('Error', 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [studentData]);

  const loadTasksAndAttendance = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const storedAttendanceDates = await AsyncStorage.getItem('attendanceDates');
      const storedStreak = await AsyncStorage.getItem('streak');

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedAttendanceDates) setAttendanceDates(JSON.parse(storedAttendanceDates));
      if (storedStreak) setStreak(parseInt(storedStreak, 10));
    } catch (error) {
      console.error('Error loading tasks or attendance:', error);
    }
  };

  const fetchTrainerDetails = async () => {
    try {
      const trainerID = studentData.trainerID;
      if (trainerID) {
        const trainerDoc = await getDoc(doc(db, 'trainers', trainerID));
        if (trainerDoc.exists()) {
          setTrainerDetails(trainerDoc.data());
        } else {
          Alert.alert('Error', 'Trainer data not found.');
        }
      }
    } catch (error) {
      console.error('Error fetching trainer details:', error);
    }
  };

  const checkLocation = async (latitude, longitude, radius) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required to mark attendance.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const distance = getDistance(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        { latitude, longitude }
      );

      setIsInTargetLocation(distance <= radius);
    } catch (error) {
      console.error('Error checking location:', error);
    }
  };

  const toggleTaskCompletion = (type, id) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks[type].map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      const newTasks = { ...prevTasks, [type]: updatedTasks };
      AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      return newTasks;
    });
  };

  const handleAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    if (!attendanceMarked && isInTargetLocation) {
      setAttendanceMarked(true);

      const updatedDates = {
        ...attendanceDates,
        [today]: {
          selected: true,
          marked: true,
          selectedColor: '#DA0037',
        },
      };
      setAttendanceDates(updatedDates);

      AsyncStorage.setItem('attendanceDates', JSON.stringify(updatedDates));
      Alert.alert('Attendance', 'Attendance marked successfully!');
    } else {
      Alert.alert('Error', 'You must be in the target location to mark attendance.');
    }
  };

  const saveProgress = async () => {
    if (
      tasks.Exercise.every((task) => task.completed) &&
      tasks.Practice.every((task) => task.completed)
    ) {
      setStreak((prevStreak) => prevStreak + 1);
      try {
        await AsyncStorage.setItem('streak', (streak + 1).toString());
        Alert.alert('Success', 'Progress saved successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to save progress.');
      }
    } else {
      Alert.alert('Incomplete Tasks', 'Complete all tasks to save progress.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DA0037" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInitialContainer}>
            <Text style={styles.profileInitial}>
              {studentData.name?.charAt(0).toUpperCase() || 'S'}
            </Text>
          </View>
          <Text style={styles.profileName}>{studentData.name || 'Student Name'}</Text>
          <Text style={styles.profileId}>ID: {studentData.studentID || 'N/A'}</Text>
        </View>

        {/* Trainer Info */}
        {trainerDetails && (
          <View style={styles.trainerInfoContainer}>
            <Text style={styles.trainerTitle}>Trainer Information</Text>
            <Text style={styles.trainerDetail}>Name: {trainerDetails.name || 'N/A'}</Text>
            <Text style={styles.trainerDetail}>ID: {trainerDetails.trainerID || 'N/A'}</Text>
          </View>
        )}

        {/* Go to Profile Button */}
        <TouchableOpacity
          style={styles.goToProfileButton}
          onPress={() => navigation.navigate('StudentProfile', { student: studentData })}
        >
          <Text style={styles.goToProfileButtonText}>Go to Profile</Text>
        </TouchableOpacity>

        {/* Streak Badge */}
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 Streak: {streak} days</Text>
        </View>

        {/* Attendance Button */}
        <TouchableOpacity
          style={[
            styles.attendanceButton,
            (!isInTargetLocation || attendanceMarked) && styles.attendanceButtonDisabled,
          ]}
          onPress={handleAttendance}
          disabled={!isInTargetLocation || attendanceMarked}
        >
          <Text
            style={[
              styles.attendanceButtonText,
              (!isInTargetLocation || attendanceMarked) &&
                styles.attendanceButtonTextDisabled,
            ]}
          >
            {attendanceMarked ? 'Attendance Marked' : 'Mark Attendance'}
          </Text>
        </TouchableOpacity>

        {/* Tasks */}
        <View style={styles.toggleContainer}>
          {['Exercise', 'Practice'].map((toggle) => (
            <TouchableOpacity
              key={toggle}
              style={[
                styles.toggleButton,
                selectedToggle === toggle && styles.activeToggleButton,
              ]}
              onPress={() => setSelectedToggle(toggle)}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedToggle === toggle && styles.activeToggleText,
                ]}
              >
                {toggle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{selectedToggle}</Text>
        {tasks[selectedToggle]?.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <Checkbox
              status={task.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleTaskCompletion(selectedToggle, task.id)}
              color="#DA0037"
            />
            <Text style={styles.taskName}>{task.name}</Text>
          </View>
        ))}

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={attendanceDates}
            theme={{
              calendarBackground: '#171717',
              textSectionTitleColor: '#DA0037',
              dayTextColor: '#FFFFFF',
              todayTextColor: '#DA0037',
              monthTextColor: '#FFFFFF',
              arrowColor: '#DA0037',
              selectedDayBackgroundColor: '#DA0037',
              selectedDayTextColor: '#FFFFFF',
            }}
          />
        </View>

        {/* Save Progress */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveProgress}
          disabled={
            !tasks.Exercise.every((task) => task.completed) ||
            !tasks.Practice.every((task) => task.completed)
          }
        >
          <Text style={styles.saveButtonText}>Save Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFFFFF', marginTop: 10 },
  header: { alignItems: 'center', marginBottom: 20 },
  profileInitialContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: { fontSize: 40, color: '#FFFFFF', fontWeight: 'bold' },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  profileId: { fontSize: 16, color: '#CCCCCC' },
  trainerInfoContainer: { marginVertical: 20, padding: 10, backgroundColor: '#1E1E1E', borderRadius: 10 },
  trainerTitle: { fontSize: 18, fontWeight: 'bold', color: '#DA0037', marginBottom: 5 },
  trainerDetail: { fontSize: 16, color: '#FFFFFF' },
  goToProfileButton: {
    backgroundColor: '#DA0037',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  goToProfileButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  streakBadge: { alignItems: 'center', marginBottom: 20 },
  streakText: { color: '#DA0037', fontSize: 16, fontWeight: 'bold' },
  attendanceButton: { backgroundColor: '#DA0037', padding: 15, borderRadius: 10 },
  attendanceButtonDisabled: { backgroundColor: '#CCCCCC' },
  attendanceButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' },
  attendanceButtonTextDisabled: { color: '#000000' },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeToggleButton: { backgroundColor: '#DA0037' },
  toggleText: { fontSize: 16, color: '#CCCCCC' },
  activeToggleText: { color: '#FFFFFF', fontWeight: 'bold' },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
  },
  taskName: { marginLeft: 10, fontSize: 16, color: '#FFFFFF' },
  calendarContainer: { marginBottom: 20 },
  saveButton: { backgroundColor: '#DA0037', padding: 15, borderRadius: 10 },
  saveButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' },
});
