import { View, Text, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useAuth } from '../context/Authcontext';

export default function Chatdetails({ entry, username, profile_picture }) {
  const [messages, setMessages] = useState([]);
  const { authState } = useAuth();
  const { user_id } = authState;

  const fetchMessages = async () => {
    try {
      const response = await fetch(`https://playbuddy-3198da0e5cb7.herokuapp.com/api/messages/conversation/${user_id}/${entry.user_1_id}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages(); 
    const intervalId = setInterval(fetchMessages, 5000); 

    return () => clearInterval(intervalId); 
  }, [user_id, entry.user_1_id]);

  const lastMessage = messages[messages.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <ImageBackground 
          source={{ uri: profile_picture }} 
          style={styles.image}
          imageStyle={{ borderRadius: wp(10) }}  
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{username}</Text>
        <Text>{lastMessage ? lastMessage.message : 'No messages yet'}</Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    height: hp(10),
    marginTop: hp(1),
    marginLeft: wp(2),
    marginRight: wp(2),
    borderRadius: wp(2),
    alignItems: 'center',
    paddingLeft: wp(2),
  },
  circle: {
    borderRadius: wp(10),
    width: wp(20),
    height: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: wp(10),
  },
  textContainer: {
    marginLeft: wp(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: hp(2),
  },
  text: {
    fontSize: wp(4),
  },
};
