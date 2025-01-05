import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View, Text, StyleSheet } from 'react-native';
import { StudentProvider } from './components/Auth/StudentContext'; // Import StudentProvider
import { TrainerProvider } from './components/Auth/TrainerContext'; // Import TrainerProvider

// Import screens
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
import StudentPage from './components/Auth/StudentPage';

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
    <StudentProvider>
      <TrainerProvider>
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
            {/* Screens */}
            <Stack.Screen
              name="Loading"
              component={LoadingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="TrainerSignUp" component={TrainerSignUpScreen} />
            <Stack.Screen name="StudentSignUp" component={StudentSignUpScreen} />
            <Stack.Screen
              name="TrainerDashboard"
              component={TrainerDashboardScreen}
              options={{
                title: 'Trainer Dashboard',
                headerStyle: { backgroundColor: '#171717' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="StudentDashboard"
              component={StudentDashboardScreen}
              options={{
                title: 'Student Dashboard',
                headerStyle: { backgroundColor: '#171717' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="StudentProfile"
              component={StudentProfileScreen}
              options={{
                title: 'Student Profile',
                headerStyle: { backgroundColor: '#171717' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="TrainerProfile"
              component={TrainerProfileScreen}
              options={{
                title: 'Trainer Profile',
                headerStyle: { backgroundColor: '#171717' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{
                title: 'Settings',
                headerStyle: { backgroundColor: '#171717' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="StudentSettings"
              component={StudentSettingsScreen}
              options={{
                title: 'Student Settings',
                headerStyle: { backgroundColor: '#171717' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen name="StudentPage" component={StudentPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </TrainerProvider>
    </StudentProvider>
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
