import { View, Text, Platform, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Dimensions } from 'react-native';

const android = Platform.OS === 'android'
const { height, width } = Dimensions.get('window')

export default function Chatscreen() {
  return (
    <SafeAreaView
    style={{
      paddingTop: android ? hp(3) : 0,
    }} >
     
      { /* header */}
      <View className='px-4' >
        <Text className="uppercase font-semibold text-neutral-500 tracking-wider">
        Buddies 
        </Text>
      </View>

      { /* matches */}

      { /* search bar */}

      <View
      className='mx-4 mt-4 flex-row items-center rounded-2xl bg-neutral-200 px-3 py-2'
      >
        <TextInput
          placeholder='Search'
          placeholderTextColor={"gray"}
          style={{
            fontSize: hp(1.7)
          }}
          className='flex-1 text-base mb-1 pl-1 tracking-widest'
          >
        
          
        </TextInput>
      </View>
    </SafeAreaView>
  )
}