import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    console.log('Loading screen started'); // Debug log

    const timer = setTimeout(() => {
      console.log('Navigating to Login screen'); // Debug log
      navigation.replace('Login'); // Replace with Login Screen
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#171717', '#444444']} // Consistent gradient colors
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("../../assets/logo.png")} // Update with your logo path
          style={styles.logo}
        />

        {/* Heading */}
        <Text style={styles.heading}>GamePlan</Text>

        {/* Loader */}
        

        {/* Tagline */}
        <Text style={styles.tagline}>Your sports journey begins here</Text>
        <ActivityIndicator
          size="large"
          color="#EDEDED"
          style={styles.loader}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
    marginBottom: 20,
    borderRadius: 75, // Makes the image round (half of width and height)
    borderWidth: 2, // Optional: Add a border
    borderColor: '#DA0037', // Optional: Border color to match the theme
    resizeMode: 'cover', // Ensures the image fits the circular area
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#EDEDED',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#DA0037',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  loader: {
    marginVertical: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#EDEDED',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
