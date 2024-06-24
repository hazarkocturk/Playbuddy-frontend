import { View, Text, StyleSheet, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Matches from '../component/Matches';
import Chatdetails from '../component/Chatdetails';
import { useAuth } from '../context/Authcontext';
import ChatCard from '../component/ChatCard';
import { Ionicons } from '@expo/vector-icons';

export default function Chatscreen() {
  const { authState } = useAuth();
  const { token, username, user_id, email, profile_picture } = authState;

  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [chatModal, setChatModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [users, setUsers] = useState([]);

  const handleChatModal = (entry) => {
    setSelectedEntry(entry);
    setChatModal(true);
  };

  const closeModal = () => {
    setChatModal(false);
    setSelectedEntry(null);
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`https://playbuddy-3198da0e5cb7.herokuapp.com/api/matches/${user_id}`);
        const data = await response.json();
        console.log('Matches:', data);
        console.log('User ID:', user_id);

        const filteredData = data.filter((entry) => entry.user_1_id === user_id || entry.user_2_id === user_id);
        console.log('Filtered Matches:', filteredData);

        setEntries(filteredData);
        setAllEntries(filteredData);
       
      } catch (error) {
        console.error(error);
      }
    };
    fetchEntries();
  }, [user_id]);

  useEffect(() => {
    const fetchUserEntries = async () => {
      try {
        const response = await fetch('https://playbuddy-3198da0e5cb7.herokuapp.com/api/users');
        const data = await response.json();
        const filteredData = data.filter((entry) => entry.email !== email);
        console.log('Users:', filteredData);
        setUsers(filteredData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUserEntries();
  }, []);

  const getUsernameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : 'Unknown';
  };

  const getProfilePictureById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.profile_picture : 'Unknown';
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text === '') {
      setEntries(allEntries);
    } else {
      const filteredEntries = allEntries.filter((entry) => {
        const user_2_name = getUsernameById(entry.user_2_id);
        return user_2_name.toLowerCase().includes(text.toLowerCase());
      });
      setEntries(filteredEntries);
    }
  };

  const uniqueEntries = entries.filter((entry, index, self) =>
    index === self.findIndex((e) => (e.user_1_id === entry.user_1_id && e.user_2_id === entry.user_2_id) ||
                                     (e.user_1_id === entry.user_2_id && e.user_2_id === entry.user_1_id))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Matches</Text>
      <View style={styles.scrollViewContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scrollViewContent}
        >
          {uniqueEntries?.map((entry, index) => (
            <TouchableOpacity key={index} onPress={() => handleChatModal(entry)}>
              <Matches entry={entry} username={getUsernameById(entry.user_1_id === user_id ? entry.user_2_id : entry.user_1_id)} 
              profile_picture={getProfilePictureById(entry.user_1_id === user_id ? entry.user_2_id : entry.user_1_id)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.searchBarContainer}>
        <TextInput 
          placeholder='Search' 
          placeholderTextColor={'#64748B'}
          style={styles.searchBar}
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <View>
        <ScrollView>
          {uniqueEntries?.map((entry, index) => (
            <TouchableOpacity key={index} onPress={() => handleChatModal(entry)}>
              <Chatdetails entry={entry} username={getUsernameById(entry.user_1_id === user_id ? entry.user_2_id : entry.user_1_id)}
              profile_picture={getProfilePictureById(entry.user_1_id === user_id ? entry.user_2_id : entry.user_1_id)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedEntry && (
        
        <Modal visible={chatModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            
            <ChatCard entry={selectedEntry} username={getUsernameById(selectedEntry.user_1_id === user_id ? selectedEntry.user_2_id : selectedEntry.user_1_id)}
            profile_picture={getProfilePictureById(selectedEntry.user_1_id === user_id ? selectedEntry.user_2_id : selectedEntry.user_1_id)}
             />
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
  scrollViewContainer: {
    padding: wp(2),
  },
  scrollViewContent: {
    flexDirection: 'row',
  },
  text: {
    fontSize: wp(5),
    fontFamily: 'SpaceGroteskBold',
    textAlign: 'left',
    marginTop: hp(1),
    marginLeft: wp(2),
  },
  searchBarContainer: {
    paddingBottom: wp(1),
    paddingHorizontal: wp(2),
  },
  searchBar: {
    backgroundColor: '#F1F5F9',
    borderRadius: wp(2),
    height: hp(5),
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'relative',
  },
  closeButton: {
    marginTop: hp(2),
    backgroundColor: 'grey',
    padding: hp(1),
    borderRadius: wp(10),
    position: 'absolute',
    top: hp(8),
    right: wp(5),
  },
  closeButtonText: {
    fontSize: wp(4),
    color: '#000',
  },
});
