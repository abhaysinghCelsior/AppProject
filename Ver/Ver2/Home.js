// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import {View, Text, SafeAreaView,StyleSheet,Image} from 'react-native';
import { Card,TextInput,Button } from 'react-native-paper';

const HomeScreen = (props) => {
  const Data = props.route.params.Data;
  console.log('--------HOME---------')
  console.log(Data.email)
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 16}}>
      <View style={{alignItems: 'center'}}>
              <Image
                source={require('../Image/logo.png')}
                style={{
                  width: '50%',
                  height: 100,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            style={styles.inputStyle}
            mode="contained"
            onPress={() => {props.navigation.navigate('Funds',{Data:Data})}}
          >Manage Funds</Button>
          <Button
            style={styles.inputStyle}
            mode="contained"
            onPress={() => {props.navigation.navigate('Portfolio',{Data:Data})}}
          >Show Portfolio</Button>
          <Button
            style={styles.inputStyle}
            mode="contained"
            onPress={() => {props.navigation.navigate('Proposal',{Data:Data})}}
          >Analyze & Recommend Buy/Sell</Button>
          <Button
            style={styles.inputStyle}
            mode="contained"
            onPress={() => {props.navigation.navigate('Recommend',{Data:Data})}}
          >Short/Long Recommendation </Button>
        </View>
        <Text
          style={{
            fontSize: 12,
            textAlign: 'center',
            color: 'grey',
          }}>
          Ahyaasena Yoga{'\n'}Manage Portfolio
        </Text>
        <Text
          style={{
            fontSize: 10,
            textAlign: 'center',
            color: 'grey',
          }}>
          www.abhyaasenayoga.com
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    padding: 10,
    marginTop:30,
    width:300
  },
});

export default HomeScreen;