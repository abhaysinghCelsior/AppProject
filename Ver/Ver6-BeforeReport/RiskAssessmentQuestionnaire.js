// Disclaimer Screen

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Picker,
  Image,
  Alert,
} from 'react-native';
import { commonStyles } from '../styles/commonStyles';

const RiskAssessmentQuestionnaireScreen = (props) => {
  const Data = props.route.params.Data; // Assuming Data is passed from the previous screen
  const [age, setAge] = useState('');
  const [dependents, setDependents] = useState('');
  const [miscExpenditure, setMiscExpenditure] = useState('');
  const [marketGoal, setMarketGoal] = useState('');
  const [liquidFunds, setLiquidFunds] = useState('');

  // Save all fields before submitting risk assessment
  const handleCalculate = async () => {
    // Prepare payload
    const payload = {
      Email: Data.email,
      age,
      dependents,
      miscExpenditure,
      marketGoal,
      liquidFunds,
    };

    // First, save all fields to backend
    try {
      const saveApi = LINK + 'SaveRiskAssessmentFields';
      await fetch(saveApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save risk assessment fields.');
      return;
    }

    // Then, submit risk assessment as before
    const apiToCal = LINK + 'UpdFundWithQuestionnaire';
    fetch(apiToCal, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    })
      .then(resp => resp.json())
      .then(data => {
        Alert.alert('Success', 'Your risk assessment has been submitted.');
        console.log('Risk assessment submitted:', data);
        props.navigation.navigate('Home', { Data: Data });
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to submit risk assessment.');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={require('../Image/logo.jpeg')}
          style={{ width: 120, height: 120, backgroundColor: 'lightgray' }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Risk Assessment Questionnaire</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Q1. What is your age?</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
        />

        <Text style={styles.label}>Q2. Number of dependents?</Text>
        <Picker
          selectedValue={dependents}
          style={styles.picker}
          onValueChange={setDependents}
        >
          <Picker.Item label="Select" value="" />
          <Picker.Item label="<2" value="<2" />
          <Picker.Item label="3-4" value="3-4" />
          <Picker.Item label=">4" value=">4" />
        </Picker>

        <Text style={styles.label}>Q3. Portion of misc. expenditures vis a vis from income</Text>
        <Picker
          selectedValue={miscExpenditure}
          style={styles.picker}
          onValueChange={setMiscExpenditure}
        >
          <Picker.Item label="Select" value="" />
          <Picker.Item label="Minor" value="Minor" />
          <Picker.Item label="Moderate" value="Moderate" />
          <Picker.Item label="Major" value="Major" />
        </Picker>

        <Text style={styles.label}>Q4. Your market goal</Text>
        <Picker
          selectedValue={marketGoal}
          style={styles.picker}
          onValueChange={setMarketGoal}
        >
          <Picker.Item label="Select" value="" />
          <Picker.Item label="Aggressive Growth" value="Aggressive Growth" />
          <Picker.Item label="Moderate Growth" value="Moderate Growth" />
          <Picker.Item label="Capital Preservation" value="Capital Preservation" />
        </Picker>

        <Text style={styles.label}>Q5. % of liquid funds deployed</Text>
        <Picker
          selectedValue={liquidFunds}
          style={styles.picker}
          onValueChange={setLiquidFunds}
        >
          <Picker.Item label="Select" value="" />
          <Picker.Item label="Minor" value="Minor" />
          <Picker.Item label="Moderate" value="Moderate" />
          <Picker.Item label="Major" value="Major" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RiskAssessmentQuestionnaireScreen;