import React, {useContext} from 'react'
import {TouchableOpacity, Image, View, Text, ImageBackground} from 'react-native';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

const CustomDrawer = (props) => {

    const {logout} = useContext(AuthContext);
    const {userInfo} = useContext(AuthContext);

    return (
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}
            contentContainerStyle={{backgroundColor: '#000D37'}}>
                <ImageBackground 
                    source={require('../images/menubkg.png')} 
                    style={{padding:30}}>
                    <Image 
                        source={require('../images/j_ss.png')}
                        style={{left: 40, height: 120, width:120, borderRadius:60, marginBottom:10}}
                    />
                    <Text style={{color:'#fff', fontSize:25, textAlign: 'center'}}>{userInfo.name}</Text>
                </ImageBackground>
                <View style={{backgroundColor:'#fff'}}>
                    <DrawerItemList {...props}/>
                </View>
            </DrawerContentScrollView>
        <View style={{padding:20,borderTopWidth:1, borderTopColor:'#ccc'}}>
            <TouchableOpacity onPress={() => {logout()}} style={{paddingVertical:15}}>
                <View style={{flexDirection:'row', alignItems: 'center'}}>
                <Ionicons name='exit-outline' size={22} />
                <Text style={{fontSize:16}}>  Sign Out</Text>
                </View>
            </TouchableOpacity>
            
        </View>
        </View>
    )
}

export default CustomDrawer