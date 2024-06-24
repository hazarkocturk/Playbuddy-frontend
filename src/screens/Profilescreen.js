import { View, Text, Image, ScrollView, Modal, TouchableOpacity, TextInput, StyleSheet, Platform, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

export default function Profilescreen() {
  const { onLogout, authState } = useAuth();
  const { token, username: initialUsername, user_id, email, profile_picture } = authState;
  const [modalVisible, setModalVisible] = useState(false);
  const [model2, setModel2] = useState(false);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [games, setGames] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [skill_level, setSkill_level] = useState('');
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState(initialUsername);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://playbuddy-3198da0e5cb7.herokuapp.com/api/users/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log('Data:', data);
        setBio(data.bio);
        setLocation(data.location);
        setGames(data.games);
        setPlatforms(data.platforms);
        setSkill_level(data.skill_level);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [user_id, token]);

  const gamesArray = games.split(",");
  const platformsArray = platforms.split(",");

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      let { uri } = result.assets[0];
      console.log('Original URI:', uri);

      if (Platform.OS === 'android' && !uri.startsWith('file://')) {
        uri = 'file://' + uri;
      }
      console.log('Processed URI:', uri);

      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800, height: 600 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        setPhoto({
          uri: manipulatedImage.uri,
          name: `profile_picture.jpg`,
          type: `image/jpeg`
        });

        console.log('Photo:', manipulatedImage);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to resize image. Please try again.');
      }
    }
  };

  const handleUpdatePhoto = async () => {
    if (!photo) {
      console.error('No photo to upload');
      return;
    }

    try {
      console.log(user_id, token, photo);
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: photo.uri,
        type: photo.type,
        name: photo.name,
      });

      const response = await fetch(`https://playbuddy-3198da0e5cb7.herokuapp.com/api/users/${user_id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setModalVisible(false);
        Alert.alert('Success', 'Profile picture updated successfully.');
      } else {
        console.error('Error:', data);
        Alert.alert('Error', 'Failed to update profile picture.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    }
  };

  const cancelUpdatePhoto = () => {
    setPhoto(null);
    setModalVisible(false);
  };

  const handleUpdateInfo = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('bio', bio);
      formData.append('location', location);
      formData.append('games', games);
      formData.append('platforms', platforms);
      formData.append('skill_level', skill_level);

      const response = await fetch(`https://playbuddy-3198da0e5cb7.herokuapp.com/api/users/${user_id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully.');
        setModel2(false);
      } else {
        console.error('Error:', data);
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const defaultTags = ["Dota2", "CS:GO", "Valorant", "PUBG", "LOL", "R6", "World of Warcraft"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={profile_picture ? { uri: profile_picture } : require("../../assets/images/kalafat.png")}
          style={styles.profileImage}
        />
        <View style={styles.crownIcon}>
          <Text style={styles.crownText}>👑</Text>
        </View>
        <View style={styles.cameraIcon}>
          <Ionicons
            name="camera-reverse-outline"
            size={hp(5)}
            color="white"
            title="Camera"
            onPress={() => setModalVisible(true)}
          />
          <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Upload a new photo</Text>
                <View style={styles.modalButtonContainer}>
                  {photo ? (
                    <>
                      <TouchableOpacity onPress={handleUpdatePhoto} style={styles.modalButton}>
                        <Ionicons name="checkmark-circle" size={hp(5)} color="white" title="Upload" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={cancelUpdatePhoto} style={styles.modalButton}>
                        <Ionicons name="close-circle" size={hp(5)} color="white" title="Close" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity onPress={handlePickImage} style={styles.modalButton}>
                        <Ionicons name="image" size={hp(5)} color="white" title="Upload" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={cancelUpdatePhoto} style={styles.modalButton}>
                        <Ionicons name="close-circle" size={hp(5)} color="white" title="Close" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>
            {username ? username : 'Homeless User'}, {skill_level ? skill_level : 'Unknown'}
          </Text>
          <View style={styles.editIcon}>
            <Ionicons
              name="pencil-outline"
              size={hp(4)}
              title="Edit"
              color="white"
              onPress={() => setModel2(true)}
            />
            <Modal visible={model2} animationType="slide" transparent={true}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Edit your profile</Text>
                  <TextInput placeholder="Name" value={username} onChangeText={(text) => setUsername(text)} style={styles.input} />
                  <TextInput placeholder="City" value={location} onChangeText={(text) => setLocation(text)} style={styles.input} />
                  <TextInput placeholder="Tags" value={games} onChangeText={(text) => setGames(text)} style={styles.input} />
                  <TextInput placeholder="Tags" value={platforms} onChangeText={(text) => setPlatforms(text)} style={styles.input} />
                  <TextInput placeholder="Tags" value={bio} onChangeText={(text) => setBio(text)} style={styles.input} />
                  <TextInput placeholder="Tags" value={skill_level} onChangeText={(text) => setSkill_level(text)} style={styles.input} />
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleUpdateInfo}>
                      <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModel2(false)}>
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            {location}
          </Text>
        </View>
        <View style={styles.tagsContainer}>
          {(gamesArray.length > 0 ? gamesArray : defaultTags).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {(platformsArray.length > 0 ? platformsArray : defaultTags).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: wp(100),
    height: hp(50),
    resizeMode: "cover",
    borderBottomRightRadius: wp(5),
    borderBottomLeftRadius: wp(5),
  },
  crownIcon: {
    position: "absolute",
    top: hp(2),
    left: wp(4),
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  crownText: {
    fontSize: hp(4),
  },
  cameraIcon: {
    position: "absolute",
    top: hp(2),
    right: wp(4),
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: wp(80),
    padding: wp(5),
    backgroundColor: "white",
    borderRadius: wp(5),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: wp(5),
    fontWeight: "bold",
    marginBottom: hp(2),
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(60),
    marginTop: hp(2),
  },
  modalButton: {
    backgroundColor: "gray",
    padding: wp(3),
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
    margin: wp(1),
  },
  infoContainer: {
    padding: wp(5),
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontFamily: "SpaceGroteskBold",
    fontSize: wp(6.5),
    fontWeight: "bold",
  },
  editIcon: {
    backgroundColor: "gray",
    borderRadius: wp(6),
    padding: wp(2),
    opacity: 0.5,
  },
  input: {
    padding: wp(3),
    margin: wp(2),
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: wp(2),
    width: wp(70),
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: wp(3),
    borderRadius: wp(2),
    margin: wp(2),
  },
  closeButton: {
    backgroundColor: "#f44336",
    padding: wp(3),
    borderRadius: wp(2),
    margin: wp(2),
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  locationContainer: {
    paddingLeft: wp(5),
    marginTop: hp(2),
  },
  locationText: {
    fontFamily: "SpaceGroteskRegular",
    fontSize: wp(5),
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: wp(2),
    marginTop: hp(2),
  },
  tag: {
    backgroundColor: "gray",
    opacity: 0.7,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    margin: wp(1),
  },
  tagText: {
    fontFamily: "SpaceGroteskRegular",
    fontSize: wp(4),
    fontWeight: "bold",
    color: "white",
  },
});
