import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '../context/Authcontext';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  const { onRegister } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [games, setGames] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [skill_level, setSkill_level] = useState('');
  const [profile_picture, setProfile_picture] = useState({});
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let { uri } = result.assets[0];

      if (Platform.OS === 'android' && !uri.startsWith('file://')) {
        uri = 'file://' + uri;
      }

      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800, height: 600 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        setProfile_picture({
          uri: manipulatedImage.uri,
          name: `profile_picture.jpg`,
          type: `image/jpeg`
        });
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to resize image. Please try again.');
      }
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !username || !bio || !location || !games || !platforms || !skill_level || !profile_picture?.uri) {
      setError('All fields are required.');
      return;
    }
    try {
      const result = await onRegister(username, email, password, bio, location, games, platforms, skill_level, profile_picture);
      Alert.alert('Register Success');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Register Error:', error.response ? error.response.data : error.message);
      setError('Registration failed. Please try again.');
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E2E8F0' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ alignItems: 'center', flexGrow: 1 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: hp(2) }}>
            <Image 
              source={require('../../assets/images/tetris-heart.jpg')}  
              style={{ 
                width: wp(100), 
                height: hp(35),
                resizeMode: 'cover'
              }} 
            />
          </View>
          <View style={{ width: '100%', paddingHorizontal: wp(10) }}>
            <Text 
              style={{ 
                textAlign: 'center', 
                fontFamily: 'SpaceGroteskBold', 
                fontSize: wp(10),
                marginBottom: hp(2),
              }}
            >
              SIGN UP
            </Text>
            <TextInput
              placeholder='Username'
              value={username}
              onChangeText={setUsername}
              style={{ 
                marginTop: hp(1), 
                padding: wp(4), 
                backgroundColor: '#FFFFFF', 
                borderRadius: wp(2), 
                fontFamily: 'SpaceGroteskRegular',
                fontSize: wp(5),
              }} 
            />
            <TextInput
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
              style={{ 
                marginTop: hp(1), 
                padding: wp(4), 
                backgroundColor: '#FFFFFF', 
                borderRadius: wp(2), 
                fontFamily: 'SpaceGroteskRegular',
                fontSize: wp(5),
              }}
            />
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ 
                marginTop: hp(1), 
                padding: wp(4), 
                backgroundColor: '#FFFFFF', 
                borderRadius: wp(2), 
                fontFamily: 'SpaceGroteskRegular',
                fontSize: wp(5),
              }}
            />
            <TextInput
              placeholder='Bio'
              value={bio}
              onChangeText={setBio}
              style={{ 
                marginTop: hp(1), 
                padding: wp(4), 
                backgroundColor: '#FFFFFF', 
                borderRadius: wp(2), 
                fontFamily: 'SpaceGroteskRegular',
                fontSize: wp(5),
              }}
            />
            <TextInput
              placeholder='Location'
              value={location}
              onChangeText={setLocation}
              style={{
                marginTop: hp(1), 
                padding: wp(4), 
                backgroundColor: '#FFFFFF', 
                borderRadius: wp(2), 
                fontFamily: 'SpaceGroteskRegular',
                fontSize: wp(5),
              }}
            />
            <TextInput
              placeholder='Games'
              value={games}
              onChangeText={setGames}
              style={{ 
                marginTop: hp(1), 
                padding: wp(4), 
                backgroundColor: '#FFFFFF', 
                borderRadius: wp(2), 
                fontFamily: 'SpaceGroteskRegular',
                fontSize: wp(5),
              }}
            />
            <TextInput
              placeholder='Platforms'
              value={platforms}
              onChangeText={setPlatforms}
              style={{
                marginTop: hp(1), 
                padding: wp(4), 
                backgroundColor: '#FFFFFF', 
                borderRadius: wp(2), 
                fontFamily: 'SpaceGroteskRegular',
                fontSize: wp(5),
              }}
            />
            <TextInput
              placeholder='Skill Level'
              value={skill_level}
              onChangeText={setSkill_level}
              style={{
                marginTop: hp(1), 
                padding: wp(4), 
                backgroundColor: '#FFFFFF', 
                borderRadius: wp(2), 
                fontFamily: 'SpaceGroteskRegular',
                fontSize: wp(5),
              }}  
            />
            <TouchableOpacity 
              onPress={handlePickImage} 
              style={{
                backgroundColor: '#CBD5E0',  
                alignSelf: 'center', 
                marginTop: hp(2), 
                paddingVertical: hp(2), 
                paddingHorizontal: wp(10), 
                borderRadius: wp(4),
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Ionicons name="image" size={hp(3)} color="white" />
              <Text style={{
                marginLeft: wp(2),
                fontFamily: 'SpaceGroteskRegular',
                fontSize: wp(4),
                color: 'white'
              }}>Upload a photo</Text>
            </TouchableOpacity>
            {error ? (
              <Text 
                style={{ 
                  color: '#B91C1C', 
                  marginTop: hp(2), 
                  padding: wp(4), 
                  textAlign: 'center', 
                  backgroundColor: '#FECACA', 
                  borderRadius: wp(2), 
                  fontFamily: 'SpaceGroteskRegular',
                  fontSize: wp(4),
                }}
              >
                {error}
              </Text>
            ) : null}
            <View>
              <TouchableOpacity 
                style={{
                  backgroundColor: '#FBB6CE',  
                  alignSelf: 'center', 
                  marginTop: hp(2), 
                  paddingVertical: hp(2), 
                  paddingHorizontal: wp(10), 
                  borderRadius: wp(4)
                }}
                onPress={handleRegister}
              >
                <Text style={{ 
                  fontFamily: 'SpaceGroteskSemiBold', 
                  fontSize: wp(5),
                  color: 'white',
                  textAlign: 'center'
                }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
              <Text 
                style={{ 
                  textAlign: 'center',  
                  marginTop: hp(2), 
                  paddingHorizontal: wp(4), 
                  fontFamily: 'SpaceGroteskSemiBold', 
                  fontSize: wp(4),
                }}
              >
                Do you already have an account?  
                <Text 
                  style={{ color: '#3B82F6', textDecorationLine: 'underline' }}
                  onPress={() => navigation.navigate('Login')}
                >Log In
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Register;