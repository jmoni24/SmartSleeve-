import * as React from 'react';
import CalibrationScreen from '../screens/CalibrationScreen';
import HomeScreen from "../screens/HomeScreen";
import FAQScreen from "../screens/FAQScreen";
import HistoryScreen from "../screens/HistoryScreen";
import AboutUsScreen from "../screens/AboutUsScreen";

import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

const AppStack = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{headerShown: false}}>
            <Drawer.Screen name="Calibration" component={CalibrationScreen} options={{
                drawerIcon: ({color}) => (
                    <Ionicons name='hammer' size={22} color={color} />
                )
            }}/>
            <Drawer.Screen name="Home" component={HomeScreen} options={{
                drawerIcon: ({color}) => (
                    <Ionicons name='home' size={22} color={color} />
                )
            }}/>
            <Drawer.Screen name="History" component={HistoryScreen} options={{
                drawerIcon: ({color}) => (
                    <Ionicons name='document' size={22} color={color} />
                )
            }}/>
            <Drawer.Screen name="FAQ" component={FAQScreen} options={{
                drawerIcon: ({color}) => (
                    <Ionicons name='help' size={22} color={color} />
                )
            }}/>
            <Drawer.Screen name="About Us" component={AboutUsScreen} options={{
                drawerIcon: ({color}) => (
                    <Ionicons name='people' size={22} color={color} />
                )
            }}/>
        </Drawer.Navigator>
    );
};

export default AppStack;