import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native';
import Welcome from './src/screens/Welcome';
import Home from './src/screens/Home';
import Chatdetails from './src/screens/Chatdetails';
import Chatscreen from './src/screens/Chatscreen';
import Profilescreen from './src/screens/Profilescreen';
import Login from './src/screens/Login';
import Register from './src/screens/Register';

import { AuthProvider, useAuth } from './src/context/Authcontext';
import React from 'react';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const { onLogout } = useAuth();

  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ 
          headerRight: () => (
            <Button onPress={onLogout} title="Logout" />
          )
        }}
      />
      <Tab.Screen name="Chatscreen" component={Chatscreen} />
      <Tab.Screen name="Profilescreen" component={Profilescreen} />
    </Tab.Navigator>
  );
}

const RootNavigator = () => {
  const { authState } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Welcome'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        {authState?.authenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Chatdetails" component={Chatdetails} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>  
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </AuthProvider>
  );
}
