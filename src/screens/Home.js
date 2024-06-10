import { Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useAuth } from '../context/Authcontext'
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import CarouselCard from '../component/CarouselCard';

export default function Home() {
  const { onLogout, authState } = useAuth();
  const { token } = authState;
  const user = token ? token : 'No User';

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/?results=10'); 
        const data = await response.json();
        setEntries(data.results); 
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchEntries();
  }, [user]);

  return (
    <View style={{ 
      flex: 1,
      backgroundColor: 'pink'
     }}>
     
      <View className='flex-row justify-end pr-4 pt-4'>
        <Ionicons name='notifications-circle-outline' size='45'    title="Notification" 
        style={{ 
          color: 'black'
         }} />
      </View>
      <View className='flex-row justify-center items-center '>
        <Text style={{ 
          fontFamily: 'SpaceGroteskBold',
          fontSize: 26,
          fontWeight: 'bold',
         }}>🔥Find Your PlayBuddy🔥</Text>
        </View>
      <View>
      <Carousel 
          data={entries}
          renderItem={({ item }) => <CarouselCard entry={item} />}
          sliderWidth={430}
          itemWidth={300}
          firstItem={1}
          inactiveSlideScale={0.8}
          inactiveSlideOpacity={0.7}
          loop={true}
          activeSlideAlignment={'center'}
          slideStyle={{ alignItems: 'center',justifyContent:'center', display: 'flex' }}
        />
      </View>
      <View className='flex-row justify-around items-center'>
        <Ionicons name='heart-dislike-circle' size='65' title="Dislike" 
        style={{ 
          color: 'red'
         }} />
         <Ionicons name='heart-circle-outline' size='65' title="Like" style={{
            color: 'green'
         }}/>
         </View>
    
    </View>
  )
}