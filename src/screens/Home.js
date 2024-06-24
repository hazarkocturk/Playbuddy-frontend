import { Text, View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/Authcontext';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import CarouselCard from '../component/CarouselCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const formatDate = (date) => {
  const pad = (num) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function Home() {
  const { onLogout, authState } = useAuth();
  const { token, username, user_id, email, profile_picture } = authState;

  const [entries, setEntries] = useState([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('https://playbuddy-3198da0e5cb7.herokuapp.com/api/users');
        const data = await response.json();
        const filteredData = data.filter((entry) => entry.email !== email);
        setEntries(filteredData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchEntries();
  }, [email]);

  const likeActiveUser = async () => {
    const activeUserId = entries.length > 0 ? entries[activeSlideIndex].id : null;
    if (!activeUserId) return;

    console.log('Like Active User:', activeUserId);
    console.log('User ID:', user_id);
    try {
      const formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('swiped_on_id', activeUserId);
      formData.append('direction', 'right');
      formData.append('time', formatDate(new Date()));
      console.log('Form Data:', formData);

      const response = await fetch(`https://playbuddy-3198da0e5cb7.herokuapp.com/api/swipes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      console.log('Swipe right response:', data);
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  const dislikeActiveUser = async () => {
    const activeUserId = entries.length > 0 ? entries[activeSlideIndex].id : null;
    if (!activeUserId) return;

    console.log('Dislike Active User:', activeUserId);
    console.log('User ID:', user_id);
    try {
      const formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('swiped_on_id', activeUserId);
      formData.append('direction', 'left');
      formData.append('time', formatDate(new Date()));
      console.log('Form Data:', formData);

      const response = await fetch(`https://playbuddy-3198da0e5cb7.herokuapp.com/api/swipes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      console.log('Swipe left response:', data);
    } catch (error) {
      console.error('Error disliking user:', error);
    }
  };

  const handleSnapToItem = (index) => {
    setActiveSlideIndex(index);
  };

  const activeUserId = entries.length > 0 ? entries[activeSlideIndex].id : null;
  

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
          onSnapToItem={handleSnapToItem}
        />
      </View>
      <View style={styles.actionIcons}>
        <Ionicons name='heart-dislike-circle-sharp' size={hp(8)} style={styles.dislikeIcon} onPress={dislikeActiveUser} />
        <Ionicons name='heart-circle-sharp' size={hp(8)} style={styles.likeIcon} onPress={likeActiveUser} />
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
    backgroundColor: 'blue',
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
