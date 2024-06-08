import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../screens/Welcome';
import Home from '../screens/Home';
import Chatdetails from '../screens/Chatdetails';
import Chatscreen from '../screens/Chatscreen';
import Profilescreen from '../screens/Profilescreen';
import Login from '../screens/Login';
import Register from '../screens/Register';


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chatscreen" component={Chatscreen} />
      <Tab.Screen name="Profilescreen" component={Profilescreen} />
    </Tab.Navigator>
  );
}

export default class AppNavigation extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName='Welcome'
          screenOptions={
            {headerShown: false}
          }
        >
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Chatdetails" component={Chatdetails} options={
            {
              presentation: 'modal',
            }
          } />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}