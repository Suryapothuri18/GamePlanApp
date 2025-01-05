import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDY0shv_Jupv3m1a-FRzeSB3oyviEWZvjo",
  authDomain: "gameplan-be6a8.firebaseapp.com",
  projectId: "gameplan-be6a8",
  storageBucket: "gameplan-be6a8.firebasestorage.app",
  messagingSenderId: "695994204932",
  appId: "1:695994204932:android:6ccc6ef7dc600518738651",
  measurementId: "G-788DS1JWN5",
};

// Initialize Firebase app (check if it has already been initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth with persistence
export const auth =
  getApps().length === 0
    ? initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      })
    : getAuth(app);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firestore Functions

/**
 * Add Trainer Data
 * @param {Object} trainerData - Trainer data to be added
 */
export const addTrainer = async (trainerData) => {
  try {
    const trainerRef = await addDoc(collection(db, "trainers"), trainerData);
    console.log("Trainer added successfully with ID:", trainerRef.id);
  } catch (error) {
    console.error("Error adding trainer:", error.message);
    throw error;
  }
};

/**
 * Add Student Data
 * @param {string} trainerId - Trainer ID to link the student
 * @param {Object} studentData - Student data to be added
 */
export const addStudent = async (trainerId, studentData) => {
  try {
    const studentRef = await addDoc(
      collection(db, "trainers", trainerId, "students"),
      studentData
    );
    console.log("Student added successfully with ID:", studentRef.id);
  } catch (error) {
    console.error("Error adding student:", error.message);
    throw error;
  }
};

/**
 * Fetch All Students for a Trainer
 * @param {string} trainerId - Trainer ID to fetch students
 * @returns {Array} List of students
 */
export const fetchStudentsForTrainer = async (trainerId) => {
  try {
    const studentsSnapshot = await getDocs(
      collection(db, "trainers", trainerId, "students")
    );
    const students = studentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return students;
  } catch (error) {
    console.error("Error fetching students:", error.message);
    throw error;
  }
};

/**
 * Update Student Data
 * @param {string} trainerId - Trainer ID
 * @param {string} studentId - Student ID
 * @param {Object} updatedData - Updated student data
 */
export const updateStudent = async (trainerId, studentId, updatedData) => {
  try {
    const studentDoc = doc(db, "trainers", trainerId, "students", studentId);
    await updateDoc(studentDoc, updatedData);
    console.log("Student updated successfully!");
  } catch (error) {
    console.error("Error updating student:", error.message);
    throw error;
  }
};

/**
 * Delete Student
 * @param {string} trainerId - Trainer ID
 * @param {string} studentId - Student ID
 */
export const deleteStudent = async (trainerId, studentId) => {
  try {
    await deleteDoc(doc(db, "trainers", trainerId, "students", studentId));
    console.log("Student deleted successfully!");
  } catch (error) {
    console.error("Error deleting student:", error.message);
    throw error;
  }
};

/**
 * Upload File to Firebase Storage
 * @param {Object} file - File object with `uri` and `name`
 * @returns {string} File's public URL
 */
export const uploadFile = async (file) => {
  try {
    // Convert the file URI to a Blob
    const response = await fetch(file.uri);
    const blob = await response.blob();

    // Reference the file path in Firebase Storage
    const storageRef = ref(storage, `uploads/${file.name}`);

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the file's public URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File uploaded successfully:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
};
