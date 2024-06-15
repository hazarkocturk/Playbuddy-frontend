import { View, Text, ScrollView, ImageBackground } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function Chatdetails({entry}) {
  return (
   <View style={styles.container}>
      <View style={styles.circle}>
        <ImageBackground 
          source={{ uri: entry.picture.medium }} 
          style={styles.image}
          imageStyle={{ borderRadius: wp(10) }}  
        />
      </View>
      <View style={styles.textContainer}>
      <Text style={styles.text}>{entry.name.first}
      </Text>
      <Text>
        last message...
      </Text>
      </View>
      <View>
        
      </View>
    </View>
  )
}

const styles = {
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    height: hp(10),
    marginTop: hp(1),
    marginLeft : wp(2),
    marginRight : wp(2),
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
  textContainer:{
    marginLeft : wp(2),
    display : 'flex',
    flexDirection:'column',
    justifyContent : 'flex-start',
    alignItems : 'flex-start',
    gap : hp(2),
    
  },
  text: {
    fontSize: wp(4),
  },
}