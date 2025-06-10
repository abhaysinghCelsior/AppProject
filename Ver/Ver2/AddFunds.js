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

function AddFundsScreen (props) {
    const inp_fr_par = props.route.params.inp_fr_par;
    Data=inp_fr_par
    console.log("---------Add Fund---------")
    console.log(JSON.stringify(inp_fr_par))
    const [totalFund, setTotalFund] = useState(0.0);
    const totalFundInputRef = createRef();
    const [allocatedFund, setAllocatedFund] = useState(0.0);
    const allocatedFundInputRef = createRef();
    const [unusedFund, setUnusedFund] = useState(0.0);
    const unusedFundInputRef = createRef();
    const [MFPer, setMFPer] = useState(0.0);
    const MFPerInputRef = createRef();
    const [EQPer, setEQPer] = useState(0.0);
    const EQPerInputRef = createRef();
    const [CMPer, setCMPer] = useState(0.0);
    const CMPerInputRef = createRef();
    const [OPPer, setOPPer] = useState(0.0);
    const OPPerInputRef = createRef();
    const funds_Data_Create = {
      Email:inp_fr_par.email,
      totalFund:totalFund,
      allocatedFund:allocatedFund,
      unusedFund:unusedFund,
      MFPer:MFPer,
      EQPer:EQPer,
      CMPer:CMPer,
      OPPer:OPPer,
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

    const addFund = (Data) => {
        console.log('----------addFund----------')
        console.log("----allocatedFund>totalFund------")
        console.log(allocatedFund)
        console.log(totalFund)
        if(allocatedFund>totalFund)
        {
          IsError=true
          alert("You can't Allocated more than Total Fund")
        } 
        apiToCal=LINK+"addFund"
        console.log(apiToCal)
        Total_Per=Number(MFPer)+Number(EQPer)+Number(CMPer)+Number(OPPer)
        console.log("----Total_Per------")
        console.log(Total_Per)
        if(IsError)
            alert("Some Error, Correct")

        if (!MFPer) {
          alert('Please fill MF %');
        }
        if (!EQPer) {
          alert('Please fill EQ %');
        }
        if (!CMPer) {
          alert('Please fill CM %');
    
        }
        if (!OPPer) {
          alert('Please fill OP %');
        }

        if (Total_Per!=100) {
          alert('Total % of Mutual Fund, Equity, Commodity & Option should be 100');
          return;
        }
        fetch(apiToCal,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Methods': "POST",
            },
            body:JSON.stringify(funds_Data_Create),
        })
        .then(resp => resp.json())
        .then((responseJson) => {
            alert('Fund Created Successfully')
            console.log(JSON.stringify(responseJson))
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
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            onChangeText={(MFPer) => setMFPer(MFPer)}
            underlineColorAndroid="#f000"
            placeholder="Enter Total FundsEnter % of Total Fund want to utilize in Mutual Fund"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="sentences"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() =>
              MFPerInputRef.current && MFPerInputRef.current.focus()
            }
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            onChangeText={(EQPer) => setEQPer(EQPer)}
            underlineColorAndroid="#f000"
            placeholder="Enter % of Total Fund want to utilize in Equity"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="sentences"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() =>
              EQPerInputRef.current && EQPerInputRef.current.focus()
            }
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            onChangeText={(CMPer) => setCMPer(CMPer)}
            underlineColorAndroid="#f000"
            placeholder="Enter % of Total Fund want to utilize in Commodity"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="sentences"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() =>
              CMPerInputRef.current && CMPerInputRef.current.focus()
            }
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View style={styles.SectionStyle}>
            <TextInput
            style={styles.inputStyle}
            onChangeText={(OPPer) => setOPPer(OPPer)}
            underlineColorAndroid="#f000"
            placeholder="Enter % of Total Fund want to utilize in Options & Futures"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="sentences"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() =>
              OPPerInputRef.current && OPPerInputRef.current.focus()
            }
            editable={true} 
            selectTextOnFocus={true} 
            />
        </View>
        <View>
            <Button
                style={styles.buttonStyle}
                mode="contained"
                onPress={() => {addFund(Data)}}
            >Add Fund</Button>
        </View>
        </KeyboardAvoidingView>
    </ScrollView>
    </View>
)};

export default AddFundsScreen;

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