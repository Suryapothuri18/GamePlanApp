// TrainerContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the TrainerContext
const TrainerContext = createContext();

// TrainerProvider to wrap the app and provide trainer data globally
export const TrainerProvider = ({ children }) => {
  const [trainerData, setTrainerData] = useState({
    trainerID: '',
    name: '',
    email: '',
    profileImage: 'https://via.placeholder.com/150',
    sport: '',
    experience: '',
    clients: [],
    certifications: [],
    bio: '',
    address: '',
  });

  // Function to update specific fields in the trainer data
  const updateTrainerData = (updatedFields) => {
    setTrainerData((prevData) => ({ ...prevData, ...updatedFields }));
  };

  // Function to reset trainer data (e.g., on logout)
  const resetTrainerData = () => {
    setTrainerData({
      trainerID: '',
      name: '',
      email: '',
      profileImage: 'https://via.placeholder.com/150',
      sport: '',
      experience: '',
      clients: [],
      certifications: [],
      bio: '',
      address: '',
    });
  };

  // Effect to check and log trainerID for debugging
  useEffect(() => {
    if (!trainerData.trainerID) {
      console.warn('Trainer ID is missing. Make sure it is set correctly.');
    }
  }, [trainerData.trainerID]);

  return (
    <TrainerContext.Provider value={{ trainerData, setTrainerData, updateTrainerData, resetTrainerData }}>
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
