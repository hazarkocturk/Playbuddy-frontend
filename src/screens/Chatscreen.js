import { View, Text, StyleSheet, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Matches from '../component/Matches';
import Chatdetails from '../component/Chatdetails';
import { useAuth } from '../context/Authcontext';
import ChatCard from '../component/ChatCard';
import { Ionicons } from '@expo/vector-icons';

export default function Chatscreen() {
  const { onLogout, authState } = useAuth();
  const { token } = authState;
  const user = token ? token : 'No User';

  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [chatModal, setChatModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleChatModal = (entry) => {
    setSelectedEntry(entry);
    setChatModal(true);
  }

  const closeModal = () => {
    setChatModal(false);
    setSelectedEntry(null);
  }

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/?results=10');
        const data = await response.json();
        setEntries(data.results);
        setAllEntries(data.results); 
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEntries();
  }, [user]);

  const handleSearch = (text) => {
    setSearch(text);
    if (text === '') {
      setEntries(allEntries); 
    } else {
      const filteredEntries = allEntries.filter((entry) => {
        return entry.name.first.toLowerCase().includes(text.toLowerCase());
      });
      setEntries(filteredEntries);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Matches</Text>
      <View style={styles.scrollViewContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scrollViewContent}
        >
          {entries?.map((entry, index) => (
            <TouchableOpacity key={index} onPress={()=>handleChatModal(entry)}>
            <Matches  entry={entry}  />
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
          {entries?.map((entry, index) => (
            <TouchableOpacity key={index} onPress={() => handleChatModal(entry)}>
              <Chatdetails entry={entry} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedEntry && (
        <Modal visible={chatModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <ChatCard entry={selectedEntry} />
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="black"  />
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
