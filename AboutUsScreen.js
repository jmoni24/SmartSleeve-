import * as React from 'react';
import { SafeAreaView, Image, TouchableOpacity, StyleSheet, View, Text} from 'react-native';


export default function AboutUsScreen ({navigation}){
    
  return(
    <SafeAreaView style={styles.screenView}>
      <View>
        <TouchableOpacity onPress={()=>navigation.openDrawer()}>
          <Image style={styles.profile_pic} resizeMode="contain" source={require('../images/j_ss.png')} />
        </TouchableOpacity>
    </View>
    <View>
      <Text style={styles.founder_text}> Meet the Founders</Text>
      <Image style={styles.jf_image} resizeMode="contain" source={require('../images/j_ss.png')}/>
      <Image style={styles.gf_image} resizeMode="contain" source={require('../images/g_ss.png')}/>
      <Image style={styles.af_image} resizeMode="contain" source={require('../images/a_ss.png')}/>
      <Image style={styles.pf_image} resizeMode="contain" source={require('../images/p_ss.png')}/>
    </View>

    <View>
      <Text style={styles.founder_desc}> Jamie Moni{'\n'}BSE in Bioengineering{'\n'}UPenn '24{'\n'}{'\n'}{'\n'}</Text>
      <Text style={styles.founder_desc}> Gautham Nair{'\n'}BSE in Bioengineering{'\n'}UPenn '24{'\n'}{'\n'}{'\n'}</Text>
      <Text style={styles.founder_desc}> Ajit Saran{'\n'}BSE in Bioengineering{'\n'}UPenn '24{'\n'}{'\n'}{'\n'}</Text>
      <Text style={styles.founder_desc}> Pavan Raghupathy{'\n'}BSE in Bioengineering{'\n'}UPenn '24</Text>
    </View>
  </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    screenView: {flex:1, backgroundColor: '#99cefa', alignItems:'center', justifyContent: 'center'},
    profile_pic: {bottom:-140, left:150,width: 80, height: 80, borderRadius: 50, borderWidth:2, borderColor: 'black'},
    founder_text: {fontSize: 30, fontWeight: 'bold',top: 150, left:-70},
    founder_desc:{fontSize:20, top:-280, right: -60, textAlign:'center'},
    jf_image: {height: 120, width:120, top:160, right:50, borderRadius: 30, borderWidth:2, borderColor: 'black'},
    gf_image: {height: 120, width:120, top:180, right: 50, borderRadius: 30, borderWidth:2, borderColor: 'black'},
    af_image: {height: 120, width:120, top:200, right: 50, borderRadius: 30, borderWidth:2, borderColor: 'black'},
    pf_image: {height: 120, width:120, top:220, right: 50, borderRadius: 30, borderWidth:2, borderColor: 'black'}
  });