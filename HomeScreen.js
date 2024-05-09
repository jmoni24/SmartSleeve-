import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../context/config';

export default function HomeScreen({ navigation }) {
  const { userToken } = useContext(AuthContext);
  // State variable to store received data
  const [receivedData, setReceivedData] = useState(null);
  // Initialize state variables for historical data
  const [pHData, setPHData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [impData, setImpData] = useState(null);
  const [pHBaseline, setpHBaseline] = useState(null);
  const [tempBaseline, settempBaseline] = useState(null);
  const [impBaseline, setimpBaseline] = useState(null);


  useEffect(() => {
    // Example data to send to the Raspberry Pi server
    const dataToSend = {
      sensorValue: 123,
      status: 'active',
    };

    // Make a POST request to the Raspberry Pi server
    axios.get('http://10.103.207.143:8000/sensor', dataToSend)
    .then(response => {
        setReceivedData(response.data); // Assuming the server responds with a message field
      })
      .catch(error => {
        console.error('Error communicating with Raspberry Pi server:', error);
      }); // Run this effect only once on component mount
    }, []);

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
  
  let phValue = null;
  let tempValue = null;
  let impValue = null;

  // Parse the response and extract values if data is available
if (receivedData) {
  const dataStrings = receivedData.split('}{'); // Split the concatenated JSON objects
  for (let i = 0; i < dataStrings.length; i++) {
    const objString = (i === 0 ? '' : '{') + dataStrings[i] + (i === dataStrings.length - 1 ? '' : '}');
    const obj = JSON.parse(objString);
    if (obj.pH !== undefined) {
      phValue = obj.pH;
    } else if (obj.temp !== undefined) {
      tempValue = obj.temp;
    } else if (obj.imp !== undefined) {
      impValue = obj.imp;
    }
  }
}
  
  const pHBase = pHBaseline;
  const tempBase = tempBaseline;
  const impBase = impBaseline;
  const pH_data = (phValue);
  const pHColor = pH_data > 7.3 ? 'red' : 5.6 < pH_data && pH_data <= 7.3 ? 'yellow' : 'green';
  const temp_data = (tempValue);
  const tempColor = temp_data > 80 ? 'green' : temp_data => 80 && temp_data <= 90 ? 'yellow' : 'red';
  const imp_data = (impValue);
  const impColor = imp_data <= impBase * 0.8 ? 'red' : impBase * 0.8 < imp_data && imp_data <= impBase * 0.9 ? 'yellow' : 'green';
  
  console.log(temp_data)
  console.log(tempBase)
  console.log(pH_data)
  console.log(pHBase)
  console.log(imp_data)
  console.log(impBaseline)

  // Function to calculate score based on color range
  const calculateScore = () => { let pHScore = 0; let tempScore = 0; let impScore = 0;
    // pH Score calculation
    if (pH_data > 7.3) { pHScore = 2;} else if (pH_data > 5.6) { pHScore = 1;}
    // Temperature Score calculation
    if (temp_data > 105.4) { tempScore = 2;} else if (temp_data > 101.8) {tempScore = 1; }
    // Impedance Score calculation
    if (imp_data < 80) {impScore = 2;} else if (imp_data <= 90) {impScore = 1;}
    // Calculate total score
    const totalScore = pHScore + tempScore + impScore;
    return totalScore
  };
  const totalScore = calculateScore();
  console.log(totalScore);

  useEffect(() => {
    // Example data to send to the backend
    const dataToSend = { 
      pH_history: [pH_data].filter(value => value !== null), 
      temp_history: [temp_data].filter(value => value !== null), 
      imp_history: [imp_data].filter(value => value !== null)
    };
  
    // Check if any of the values are not null
    if (dataToSend.pH_history.length > 0 || dataToSend.temp_history.length > 0 || dataToSend.imp_history.length > 0) {
      // Make a POST request to store historical data in MongoDB
      axios.post(`${BASE_URL}/api/history`, dataToSend, { headers: {Authorization: userToken }})
        .then(response => { console.log('Historical data stored successfully:', response.data);})
        .catch(error => { console.error('Error storing historical data:', error);}); 
    }
  }, [pH_data, temp_data, imp_data, userToken]);

    return(
      <SafeAreaView style={styles.screenView}>
          <View>
          <Text style={styles.dataHeaders}>pH{'\n'}{'\n'}{'\n'}
            Temperature{'\n'}{'\n'}{'\n'}Impedance</Text>
          <Text style={[styles.datapH, {color: pHColor}]}>{pH_data}{'\n'}{'\n'}{'\n'}{'\n'}</Text>
          <Text style={[styles.dataTemp, {color:tempColor}]}>{temp_data}&deg;F{'\n'}{'\n'}{'\n'}</Text>
          <Text style={[styles.dataImp, {color:impColor}]}>{'\n'}{imp_data}Ω</Text>
          <View style={styles.scoreTextContainer}>
          {totalScore >= 0 && totalScore <= 2 && (
          <Text style={styles.scoreTexth}>Healthy</Text>)}
          {totalScore > 2 && totalScore <= 4 && (
          <Text style={styles.scoreTexta}>At Risk</Text>)}
          {totalScore > 4 && totalScore <= 6 && (
          <Text style={styles.scoreTexte}>Extremely At Risk</Text>)}
          </View>
          </View>
          <View>
          <TouchableOpacity onPress={()=>navigation.openDrawer()}>
            <Image style={styles.profile_pic} resizeMode="contain" source={require('../images/j_ss.png')} />
          </TouchableOpacity>
          <Image style={styles.logoData} 
            resizeMode="contain" source={require('../images/logo_ss.png')} />
          <Image style={styles.bnameData} 
            resizeMode="contain" source={require('../images/bname_ss.png')} />
        </View>
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  profile_pic: {bottom:580, left: 260, width: 80, height: 80, borderRadius: 50, borderWidth:2, borderColor: 'black'},
  screenView: {flex:1, backgroundColor: '#99cefa', padding:20, alignItems:'center', justifyContent: 'center'},
  dataHeaders: {fontSize: 45, top: 410, textAlign: 'center'},
  
  datapH: {fontSize: 35, top:140, textAlign: 'center'},
  dataTemp: {fontSize: 35, top:90, textAlign: 'center'},
  dataImp: {fontSize: 35, top: 50, textAlign: 'center'},

  scoreHeader:{fontSize: 45, top:80, textAlign: 'center'},
  scoreTexth:{fontSize: 35, bottom: 0, textAlign: 'center', color:'white', backgroundColor: 'green'},
  scoreTexta:{fontSize: 35, top: 0, textAlign: 'center', color: 'white', backgroundColor: '#ffd700'},
  scoreTexte:{fontSize: 35, top: 0, textAlign: 'center', color: 'white', backgroundColor: 'red'},
  scoreTextContainer: {borderRadius: 20, overflow: 'hidden', top:90},
  
  logoData: {bottom: -10, left: -30, width: 100, height: 180},
  
  bnameData: {left: 60, bottom: 190, width: 300, height: 220},

  signoutData: {alignItems: 'center', justifyContent: 'center', 
          top:0, left: 65, width:180, height:65, backgroundColor: '#dcdcdc'},
  buttonText: {fontSize:20, fontWeight: 'bold'}

});