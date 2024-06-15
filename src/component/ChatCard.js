import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useEffect, useState } from 'react';

export default function ChatCard({ entry }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await fetch('API_URL');
  //       const data = await response.json();
  //       setMessages(data.results);
  //       console.log(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchMessages();
  // }, []);

  const handleSendMsg = async () => {
    if (inputText.trim() === '') return;

    try {
      const response = await fetch('API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });
      const data = await response.json();
      setMessages([...messages, data]);
      setInputText('');
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.circle}>
          <ImageBackground 
            source={{ uri: entry.picture.medium }} 
            style={styles.image}
            imageStyle={{ borderRadius: wp(10) }}  
          />
        </View>
        <Text style={styles.text}>{entry.name.first}</Text>
      </View>
      <View style={styles.messageContainer}>
        <ScrollView style={styles.scrollMsgContainer} showsVerticalScrollIndicator={false}>
          {messages.map((msg, index) => (
            <View key={index} style={styles.messageWrapper}>
              <View style={msg.sender === 'me' ? styles.sender : styles.receiver}>
                <Text style={styles.messageText}>{msg.message}</Text>
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
