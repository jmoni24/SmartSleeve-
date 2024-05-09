import * as React from 'react';
import {useContext, useState, useRef} from 'react';
import { View, StyleSheet, Image, SafeAreaView, Text, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const {login} = useContext(AuthContext);
    const inputRef = useRef(null);
    
    return(  
      <SafeAreaView style={styles.screenView}>
        <View>
          <Text style={styles.loginH}>Login</Text>
          <Text style={styles.loginS}>Please sign in to continue.</Text>
        </View>

        <View>
          <TouchableOpacity style={styles.USIB} onPress={() => inputRef.current.focus()}>
            <Ionicons name="mail-outline" size={30} color="black" style={styles.icon} />
            <TextInput ref={inputRef} style={styles.input} placeholder="Email" value={username} onChangeText={setUsername}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.PSIB} onPress={() => inputRef.current.focus()}>
            <Ionicons name="key-outline" size={30} color="black" style={styles.icon} />
            <TextInput ref={inputRef} style={styles.input} placeholder="Password" value={password} onChangeText={setPassword}/>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style={styles.loginButton} onPress={() => {login(username, password)}} > 
          <Text style={styles.buttonText}>LOGIN     </Text>
          <Ionicons name='arrow-forward' size={22} color='#00008b'/>
        </TouchableOpacity>
        </View>

        <View style={{flexDirection:'row'}}>
          <Text style={styles.NOT}>Don't have an account?</Text>
          <Text style={styles.signuptext} onPress={() => navigation.navigate('Register')}> Sign Up</Text>
        </View>
        
        <View>
          <Image style={styles.logoSignIn} 
            resizeMode="contain" source={require('../images/logo_ss.png')} />
          <Image style={styles.bnameSignIn} 
            resizeMode="contain" source={require('../images/bname_ss.png')} />
        </View>
        
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    screenView: {flex:1, backgroundColor: '#99cefa', alignItems:'center', 
                  justifyContent: 'center'},

    logoSignIn: {left:-90, bottom: 480, width: 100, height: 140},
    
    bnameSignIn: {left: 5, position: 'absolute', bottom:480, width: 200, height: 140},
    
    loginH: {top:40, right:15, fontSize:40, fontWeight: 'bold'},

    loginS: {fontSize:20, top: 50, right:15, color: '#696969', fontWeight: 'bold'},

    signuptext: {left:0, top:250, fontSize: 16, color: '#00008b', fontWeight: 'bold'},

    NOT: {left:0,top: 250,fontSize: 16, color: '#696969'},

    icon: {right:0, top:4},
    input: {flex: 1,fontSize: 20,padding: 10,},
    USIB: {flexDirection:'row', paddingLeft:10, fontSize: 20, height: 60, width:250, margin:12, padding: 10, top:100,
             backgroundColor: 'white', shadowOpacity: 0.5, shadowRadius: 3, 
             shadowOffset:{height:5, width:5}},
    
    PSIB: {flexDirection:'row',paddingLeft:10, fontSize: 20, height: 60, width:250, margin:12, padding: 10, top:120,
            backgroundColor: 'white', shadowOpacity: 0.5, shadowRadius: 3, 
            shadowOffset:{height:5, width:5}},

    loginButton: {flexDirection:'row', padding: 20, alignText: 'center', alignItems: 'center', justifyContent: 'center', 
                  borderRadius:50, left:55, top: 150, width:150, height:65, backgroundColor: '#f8f8ff'},
  
    buttonText: {left:15, fontSize:18, fontWeight: 'bold', color: '#00008b'}
  });