import React, {useState,useEffect} from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Config from '../config';
LINK=Config.LINK

function FundsScreen (props) {
    const inp_fr_par = props.route.params.Data;
    const [data,setData] = useState([])
    apiToCal=LINK+"getFund/"+inp_fr_par.id
    //apiToCal=LINK+"getFund"
    console.log(apiToCal)
    resp=article=null
    
    useEffect(() => 
      {
        fetch(apiToCal, {
          method: 'GET',
          headers: {
            'Content-Type':'application/json'
          },
        })
        .then(resp => resp.json())
        .then(
          Funds =>{setData(Funds)
        })
      },[]  );
    console.log('--------after get---------')
    console.log(JSON.stringify(data))
    if(typeof(data.id) == 'undefined') 
    {
      {props.navigation.navigate('AddFunds',{inp_fr_par:inp_fr_par})}
    }
    else
    {
      data.UsrId=inp_fr_par.id
      {props.navigation.navigate('UpdFunds',{data:data})}
    }
 
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../Image/logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Funds</Text>
    </View>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: 'lightgray',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default FundsScreen;
