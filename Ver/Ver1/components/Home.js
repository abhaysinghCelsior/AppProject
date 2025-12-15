

import React,{useState} from 'react';
import {  Text, View,StyleSheet,Button } from 'react-native';



function Home() {
  const [tst,setTst]=useState('State A K SINGH')
  const onButtonPress = () => {
    console.log('Button Pressed')
  }

  return (
    <View>
        <Text style={{color:'red'}}>Hello {tst} - How are you!</Text>
        <Text style={styles.textStyl}>This is time to build mobile app</Text>
        <Button title = "Home" onPress={onButtonPress}/>
    </View>
  );
}

const styles = StyleSheet.create({
    textStyl: {
        color:'green', backgroundColor:'red',padding:10,margin:20
    },
  });
  
export default Home