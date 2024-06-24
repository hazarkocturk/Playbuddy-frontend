import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Welcome from './src/screens/Welcome';
import Home from './src/screens/Home';
import Chatscreen from './src/screens/Chatscreen';
import Profilescreen from './src/screens/Profilescreen';
import Chatdetails from './src/component/Chatdetails';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import { AuthProvider, useAuth } from './src/context/Authcontext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const { onLogout, authState } = useAuth();
  const { token, username, profile_picture } = authState;
  const navigation = useNavigation();

  const handleLogout = async () => {
    await onLogout();
    navigation.navigate('Welcome');
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={hp(4)} color={color} />;
        },
        tabBarActiveTintColor: 'pink',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingTop: hp(1),
          height: hp(10),
        },
        tabBarLabelStyle: {
          fontSize: wp(3),
          fontFamily: 'SpaceGroteskRegular',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: 'white',
          shadowColor: 'transparent',
        },
        headerTitleStyle: {
          fontFamily: 'SpaceGroteskBold',
          fontSize: wp(5),
        },
        headerRightContainerStyle: {
          paddingRight: wp(4),
        },
        headerLeftContainerStyle: {
          paddingLeft: wp(4),
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: '',
          headerRight: () => (
            <Ionicons
              name='log-out-outline'
              size={hp(4)}
              color='gray'
              onPress={handleLogout}
              style={styles.headerIcon}
            />
          ),
          headerLeft: () => (
            username ? (
              <View style={styles.userIconContainer}>
                {profile_picture ? (
                  <ImageBackground
                    source={{ uri: profile_picture }}
                    style={styles.userIconImage}
                    imageStyle={{ borderRadius: wp(5) }}
                  />
                ) : (
                  <Text style={styles.userIconText}>{username.slice(0, 1)}</Text>
                )}
              </View>
            ) : null
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chatscreen}
        options={{
          headerTitle: '',
          headerRight: () => (
            <Ionicons
              name='log-out-outline'
              size={hp(4)}
              color='gray'
              onPress={handleLogout}
              style={styles.headerIcon}
            />
          ),
          headerLeft: () => (
            username ? (
              <View style={styles.userIconContainer}>
                {profile_picture? (
                  <ImageBackground
                    source={{ uri: profile_picture }}
                    style={styles.userIconImage}
                    imageStyle={{ borderRadius: wp(5) }}
                  />
                ) : (
                  <Text style={styles.userIconText}>{username.slice(0, 1)}</Text>
                )}
              </View>
            ) : null
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profilescreen}
        options={{
          headerTitle: '',
          headerRight: () => (
            <Ionicons
              name='log-out-outline'
              size={hp(4)}
              color='gray'
              onPress={handleLogout}
              style={styles.headerIcon}
            />
          ),
          headerLeft: () => (
            username ? (
              <View style={styles.userIconContainer}>
                {profile_picture?  (
                  <ImageBackground
                    source={{ uri: profile_picture }}
                    style={styles.userIconImage}
                    imageStyle={{ borderRadius: wp(5) }}
                  />
                ) : (
                  <Text style={styles.userIconText}>{username.slice(0, 1)}</Text>
                )}
              </View>
            ) : null
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const RootNavigator = () => {
  const { authState, username } = useAuth();

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
};

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    paddingRight: wp(4),
    paddingBottom: hp(2),
  },
  userIconContainer: {
    width: wp(10),
    height: wp(10),
    backgroundColor: 'slategray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(5),
    marginLeft: wp(4),
    marginBottom: hp(2),
  },
  userIconImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
  },
  userIconText: {
    color: 'white',
    fontSize: wp(5),
    fontFamily: 'SpaceGroteskBold',
  },
});
