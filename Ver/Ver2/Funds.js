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
  Alert,
} from 'react-native';
import { Button } from 'react-native-paper';
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
    <View style={{flex: 1, backgroundColor: '#307ecc'}}>
    <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
        justifyContent: 'center',
        alignContent: 'center',
        }}>
        <KeyboardAvoidingView enabled>
        
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            value={data.totalFund}
            underlineColorAndroid="#f000"
            placeholder="Enter Total Funds"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="sentences"
            returnKeyType="next"
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            value={data.allocatedFund}
            underlineColorAndroid="#f000"
            placeholder="Enter Allocated Fund"
            placeholderTextColor="#8b9cb5"
            keyboardType="numeric"
            returnKeyType="next"
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            underlineColorAndroid="#f000"
            value={data.unusedFund}
            placeholder="Enter Unused Fund"
            keyboardType="numeric"
            placeholderTextColor="#8b9cb5"
            returnKeyType="next"
            editable={false} 
            selectTextOnFocus={false} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            underlineColorAndroid="#f000"
            value={data.MFPer}
            placeholder="Enter % of Total Fund want to utilize in Mutual Fund"
            keyboardType="numeric"
            placeholderTextColor="#8b9cb5"
            returnKeyType="next"
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            underlineColorAndroid="#f000"
            value={data.EQPer}
            placeholder="Enter % of Total Fund want to utilize in Equity"
            keyboardType="numeric"
            placeholderTextColor="#8b9cb5"
            returnKeyType="next"
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            underlineColorAndroid="#f000"
            value={data.CMPer}
            placeholder="Enter % of Total Fund want to utilize in Commodity"
            keyboardType="numeric"
            placeholderTextColor="#8b9cb5"
            returnKeyType="next"
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            underlineColorAndroid="#f000"
            value={data.OPPer}
            placeholder="Enter % of Total Fund want to utilize in Options & Futures"
            keyboardType="numeric"
            placeholderTextColor="#8b9cb5"
            returnKeyType="next"
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        </KeyboardAvoidingView>
    </ScrollView>
    </View>
  )};

export default FundsScreen;

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