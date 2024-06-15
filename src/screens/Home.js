import { Text, View, Image, StyleSheet,FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/Authcontext';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import CarouselCard from '../component/CarouselCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    <View style={styles.container}>
      <View style={styles.notificationIcon}>
        <Ionicons name='notifications-circle-outline' size={hp(5)} style={styles.icon} />
      </View>
      <View>
        <Carousel
          data={entries}
          renderItem={({ item }) => <CarouselCard entry={item} />}
          sliderWidth={wp(100)}
          itemWidth={wp(80)}
          inactiveSlideScale={0.8}
          inactiveSlideOpacity={0.7}
          loop={true}
          activeSlideAlignment={'center'}
          slideStyle={styles.carouselSlide}
        />
      </View>
      <View style={styles.actionIcons}>
        <Ionicons name='heart-dislike-circle-sharp' size={hp(8)} style={styles.dislikeIcon} />
        <Ionicons name='heart-circle-sharp' size={hp(8)} style={styles.likeIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
    paddingTop: hp(1),
  },
  notificationIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: wp(4),
  
  },
  icon: {
    color: 'black',
  },
  carouselSlide: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue'
    
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: hp(10),
    marginTop: hp(0),
  
  },
  dislikeIcon: {
    color: 'red',
  
  },
  likeIcon: {
    color: 'green',
  },
});
