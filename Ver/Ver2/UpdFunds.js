import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Button } from 'react-native-paper';
import Config from '../config';
LINK=Config.LINK

function UpdFundsScreen (props) {
    const inp_fr_par = props.route.params.data;
    console.log("---------Upd Fund---------")
    console.log(JSON.stringify(inp_fr_par))
    const [totalFund, setTotalFund] = useState(inp_fr_par.totalFund);
    const totalFundInputRef = createRef();
    const [allocatedFund, setAllocatedFund] = useState(inp_fr_par.allocatedFund);
    const allocatedFundInputRef = createRef();
    const [unusedFund, setUnusedFund] = useState(inp_fr_par.unusedFund);
    const unusedFundInputRef = createRef();
    const funds_Data_Upd = {
      Email:inp_fr_par.Email,
      totalFund:totalFund,
      allocatedFund:allocatedFund,
      unusedFund:unusedFund,
    };
    var IsError=false
    console.log('----------totalfund----------')
    console.log(totalFund)
    if(isNaN(+totalFund))
    {
      IsError=true
      alert("Enter Valid Number in Total Fund ")
    }
    if(isNaN(+allocatedFund))
      {
        IsError=true
        alert("Enter Valid Number in Allocated Fund")
      }
    if(allocatedFund>totalFund)
    {
      IsError=true
      alert("You can't Allocated more than Total Fund")
    } 
    
    const updFund = (inp_fr_par) => {
        console.log('----------updFund----------')
        console.log(JSON.stringify(funds_Data_Upd))
        apiToCal=LINK+"updFund"
        console.log(apiToCal)
        if(IsError)
            alert("Some Error, Correct")
            
        fetch(apiToCal,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Methods': "PUT",
            },
            body:JSON.stringify(funds_Data_Upd),
        })
        .then(resp => resp.json())
        .then((responseJson) => {
          alert('Fund Updated Successfully')
          console.log(JSON.stringify(responseJson))
          Data=inp_fr_par
          {props.navigation.navigate('Home',{Data:Data})}
        })
        .catch((error) => {console.log('-----------error in add fund----------') })
  }
  const calUnusedFund = (value) => {
    setAllocatedFund(value)
    setUnusedFund(totalFund - value)
  };
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
            value={totalFund}
            onChangeText={(TotalFund) => setTotalFund(TotalFund)}
            underlineColorAndroid="#f000"
            placeholder="Enter Total Funds"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="sentences"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() =>
                allocatedFundInputRef.current && allocatedFundInputRef.current.focus()
            }
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            value={allocatedFund}
            onChangeText={calUnusedFund}
            underlineColorAndroid="#f000"
            placeholder="Enter Allocated Fund"
            placeholderTextColor="#8b9cb5"
            keyboardType="numeric"
            ref={allocatedFundInputRef}
            returnKeyType="next"
            onSubmitEditing={() =>
                allocatedFundInputRef.current &&
                allocatedFundInputRef.current.focus()
            }
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            value={unusedFund}
            underlineColorAndroid="#f000"
            placeholder="Enter Unused Fund"
            keyboardType="numeric"
            placeholderTextColor="#8b9cb5"
            ref={unusedFundInputRef}
            returnKeyType="next"
            onSubmitEditing={() =>
                unusedFundInputRef.current &&
                unusedFundInputRef.current.focus()
            }
            editable={false} 
            selectTextOnFocus={false} 
            />
        </View>
        <View>
            <Button
                style={styles.buttonStyle}
                mode="contained"
                onPress={() => {updFund(Data)}}
            >Add/Allocate Fund</Button>
        </View>
        </KeyboardAvoidingView>
    </ScrollView>
    </View>
)};

export default UpdFundsScreen;

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