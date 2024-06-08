import { Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../context/Authcontext'

export default function Home() {
  const { onLogout, authState } = useAuth();
  const { token } = authState;
  const user = token ? token : 'No User';

  return (
    <View>
      <Text>{user}</Text>
    </View>
  )
}