import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, Image, View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../context/config';

export default function HistoryScreen({ navigation }) {
  const { userToken } = useContext(AuthContext);

  // Initialize state variables for historical data
  const [historicalData, setHistoricalData] = useState([]);

  // Function to fetch historical data
  const fetchHistoricalData = () => {
    axios.get(`${BASE_URL}/api/history`, {
      headers: {
        Authorization: userToken
      }
    })
      .then(response => {
        console.log('Historical data retrieved successfully:', response.data);
        // Transform array data into an array of objects
        const newData = response.data.date_history.map((date, index) => ({
          date: response.data.date_history[index],
          time: response.data.time_history[index],
          pH: response.data.pH_history[index],
          temperature: response.data.temp_history[index],
          impedance: response.data.imp_history[index]
        }));
        setHistoricalData(newData);
      })
      .catch(error => {
        console.error('Error retrieving historical data:', error);
      });
  };

  // Run fetchHistoricalData on component mount
  useEffect(() => {
    fetchHistoricalData();
  }, []);

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.time}</Text>
      <Text style={styles.cell}>{item.pH}</Text>
      <Text style={styles.cell}>{item.temperature}</Text>
      <Text style={styles.cell}>{item.impedance}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenView}>
      <View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image style={styles.profile_pic} resizeMode="contain" source={require('../images/j_ss.png')} />
        </TouchableOpacity>
        <FlatList
          data={historicalData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.headerText}>Date</Text>
              <Text style={styles.headerText}>Time</Text>
              <Text style={styles.headerText}>pH</Text>
              <Text style={styles.headerText}>Temperature</Text>
              <Text style={styles.headerText}>Impedance</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenView: { flex: 1, backgroundColor: '#99cefa', padding: 20 },
  profile_pic: { width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: 'black', left: 320 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  headerText: { fontWeight: 'bold', flex: 1, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cell: { flex: 1, textAlign: 'center' }
});
