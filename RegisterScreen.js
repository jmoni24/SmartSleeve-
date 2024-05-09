import * as React from 'react';
import {useState, useContext, useRef} from 'react';
import { SafeAreaView, StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const inputRef = useRef(null);

  const handleRegister = () => {
    if (password !== confirmPassword) {
        // Passwords don't match
        console.error('Passwords do not match');
        return;
    }

    try {
        // Call the register function with user registration data
        register(name, username, password);
        console.log('Registration successful');
    } catch (error) {
        console.error('Registration failed:', error);
    }
}

    return(  
    <SafeAreaView style={styles.screenView}>

      <View>
        <Text style={styles.registerH}>Create Account</Text>
      </View>

      <View>
        <TouchableOpacity style={styles.NRB} onPress={() => inputRef.current.focus()}>
          <Ionicons name="person-outline" size={30} color="black" style={styles.icon} />
          <TextInput ref={inputRef} style={styles.input} placeholder="Full Name" value={name} onChangeText={setName}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.URB} onPress={() => inputRef.current.focus()}>
          <Ionicons name="mail-outline" size={30} color="black" style={styles.icon} />
          <TextInput ref={inputRef} style={styles.input} placeholder="Email" value={username} onChangeText={setUsername}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.PRB} onPress={() => inputRef.current.focus()}>
          <Ionicons name="key-outline" size={30} color="black" style={styles.icon} />
          <TextInput ref={inputRef} style={styles.input} placeholder="Password" value={password} onChangeText={setPassword}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.P2RB} onPress={() => inputRef.current.focus()}>
          <Ionicons name="key-outline" size={30} color="black" style={styles.icon} />
          <TextInput ref={inputRef} style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword}/>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>SIGN UP     </Text>
          <Ionicons name='arrow-forward' size={22} color='#00008b'/>
        </TouchableOpacity>
      </View>

      <View>
        <Image style={styles.logoRegister} 
          resizeMode="contain" source={require('../images/logo_ss.png')} />
        <Image style={styles.bnameRegister} 
          resizeMode="contain" source={require('../images/bname_ss.png')} />
      </View>

      <View style={{flexDirection:'row'}}>
        <Text style={styles.AOT}>Already have an account? </Text>
        <Text style={styles.registertext} onPress={() => navigation.navigate('Login')}>Sign In</Text>
      </View>

      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  screenView: {flex:1, backgroundColor: '#99cefa', alignItems:'center', justifyContent: 'center'},
  
  logoRegister: {bottom: 540, left: -90,width: 100, height: 140},

  bnameRegister: {left: 5, bottom:540, position: 'absolute', width: 200, height: 140},

  registerH: {top:50, right:0, fontSize:35, fontWeight: 'bold'},

  registerButton: {flexDirection:'row', padding: 20, alignText: 'center', alignItems: 'center', justifyContent: 'center', 
                    borderRadius:50, left:55, top: 150, width:150, height:65, backgroundColor: '#f8f8ff'},
  icon: {right:0, top:4},
  input: {flex: 1,fontSize: 20,padding: 10,},
  NRB: {flexDirection: 'row',paddingLeft:10, fontSize: 20, height: 60, width:250, margin:12, padding: 10, top:80,
        backgroundColor: 'white', shadowOpacity: 0.5, shadowRadius: 3, 
        shadowOffset:{height:5, width:5}},
  URB: {flexDirection: 'row',paddingLeft:10, fontSize: 20, height: 60, width:250, margin:12, padding: 10, top:120,
          backgroundColor: 'white', shadowOpacity: 0.5, shadowRadius: 3, 
          shadowOffset:{height:5, width:5}},
  
  PRB: {flexDirection: 'row',paddingLeft:10, fontSize: 20, height: 60, width:250, margin:12, padding: 10, top:120,
         backgroundColor: 'white', shadowOpacity: 0.5, shadowRadius: 3, 
         shadowOffset:{height:5, width:5}},
  
  P2RB: {flexDirection: 'row',paddingLeft:10, fontSize: 20, height: 60, width:250, margin:12, padding: 10, top:120,
         backgroundColor: 'white', shadowOpacity: 0.5, shadowRadius: 3, 
         shadowOffset:{height:5, width:5}},

  registertext: {top:100, fontSize: 16, color: '#00008b', fontWeight: 'bold'},

  AOT: {top: 100, fontSize: 16, color: '#696969'},

  buttonText: {left:15, fontSize:18, fontWeight: 'bold', color: '#00008b'}
  }
  );