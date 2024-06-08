import { View, Text, SafeAreaView, TextInput, TouchableOpacity,Image } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '../context/Authcontext';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Login = () => {
  const { onLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      const result = await onLogin(email, password);
      if (result) {
        alert('Login Success');
        navigation.navigate('Main');
      } else {
        alert('Login Failed');
      }
    } catch (error) {
      alert('Login Error', error);
    }
  }

  return (
    <SafeAreaView className='bg-slate-200 flex-1 '
    style={{ 
      width: wp(100)
     }}>
      <View className='flex-col items-center ' 
      style={{ 

        width: wp(100),
        height: hp(100),
       }}>
        <View className=" justify-center items-center my-4">
          <Image source={require('../../assets/images/tetris-heart.jpg')}  style={{ 
            width: wp(100), 
            height: hp(35),
            resizeMode: 'cover'
           }} 
           />
        </View>
        <View className='w-full px-10 '>
        <Text className='tracking-widest leading-none text-center'
        style={{ 
          fontFamily: 'SpaceGroteskBold',
          fontSize: wp(10),
         }}>LOGIN
        </Text>
      
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          className='mt-2 p-4 bg-white rounded-lg w-full'
          style={{ 
            fontFamily: 'SpaceGroteskRegular',
            fontSize: wp(5),
           }}
        />
        <TextInput
          placeholder='Password'
          className='mt-2 p-4 bg-white rounded-lg w-full'
          value={password}
          onChangeText={setPassword}
          style={{ 
            fontFamily: 'SpaceGroteskRegular',
            fontSize: wp(5),
           }}
          secureTextEntry
        />
        {error ? <Text className='text-red-900 mt-2 p-4 text-center bg-red-200 rounded-lg w-full'
        style={{ 
          fontFamily: 'SpaceGroteskRegular',
          fontSize: wp(4),
         
         }}>
          {error}</Text>: null}
        <View>
              <TouchableOpacity className='bg-pink-300  mx-auto mt-5 py-4 px-10 rounded-xl w-[45%]'>
              <Text className='font-semibold text-center' style={{ 
              fontFamily: 'SpaceGroteskSemiBold',
              fontSize: wp(5),
               }}
               onPress={handleLogin} 
               >Login</Text>
                
               </TouchableOpacity>
                <Text className='text-center  mt-4'style={{ 
              fontFamily: 'SpaceGroteskSemiBold',
              fontSize: wp(5),
               }}
               >Don't you have an account? <Text className='text-blue-500 underline'
               onPress={() => navigation.navigate('Register')} 
               >Register</Text></Text>
           </View>
     </View>
      </View>
    </SafeAreaView>
  )
}

export default Login