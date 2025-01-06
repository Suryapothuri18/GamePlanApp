import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../../utils/firebaseConfig'; // Firebase Auth and Firestore instances
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Create the TrainerContext
const TrainerContext = createContext();

// TrainerProvider to wrap the app and provide trainer data globally
export const TrainerProvider = ({ children }) => {
  const [trainerData, setTrainerData] = useState(null); // Trainer data fetched from Firestore
  const [loading, setLoading] = useState(true); // Loading state to handle data fetching

  // Fetch Trainer Data from Firestore
  const fetchTrainerData = async (uid) => {
    try {
      const docRef = doc(db, 'trainers', uid);
      const trainerDoc = await getDoc(docRef);

      if (trainerDoc.exists()) {
        setTrainerData(trainerDoc.data());
        console.log('Trainer data fetched successfully:', trainerDoc.data());
      } else {
        console.warn('Trainer data not found in Firestore.');
        setTrainerData(null);
      }
    } catch (error) {
      console.error('Error fetching trainer data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update Trainer Data in Firestore and Context
  const updateTrainerData = async (updatedFields) => {
    if (!auth.currentUser) {
      console.warn('No authenticated user. Cannot update trainer data.');
      return;
    }

    const uid = auth.currentUser.uid;

    try {
      const updatedTrainerData = { ...trainerData, ...updatedFields };
      setTrainerData(updatedTrainerData); // Update locally
      await setDoc(doc(db, 'trainers', uid), updatedTrainerData, { merge: true }); // Update in Firestore
      console.log('Trainer data updated successfully in Firestore.');
    } catch (error) {
      console.error('Error updating trainer data:', error.message);
    }
  };

  // Reset Trainer Data (e.g., on logout)
  const resetTrainerData = () => {
    setTrainerData(null);
  };

  // Fetch Trainer Data on Authentication State Change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User signed in. Fetching trainer data for UID:', user.uid);
        fetchTrainerData(user.uid);
      } else {
        console.log('User signed out. Resetting trainer data.');
        resetTrainerData();
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <TrainerContext.Provider value={{ trainerData, updateTrainerData, resetTrainerData, loading }}>
      {children}
    </TrainerContext.Provider>
  );
};

// Custom hook for accessing the TrainerContext
export const useTrainerContext = () => {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainerContext must be used within a TrainerProvider');
  }
  return context;
};
