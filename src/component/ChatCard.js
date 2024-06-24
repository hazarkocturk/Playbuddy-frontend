import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/Authcontext';

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

const extractHoursAndMinutes = (time) => {
  if (!time) return '';
  if (typeof time === 'object') {
    const date = new Date(time.date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } else if (typeof time === 'string') {
    const parts = time.split(' ');
    if (parts.length < 2) return '';
    const hours = parts[1].slice(0, 2);
    const minutes = parts[1].slice(3, 5);
    return `${hours}:${minutes}`;
  }
  return '';
};

export default function ChatCard({ entry, username, profile_picture }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const { authState } = useAuth();
  const { user_id } = authState;
  const scrollViewRef = useRef();

  const fetchMessages = async () => {
    try {
      const response = await fetch(`https://playbuddy-3198da0e5cb7.herokuapp.com/api/messages/conversation/${entry.user_1_id}/${entry.user_2_id}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [entry, user_id]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMsg = async () => {
    if (inputText.trim() === '') return;

    try {
      const formData = new FormData();
      formData.append('sender_id', user_id);
      formData.append('recipient_id', user_id === entry.user_1_id ? entry.user_2_id : entry.user_1_id);
      formData.append('message', inputText);
      formData.append('time', formatDate(new Date()));

      const response = await fetch('https://playbuddy-3198da0e5cb7.herokuapp.com/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data]);
      await fetchMessages();
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.circle}>
          <ImageBackground 
            source={{ uri: profile_picture }} 
            style={styles.image}
            imageStyle={{ borderRadius: wp(10) }}  
          />
        </View>
        <Text style={styles.text}>{username}</Text>
      </View>
      <View style={styles.messageContainer}>
        <ScrollView 
          style={styles.scrollMsgContainer} 
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => (
            <View key={index} style={styles.messageWrapper}>
              <View style={msg.sender_id === user_id ? styles.sender : styles.receiver}>
                <Text style={styles.messageText}>{msg.message}</Text>
                {msg.time && <Text style={styles.messageTime}>{extractHoursAndMinutes(msg.time)}</Text>}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.messageInput}>
        <TextInput 
          placeholder="Type a message..."
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendMsg}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    width: wp(90),
    backgroundColor: '#F1F5F9',
    marginTop: hp(1),
    marginLeft: wp(2),
    marginRight: wp(2),
    marginBottom: hp(1),
    borderRadius: wp(2),
    padding: wp(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    borderRadius: wp(5),
    width: wp(10),
    height: wp(10), 
    overflow: 'hidden', 
    marginRight: wp(2),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: wp(5),
    fontFamily: 'SpaceGroteskBold',
  },
  messageContainer: {
    marginTop: hp(1),
    flex: 1,
    padding: wp(2),
    backgroundColor: 'white',
    borderRadius: wp(2),
  },
  scrollMsgContainer: {
    flex: 1,
  },
  messageWrapper: {
    marginBottom: hp(1),
  },
  sender: {
    backgroundColor: '#D1E7DD',
    padding: wp(3),
    borderTopRightRadius: wp(4),
    borderBottomLeftRadius: wp(4),
    borderTopLeftRadius: wp(2),
    borderBottomRightRadius: wp(2),
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  receiver: {
    backgroundColor: '#F8D7DA',
    padding: wp(3),
    borderTopLeftRadius: wp(4),
    borderBottomRightRadius: wp(4),
    borderTopRightRadius: wp(2),
    borderBottomLeftRadius: wp(2),
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageText: {
    color: '#0F5132', 
  },
  messageTime: {
    color: '#6c757d', // Light gray color for the timestamp
    fontSize: wp(3),
    alignSelf: 'flex-end',
    marginTop: hp(0.5),
  },
  messageInput: {
    flexDirection: 'row',
    marginTop: hp(1),
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: wp(2),
    padding: wp(2),
    marginRight: wp(2),
  },
  button: {
    backgroundColor: 'pink',
    padding: wp(2),
    borderRadius: wp(2),
  },
  buttonText: {
    color: 'white',
    fontSize: wp(4),
  },
});
