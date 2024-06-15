import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Matches({ entry }) {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <ImageBackground 
          source={{ uri: entry.picture.medium }} 
          style={styles.image}
          imageStyle={{ borderRadius: wp(10) }}  
        />
      </View>
      <Text style={styles.text}>{entry.name.first}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: wp(2), 
    alignItems: 'center',
    
    height: hp(15),
    justifyContent: 'center', 
    padding: wp(2),
    
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
  text: {
    fontSize: wp(4),
    marginTop: hp(1), 
    textAlign: 'center',
  },
});
