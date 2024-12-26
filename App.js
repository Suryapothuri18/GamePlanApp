import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View, Text, StyleSheet } from 'react-native';
import RegisterScreen from './components/Auth/RegisterScreen';
import ForgotPasswordScreen from './components/Auth/ForgotPasswordScreen';
import TrainerSignUpScreen from './components/Auth/TrainerSignUpScreen';
import StudentSignUpScreen from './components/Auth/StudentSignUpScreen';
import TrainerDashboardScreen from './components/Auth/TrainerDashboardScreen';
import StudentDashboardScreen from './components/Auth/StudentDashboardScreen';
import LoginScreen from './components/Auth/LoginScreen';
import LoadingScreen from './components/Auth/LoadingScreen';
import TrainerProfileScreen from './components/Auth/TrainerProfileScreen';
import SettingsScreen from './components/Auth/SettingsScreen';
import StudentProfileScreen from './components/Auth/StudentProfileScreen';
import StudentSettingsScreen from './components/Auth/StudentSettingsScreen';
import StudentPage from './components/Auth/StudentPage'; // Import StudentPage if added for individual student profiles.

const Stack = createStackNavigator();

const HeaderLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require('./assets/logo.png')}
      style={styles.logo}
      resizeMode="cover"
    />
    <Text style={styles.logoText}>
      <Text style={{ color: '#DA0037' }}>GAME</Text>
      <Text style={{ color: '#EDEDED' }}>PLAN</Text>
    </Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerStyle: { backgroundColor: '#171717' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitle: () => <HeaderLogo />,
        }}
      >
        {/* Loading Screen */}
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />

        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Register Screen */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        {/* Forgot Password Screen */}
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
        />

        {/* Trainer Sign Up Screen */}
        <Stack.Screen
          name="TrainerSignUp"
          component={TrainerSignUpScreen}
        />

        {/* Student Sign Up Screen */}
        <Stack.Screen
          name="StudentSignUp"
          component={StudentSignUpScreen}
        />

        {/* Trainer Dashboard Screen */}
        <Stack.Screen
          name="TrainerDashboard"
          component={TrainerDashboardScreen}
        />

        {/* Student Dashboard Screen */}
        <Stack.Screen
          name="StudentDashboard"
          component={StudentDashboardScreen}
        />

        {/* Trainer Profile Screen */}
        <Stack.Screen
          name="TrainerProfile"
          component={TrainerProfileScreen}
        />

        {/* Settings Screen */}
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
        />

        {/* Student Profile Screen */}
        <Stack.Screen
          name="StudentProfile"
          component={StudentProfileScreen}
        />

        {/* Student Settings Screen */}
        <Stack.Screen
          name="StudentSettings"
          component={StudentSettingsScreen}
        />

        {/* Student Page */}
        <Stack.Screen
          name="StudentPage"
          component={StudentPage} // Add this if you have a separate StudentPage component.
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DA0037',
  },
  logoText: {
    fontSize: 29,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
