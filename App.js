import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, SafeAreaView, Text, View } from 'react-native';
import Welcome from './src/screens/Welcome';
import Home from './src/screens/Home';
import Chatdetails from './src/screens/Chatdetails';
import Chatscreen from './src/screens/Chatscreen';
import Profilescreen from './src/screens/Profilescreen';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/Authcontext';
import React from 'react';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function MainTabNavigator() {
  const { onLogout, authState } = useAuth();
  const { token } = authState;
  const user = token ? token : 'No User';
  const navigation = useNavigation();

  handleLogout = async () => {
    await onLogout();
    navigation.navigate('Welcome')
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size= '30' color={color} />;
        },
        tabBarActiveTintColor: 'pink',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle:{
          paddingTop: 5,
          height: 90,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'SpaceGroteskRegular',
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ 
          headerTitle: '',
          headerRight: () => (
            <Ionicons name='log-out-outline' size='40' color='gray'  onPress={handleLogout} title="Logout" className='text-slate-500 mr-4 mb-2' />
          ),
          headerLeft:()=>(
            user?
            <View className='w-10 h-10 bg-slate-400 flex justify-center items-center rounded-full ml-4 mb-2'><Text className='text-white'>{token? token.slice(0,1):null}</Text></View>:null
          ),
        }}
      />
      <Tab.Screen name="Chat" component={Chatscreen}
      options={{ 
        headerTitle: '',
        headerRight: () => (
          <Ionicons name='log-out-outline' className='text-slate-500 mr-4 mb-2' size='40' color='gray'  onPress={handleLogout} title="Logout" />
        ),
        headerLeft:()=>(
          user?
          <View className='w-10 h-10 bg-slate-400 flex justify-center items-center rounded-full ml-4 mb-2'><Text className='text-white'>{token? token.slice(0,1):null}</Text></View>:null
        ),
      }} />
      <Tab.Screen name="Profile" component={Profilescreen}
      options={{ 
        headerTitle: '',
        headerRight: () => (
          <Ionicons className='text-slate-500 mr-4 mb-2' name='log-out-outline' size='40' onPress={handleLogout} title="Logout" />
          
        ),
        headerLeft:()=>(
          user?
          <View className='w-10 h-10 bg-slate-400 flex justify-center items-center rounded-full ml-4 mb-2'><Text className='text-white'>{token? token.slice(0,1):null}</Text></View>:null
        ),
        
      }} />
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
