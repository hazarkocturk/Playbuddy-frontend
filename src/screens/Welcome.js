import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import { ArrowUpRightIcon } from "react-native-heroicons/outline";
import { useAuth } from '../context/Authcontext'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default function Welcome() {

  const { onLogout, authState } = useAuth();

  const navigation = useNavigation();

  const [fontsLoaded, fontError] = useFonts({
    SpaceGroteskBold: require('../fonts/SpaceGrotesk-Bold.ttf'),
    SpaceGroteskSemibold: require('../fonts/SpaceGrotesk-SemiBold.ttf'),
    SpaceGrotestMedium: require('../fonts/SpaceGrotesk-Medium.ttf'),
    SpaceGroteskRegular: require('../fonts/SpaceGrotesk-Regular.ttf'),
    SpaceGroteskLight: require('../fonts/SpaceGrotesk-Light.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}
    className='flex-1 bg-slate-200'
    style={
      {
        width: wp(100)
      }
    }>
      <View 
      style={{ 
        width: wp(100), 
        height: hp(100)
       }}>
        <View  className=" pt-10 justify-center items-center my-4"
          style={{
            width: wp(100),
          }}>
          <Image source={require('../../assets/images/herobanner.jpg')}  style={{ 
            width: wp(100), 
            height: hp(48),
            marginTop: 10,

            resizeMode: 'cover'
           }} 
           />
        </View>
           <View className='w-full px-10 mt-10'>
            <Text className='tracking-widest leading-none text-center'
            style={{ 
              fontFamily: 'SpaceGroteskBold',
              fontSize: wp(10),
             }}>PLAYBUDDY
            </Text>

            <Text className='text-center text-gray-500 mt-2'style={{ 
              fontFamily: 'SpaceGroteskSemiBold',
              fontSize: wp(7),
             }}>Are you nerd and alone?</Text>
               <Text className='text-center text-gray-500 mt-2'style={{ 
              fontFamily: 'SpaceGroteskSemiBold',
              fontSize: wp(7),
             }}>Find your player2</Text>
           </View>
           <View>
              <TouchableOpacity className='flex-row bg-pink-300  mx-auto mt-10 py-4 px-4 rounded-xl justify-around items-center w-[45%]'>
              <Text className='font-semibold' style={{ 
              fontFamily: 'SpaceGroteskSemiBold',
              fontSize: wp(5),
               }}
               onPress={() => authState?.authenticated ? navigation.navigate('Main') : navigation.navigate('Login')}
               >Get Started</Text>
                <ArrowUpRightIcon color={"black"} size={20} strokeWidth={2.5} />
               </TouchableOpacity>

           </View>




        </View>
        
    </View>
  );
}
