import React, { createContext, useState, useContext } from 'react';

// Create the StudentContext
const StudentContext = createContext();

// StudentProvider to wrap the app and provide student data
export const StudentProvider = ({ children }) => {
  const [studentData, setStudentData] = useState({
    studentID: '',
    name: '',
    image: 'https://via.placeholder.com/150',
    age: '',
    gender: '',
    email: '',
    address: '',
    trainerID: '',
    trainerName: '',
    sport: '',
    emergencyContact: '',
    tasks: { Exercise: [], Practice: [] },
    attendanceDates: {},
    streak: 0,
  });

  // Function to update specific fields in the student data
  const updateStudentData = (updatedFields) => {
    setStudentData((prevData) => ({ ...prevData, ...updatedFields }));
  };

  return (
    <StudentContext.Provider value={{ studentData, setStudentData, updateStudentData }}>
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook for accessing the StudentContext
export const useStudentContext = () => {
  return useContext(StudentContext);
};
