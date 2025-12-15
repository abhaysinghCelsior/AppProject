import React, { useState, useEffect } from 'react';
import { View, Button, ScrollView, StyleSheet, Text } from 'react-native';
import Config from '../config';
const LINK = Config.LINK;

function BacktestScreen(props) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch(LINK + "getCountry", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(resp => resp.json())
      .then(data => {
        // If the API returns an array of country names
        setCountries(data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);
  console.log('--------after get---------')
  console.log(JSON.stringify(countries))

  const handleCountryPress = (countryName) => {
    console.log('Selected country:', countryName);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {countries.map((countryObj, idx) => (
        <View key={idx} style={styles.buttonContainer}>
          <Button
            title={countryObj.CntryCode}
            onPress={() => props.navigation.navigate('Backtestsummary', { Data: countryObj })}
            color="#007bff"
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 12,
  },
});

export default BacktestScreen;
