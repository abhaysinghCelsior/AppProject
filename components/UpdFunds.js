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
  const [initialValue, setInitialValue] = useState(inp_fr_par.InitialValue);
  const [totalFund, setTotalFund] = useState(inp_fr_par.totalFund);
  const [allocatedFund, setAllocatedFund] = useState(inp_fr_par.allocatedFund);
  const [unusedFund, setUnusedFund] = useState(inp_fr_par.unusedFund);
  const [MFPer, setMFPer] = useState(inp_fr_par.MFPer || 0.0);
  const [EQPer, setEQPer] = useState(inp_fr_par.EQPer || 0.0);
  const [CMPer, setCMPer] = useState(inp_fr_par.CMPer || 0.0);
  const [OPPer, setOPPer] = useState(inp_fr_par.OPPer || 0.0);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [maxLimitOfNewRecommendation, setMaxLimitOfNewRecommendation] = useState(inp_fr_par.MaxLimitOfNewRecommendation ?? '');
  const [partialWithdrawalFund, setPartialWithdrawalFund] = useState('');

  const totalFundInputRef = createRef();
  const allocatedFundInputRef = createRef();
  const unusedFundInputRef = createRef();

  const calUnusedFund = (value) => {
    setAllocatedFund(value);
    setUnusedFund(totalFund - value);
  };

  const showAlert = (title, message) => {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
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
      InitialValue: initialValue,
      MaxLimitOfNewRecommendation: maxLimitOfNewRecommendation,
      PartialWithdrawalFund: partialWithdrawalFund, // <-- Add this line
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
        showAlert('Success', 'Fund Updated Successfully');
        console.log('Fund Updated Successfully:', responseJson);
        props.navigation.navigate('Home', { Data: inp_fr_par });
      })
      .catch((error) => {
        console.error('Error in updating fund:', error);
        showAlert('Error', error.message);
      });
  };

  // Handler for back arrow
  const handleGoBack = () => {
    props.navigation.navigate('Home', { Data: inp_fr_par });
  };

  // Handler for Add/Allocate Fund button
  const handleAddAllocate = () => {
    if (isNaN(+amountToAdd) || amountToAdd === '') {
      showAlert('Error', 'Please enter a valid amount to add.');
      return;
    }
    const addValue = parseFloat(amountToAdd);
    setInitialValue(prev => (parseFloat(prev) + addValue).toString());
    setTotalFund(prev => (parseFloat(prev) + addValue).toString());
    setUnusedFund(prev => (parseFloat(prev) + addValue).toString());
    showAlert('Success', `Funds to be added: ${addValue}`);
    setAmountToAdd('');
  };

  // Handler for Partial Withdrawal button
  const handlePartialWithdrawal = () => {
    const withdrawalAmount = parseFloat(partialWithdrawalFund);
    const unused = parseFloat(unusedFund);

    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      showAlert('Error', 'Please enter a valid withdrawal amount.');
      return;
    }

    if (unused > withdrawalAmount) {
      setPartialWithdrawalFund('0');
      setInitialValue(prev => (parseFloat(prev) - withdrawalAmount).toString());
      setTotalFund(prev => (parseFloat(prev) - withdrawalAmount).toString());
      setUnusedFund(prev => (parseFloat(prev) - withdrawalAmount).toString());
      showAlert('Success', 'Partial Withdraw of amount Successful');
      // Do NOT call handleSave here, just stay on page
    } else {
      showAlert('Error', 'Partial Withdrawal failed-Not enough Unused Funds');
      // Do NOT call handleSave here, just stay on page
    }
  };

  // Handler for Save button (same as previous updFund)
  const handleSave = () => {
    updFund();
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
          {/* InitialValue and Allocated Funds side by side, disabled and greyed out */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Initial Value</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={initialValue.toString()}
                editable={false}
                placeholder="Initial Value"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Allocated Funds</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={allocatedFund.toString()}
                editable={false}
                placeholder="Allocated Funds"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
                ref={allocatedFundInputRef}
              />
            </View>
          </View>
          {/* Total Funds and Unused Funds side by side, both disabled and greyed out */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Total Funds</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={totalFund.toString()}
                editable={false}
                placeholder="Total Funds"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
                ref={totalFundInputRef}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Unused Funds</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={unusedFund.toString()}
                editable={false}
                placeholder="Unused Funds"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
              />
            </View>
          </View>
          {/* % for Equity & % for Mutual Funds in one row */}
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
          {/* % for Commodity and MaxLimitOfNewRecommendation in one row */}
          <View style={styles.row}>
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
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Max Limit Of New Recommendation</Text>
              <TextInput
                style={styles.input}
                value={maxLimitOfNewRecommendation.toString()}
                onChangeText={setMaxLimitOfNewRecommendation}
                placeholder="Enter Max Limit"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
              />
            </View>
          </View>
          {/* Funds to be Added and Partial Withdrawal Fund fields in one row */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Funds to be Added</Text>
              <TextInput
                style={styles.input}
                value={amountToAdd}
                onChangeText={setAmountToAdd}
                placeholder="Enter Amount"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldTitle}>Partial Withdrawal Fund</Text>
              <TextInput
                style={styles.input}
                value={partialWithdrawalFund}
                onChangeText={setPartialWithdrawalFund}
                placeholder="Enter Withdrawal Amount"
                placeholderTextColor="#8b9cb5"
                keyboardType="numeric"
              />
            </View>
          </View>
          {/* All three buttons same size, centered */}
          <View style={styles.buttonRow}>
            <Button mode="contained" style={styles.actionButton} onPress={handleAddAllocate}>
              Add/Allocate Fund
            </Button>
            <Button mode="contained" style={styles.actionButton} onPress={handlePartialWithdrawal}>
              Partial Withdrawal
            </Button>
            <Button mode="contained" style={styles.actionButton} onPress={handleSave}>
              Save
            </Button>
          </View>
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
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 6,
    width: '100%',
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: 'lightgray',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  col: {
    flex: 1,
    marginHorizontal: 2,
  },
  fieldTitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
    marginTop: 4,
    fontWeight: 'bold',
  },
  input: {
    height: 32,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    marginBottom: 2,
    backgroundColor: '#fff',
    fontSize: 13,
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 140,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 12,
  },
});

export default UpdFundsScreen;

