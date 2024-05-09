import * as React from 'react';
import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function FAQScreen ({navigation}){
 
return(
  <SafeAreaView style={styles.screenView}>
    <View>
      <TouchableOpacity onPress={()=>navigation.openDrawer()}>
            <Image style={styles.profile_pic} resizeMode="contain" source={require('../images/j_ss.png')} />
          </TouchableOpacity>
      <Text style={styles.FAQ_header}>Frequently Asked Questions</Text>
      <Text style={styles.infoH_pH}>What is pH?</Text>
      <Text style={styles.infoH_temp}>What does temperature mean for my injury?</Text>
      <Text style={styles.infoH_imp}>What is impedance?</Text>
      <Text style={styles.infoText}>     pH is a way to measure how acidic or basic a substance is. It's a scale from 0 to 14, where
        lower numbers mean something is more acidic, higher numbers mean its more basic, and 7 is
        neutral. The pH of a healthy person's skin is between 4.2 and 5.6. After an infection,
        the pH of the skin will rise above 7.3. {'\n'}{'\n'}{'\n'}{'\n'}
      </Text>
      <Text style={styles.infoText}>     When it comes to checking for an infection if the area around the injury feels warmer
        than usual, it might mean there's inflammation and a possible infection. An increase of 1.8&deg;F
        to 5.4&deg;F from your normal skin temperature can be a cause for concern. {'\n'}{'\n'}{'\n'}
      </Text>
      <Text style={styles.infoText}>     Skin impedance is the skin's resistance to electrical flow. Changes in skin impedance
        may potentially signal an infection due to edema, inflammation or the presence of bacteria. 
        If your impedance is lower than normal, it may be cause for concern.
      </Text>

    </View>
  </SafeAreaView>
  );
}

  const styles = StyleSheet.create({
    FAQ_header: {fontSize: 30, textAlign: 'center', fontWeight: 'bold', textDecorationLine: 'underline', top: -80},
    profile_pic: {top:-90, left: 320, width: 80, height: 80, borderRadius: 50, borderWidth:2, borderColor: 'black'},
    screenView: {flex:1, backgroundColor: '#99cefa', alignItems:'center', justifyContent: 'center'},
    infoH_pH: {fontSize: 20, top: 0, textAlign: 'center', fontWeight: 'bold'},
    infoH_temp: {fontSize: 20, top:160, textAlign: 'center', fontWeight: 'bold'},
    infoH_imp: {fontSize: 20, top: 280, textAlign: 'center', fontWeight: 'bold'},
    scoreH: {fontSize: 20, top: 400, textAlign: 'center', fontWeight: 'bold'},
    infoText: {fontSize: 16, top: -40, textAlign: 'left', paddingRight: 7, paddingLeft:7}
  });