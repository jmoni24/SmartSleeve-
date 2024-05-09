import React, {useContext, useState, useEffect} from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../context/config';
import axios from 'axios';

export default function CalibrationScreen({ navigation }) {   
    const { userToken } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [pHBaseline, setpHBaseline] = useState(null);
    const [tempBaseline, settempBaseline] = useState(null);
    const [impBaseline, setimpBaseline] = useState(null);

    const handleCalibration = async () => {
        setIsLoading(true);
        try {
          // Initialize variables to store total and count for averaging
          let totalPH = 0;
          let totalTemp = 0;
          let totalImp = 0;
          let count = 0;
      
          // Start collecting data from the Raspberry Pi for 10 seconds
    const startTime = Date.now();
    while (Date.now() - startTime < 10000) { // 10000 milliseconds = 10 seconds
      const response = await axios.get('http://10.103.207.143:8000/sensor', {
        timeout: 15000, // Set timeout to 15 seconds
      });

      // Split the concatenated JSON objects
      const dataStrings = response.data.split('}{');
      for (let i = 0; i < dataStrings.length; i++) {
        // Reconstruct the JSON object with proper syntax
        const objString = (i === 0 ? '' : '{') + dataStrings[i] + (i === dataStrings.length - 1 ? '' : '}');
        const obj = JSON.parse(objString);

        // Update the total values and count
        if (obj.pH !== undefined) {
          totalPH += obj.pH;
        }
        if (obj.temp !== undefined) {
          totalTemp += obj.temp;
        }
        if (obj.imp !== undefined) {
          totalImp += obj.imp;
        }
        count++;
      }
    }
      
          // Calculate average values
          console.log(count);
          const avgPH = (totalPH / count*3).toFixed(2);
          const avgTemp = (totalTemp / count * 3).toFixed(2);
          const avgImp = (totalImp / count * 100 / 6).toFixed(2);
      
          // Set the average values as baseline data
          setpHBaseline((avgPH));
          settempBaseline(avgTemp);
          setimpBaseline(avgImp);
          console.log(avgPH);
          console.log(avgTemp);
          console.log(avgImp);
      
          console.log('Baseline data calibrated successfully');
        } catch (error) {
          //console.error('Error calibrating baseline data:', error.message);
          console.log('Failed to calibrate baseline data');
        } finally {
          setIsLoading(false);
        }
    };
    useEffect(() => {
        const sendCalibrationData = async () => {
          try {
            const calibrationData = { pHBaseline, tempBaseline, impBaseline };
            await axios.post(`${BASE_URL}/api/calibrate`, calibrationData, { headers: { Authorization: userToken } });
            console.log('Baseline data calibrated successfully');
          } catch (error) {
            //console.error('Error calibrating baseline data:', error.message);
            console.log('Failed to calibrate baseline data');
          } finally {
            setIsLoading(false);
          }
        };
        
        if (pHBaseline !== null && tempBaseline !== null && impBaseline !== null) {
          // Only send calibration data if all baseline values are not null
          setIsLoading(true);
          sendCalibrationData();
        }
      }, [pHBaseline, tempBaseline, impBaseline, userToken]);

      useEffect(() => {
        // Fetch baseline data from the server
        axios.get(`${BASE_URL}/api/calibrate`, { headers: { Authorization: userToken } })
          .then(response => {
            const { pH_baseline, temp_baseline, imp_baseline } = response.data;
            setpHBaseline(pH_baseline);
            settempBaseline(temp_baseline);
            setimpBaseline(imp_baseline);
          })
          .catch(error => {
            console.error('Error fetching baseline data:', error);
          });
      }, [userToken]);

      return (
        <SafeAreaView style={styles.screenView}>
          <View>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image style={styles.profile_pic} resizeMode="contain" source={require('../images/j_ss.png')} />
            </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.cal_header}> 
              To calibrate your device, please press the button below.{'\n'}{'\n'}
              If you do not wish to calibrate your device, you can continue to the Home page.
              </Text>
              <TouchableOpacity style={styles.cal_button} onPress={handleCalibration} disabled={isLoading}>
                <Text style={styles.cal_text}>Calibrate</Text>
              </TouchableOpacity>
            </View>

            <View>
                <Text style={styles.cal_data_header}> Your Calibrated Data </Text>
                <Text style={styles.cal_data_text}>
                pH: {pHBaseline}{'\n'}{'\n'}
                Temperature: {tempBaseline}&deg;F{'\n'}{'\n'}
                Impedance: {impBaseline}Ω</Text>
            </View>
          
        </SafeAreaView>
      );
    }

  const styles = StyleSheet.create({
    screenView: {flex:1, backgroundColor: '#99cefa', alignItems:'center', justifyContent: 'center'},
    profile_pic: {bottom:160, left:150, width: 80, height: 80, borderRadius: 50, borderWidth:2, borderColor: 'black'},
    cal_header: {bottom: 100, fontSize: 20, fontWeight: 'bold', textAlign:'center'},
    cal_button: {flexDirection:'row', padding: 20,  alignItems: 'center', justifyContent: 'center', 
    borderRadius:50, left:80, top: 0, width:220, height:100, backgroundColor: '#f8f8ff'},
    cal_text: {textAlign:'center', fontSize: 35},
    cal_data_header: {textAlign:'center', fontSize: 30, top: 50, textDecorationLine: 'underline',},
    cal_data_text: {textAlign:'center', fontSize: 30, top: 80}
  });