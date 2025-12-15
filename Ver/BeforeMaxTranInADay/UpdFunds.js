import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Image
} from 'react-native';
import { Alert, Platform } from 'react-native';
import { Button, Card, Appbar } from 'react-native-paper'; // <-- Add Appbar import
import Config from '../config';
const LINK = Config.LINK;

function UpdFundsScreen(props) {
  const inp_fr_par = props.route.params.data;
  console.log("---------Upd Fund---------");
  console.log(JSON.stringify(inp_fr_par));
  Alert.alert('Test Alert', 'This is a test alert');

  const [totalFund, setTotalFund] = useState(inp_fr_par.totalFund);
  const [allocatedFund, setAllocatedFund] = useState(inp_fr_par.allocatedFund);
  const [unusedFund, setUnusedFund] = useState(inp_fr_par.unusedFund);
  const [MFPer, setMFPer] = useState(inp_fr_par.MFPer || 0.0);
  const [EQPer, setEQPer] = useState(inp_fr_par.EQPer || 0.0);
  const [CMPer, setCMPer] = useState(inp_fr_par.CMPer || 0.0);
  const [OPPer, setOPPer] = useState(inp_fr_par.OPPer || 0.0);

  const totalFundInputRef = createRef();
  const allocatedFundInputRef = createRef();
  const unusedFundInputRef = createRef();

  const calUnusedFund = (value) => {
    setAllocatedFund(value);
    setUnusedFund(totalFund - value);
  };

  const updFund = () => {
    console.log('updFund function called');
    console.log('-------------Checking-------------');
    console.log('MFPer:', MFPer, 'EQPer:', EQPer, 'CMPer:', CMPer, 'OPPer:', OPPer);
  
    const Total_Per =
      parseFloat(MFPer || 0) + parseFloat(EQPer || 0) + parseFloat(CMPer || 0) + parseFloat(OPPer || 0);
  
    console.log('-------------Checking2-------------');
    console.log('Total_Per:', Total_Per);
  
    if (isNaN(Total_Per) || Total_Per !== 100) {
      if (Platform.OS === 'web')
        window.alert('Error-Total % of Mutual Fund, Equity, Commodity & Option should be 100');
      else
        Alert.alert('Error', 'Total % of Mutual Fund, Equity, Commodity & Option should be 100'); 
      console.log('Error-Total % of Mutual Fund, Equity, Commodity & Option should be 100');
      return;
    }
    console.log('-------------Checking3-------------');
    if (isNaN(+totalFund) || isNaN(+allocatedFund)) {
      if (Platform.OS === 'web')
        window.alert('Error-Please enter valid numbers for funds.');
      else
        Alert.alert('Error', 'Please enter valid numbers for funds.');
      console.log('Error-Please enter valid numbers for funds.')
      return;
    }
    console.log('-------------Checking4-------------');
    if (allocatedFund > totalFund) {
      if (Platform.OS === 'web')
        window.alert("Error-Allocated funds can't exceed total funds.");
      else
        Alert.alert('Error', "Allocated funds can't exceed total funds.");    
    }
    console.log('-------------Checking5-------------');
    const funds_Data_Upd = {
      Email: inp_fr_par.Email,
      totalFund: totalFund,
      allocatedFund: allocatedFund,
      unusedFund: unusedFund,
      MFPer: MFPer,
      EQPer: EQPer,
      CMPer: CMPer,
      OPPer: OPPer,
    };
  
    const apiToCal = `${LINK}updFund`;
    console.log(apiToCal);
    fetch(apiToCal, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(funds_Data_Upd),
    })
      .then((resp) => resp.json())
      .then((responseJson) => {
        window.alert('Success-Fund Updated Successfully');
        console.log('Fund Updated Successfully:', responseJson);
        props.navigation.navigate('Home', { Data: inp_fr_par });
      })
      .catch((error) => {
        console.error('Error in updating fund:', error);
      });
  };

  // Handler for back arrow
  const handleGoBack = () => {
    props.navigation.navigate('Home', { Data: inp_fr_par });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Update Funds" />
      </Appbar.Header>
      <View style={styles.logoContainer}>
        <Image
          source={require('../Image/logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Update Funds</Text>
      </View>
      <KeyboardAvoidingView enabled>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Total Funds</Text>
              <TextInput
                style={styles.input}
                value={totalFund.toString()}
                onChangeText={(value) => setTotalFund(value)}
                placeholder="Enter Total Funds"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() =>
                  allocatedFundInputRef.current && allocatedFundInputRef.current.focus()
                }
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Allocated Funds</Text>
              <TextInput
                style={styles.input}
                value={allocatedFund.toString()}
                onChangeText={calUnusedFund}
                placeholder="Enter Allocated Funds"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
                ref={allocatedFundInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                  unusedFundInputRef.current && unusedFundInputRef.current.focus()
                }
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Unused Funds</Text>
              <TextInput
                style={styles.input}
                value={unusedFund.toString()}
                placeholder="Unused Funds"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
                editable={false}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>% for Mutual Funds</Text>
              <TextInput
                style={styles.input}
                value={MFPer.toString()}
                onChangeText={(value) => setMFPer(value)}
                placeholder="Enter % for Mutual Funds"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>% for Equity</Text>
              <TextInput
                style={styles.input}
                value={EQPer.toString()}
                onChangeText={(value) => setEQPer(value)}
                placeholder="Enter % for Equity"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>% for Commodity</Text>
              <TextInput
                style={styles.input}
                value={CMPer.toString()}
                onChangeText={(value) => setCMPer(value)}
                placeholder="Enter % for Commodity"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>% for Options & Futures</Text>
              <TextInput
                style={styles.input}
                value={OPPer.toString()}
                onChangeText={(value) => setOPPer(value)}
                placeholder="Enter % for Options & Futures"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.col} />
          </View>
          <Button mode="contained" style={styles.button} onPress={updFund}>
            Add/Allocate Fund
          </Button>
        </Card>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          LyncVest{'\n'}Manage Portfolio{'\n'}www.LyncVest.com
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: 'lightgray',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  col: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  fieldTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
    marginTop: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
});

export default UpdFundsScreen;

