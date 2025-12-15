import React, {useState, createRef,useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Alert,FlatList,
} from 'react-native';
import { Button } from 'react-native-paper';
import Config from '../config';
LINK=Config.LINK



function ProposalScreen (props) {
    const inp_fr_par = props.route.params.Data;
    const [data,setData] = useState([])
    apiToCal=LINK+"getProposedFund/"+inp_fr_par.id
    console.log(apiToCal)
    resp=null
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
          Proposed =>{setData(Proposed)
        })
      },[]  );
    console.log('--------after get Proposed Fund---------')
    console.log(JSON.stringify(data))

    const renderItem = ({ item }) => (
        <View style={styles.inputStyle}>
          <Text style={styles.title}>ISIN:{item.ISIN}</Text>
          <Text style={styles.title}>FundPrice:{item.FundPrice}</Text>
          <Text style={styles.title}>UNITS:{item.Units}</Text>
          <Text style={styles.title}>BUY/SELL:{item.BUY_SELL}</Text>
        </View>
      );
    
      return (
        <View style={styles.container}>
          <FlatList
            data={data} // Pass the data array
            renderItem={renderItem} // Render each item using this function
            keyExtractor={(item) => item.ISIN} // Unique key for each item
          />
        </View>
  )};

export default ProposalScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});