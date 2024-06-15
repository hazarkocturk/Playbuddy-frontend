import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CarouselCard = ({ entry }) => {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: entry.picture.large }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{entry.name.first} {entry.name.last}, {entry.dob.age}</Text>
        <Text style={styles.text}>{entry.location.city}, {entry.location.country}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: wp(2),

    borderRadius: wp(2),
    overflow: 'hidden',
    width: wp(90),
    height: hp(65),
    
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2),
    position: 'absolute',
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: wp(2),
    borderRadius: wp(2),
    position: 'absolute',
    bottom: hp(5),
    left: wp(2.5),
    right: wp(2.5),
  },
  text: {
    color: 'white',
    fontFamily: 'SpaceGroteskRegular',
    marginTop: hp(1),
    fontSize: wp(4),
    textAlign: 'center',
  },
});

export default React.memo(CarouselCard);
