import React, { useState, createRef } from 'react';
import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import Config from '../config';
const LINK = Config.LINK;

function AddFundsScreen(props) {
  const inp_fr_par = props.route.params.inp_fr_par;
  const [totalFund, setTotalFund] = useState(0.0);
  const [allocatedFund, setAllocatedFund] = useState(0.0);
  const [unusedFund, setUnusedFund] = useState(0.0);
  const [MFPer, setMFPer] = useState(0.0);
  const [EQPer, setEQPer] = useState(0.0);
  const [CMPer, setCMPer] = useState(0.0);
  const [OPPer, setOPPer] = useState(0.0);

  const calUnusedFund = (value) => {
    setAllocatedFund(value);
    setUnusedFund(totalFund - value);
  };

  const addFund = () => {
    const Total_Per = Number(MFPer) + Number(EQPer) + Number(CMPer) + Number(OPPer);
    if (Total_Per !== 100) {
      Alert.alert('Error', 'Total % of Mutual Fund, Equity, Commodity & Option should be 100');
      return;
    }

    const funds_Data_Create = {
      Email: inp_fr_par.email,
      totalFund,
      allocatedFund,
      unusedFund,
      MFPer,
      EQPer,
      CMPer,
      OPPer,
    };

    const apiToCal = `${LINK}addFund`;
    fetch(apiToCal, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(funds_Data_Create),
    })
      .then((resp) => resp.json())
      .then((responseJson) => {
        Alert.alert('Success', 'Fund Created Successfully');
        props.navigation.navigate('Home', { Data: inp_fr_par });
      })
      .catch((error) => {
        console.error('Error in add fund:', error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Funds</Text>
      </View>
      <KeyboardAvoidingView enabled>
        <Card style={styles.card}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(value) => setTotalFund(value)}
              placeholder="Enter Total Funds"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={allocatedFund.toString()}
              onChangeText={calUnusedFund}
              placeholder="Enter Allocated Funds"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={unusedFund.toString()}
              placeholder="Unused Funds"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
              editable={false}
            />
            <TextInput
              style={styles.input}
              onChangeText={(value) => setMFPer(value)}
              placeholder="Enter % for Mutual Funds"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={(value) => setEQPer(value)}
              placeholder="Enter % for Equity"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={(value) => setCMPer(value)}
              placeholder="Enter % for Commodity"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={(value) => setOPPer(value)}
              placeholder="Enter % for Options & Futures"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
            />
          </View>
          <Button mode="contained" style={styles.button} onPress={addFund}>
            Add Fund
          </Button>
        </Card>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Ahyaasena Yoga{'\n'}Manage Portfolio{'\n'}www.abhyaasenayoga.com
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
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

export default AddFundsScreen;
