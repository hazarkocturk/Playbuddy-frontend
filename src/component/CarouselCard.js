import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import React from 'react';

const CarouselCard = ({ entry }) =>{
  return (
    <ImageBackground
      source={{ uri: entry.picture.large }}
      style={styles.imageBackground}
      imageStyle={styles.image}
    >
      <View style={styles.textContainer}>
        <Text style={styles.text}>{entry.name.first} {entry.name.last}, {entry.dob.age}</Text>
        <Text style={styles.text}>{entry.location.city}, {entry.location.country}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: 300,
    height: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 5,
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 5,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    
  },
  text: {
    color: 'white',
    fontFamily:'SpaceGroteskRegular',
    marginTop: 5,
    fontSize: 18,
  },
});

export default React.memo(CarouselCard);
