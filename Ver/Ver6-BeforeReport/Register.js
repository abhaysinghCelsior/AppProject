// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef, useEffect } from 'react';
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
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Card } from 'react-native-paper';
import { commonStyles } from '../styles/commonStyles';
import Config from '../config';
import { Picker } from '@react-native-picker/picker';

const LINK = Config.LINK;

function RegisterScreen(props) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPassword2, setUserPassword2] = useState('');
  const [taxId, setTaxId] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [nationality, setNationality] = useState('IN');
  const [countryCode, setCountryCode] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertMsg, setCustomAlertMsg] = useState('');

  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const passwordInputRef2 = createRef();

  // Update country code when nationality changes
  const handleNationalityChange = (value) => {
    setNationality(value);
    setCountryCode(value === 'IN' ? '+91' : '+1');
  };

  // Replace Alert.alert with this function
  const showCustomAlert = (msg) => {
    setCustomAlertMsg(msg);
    setCustomAlertVisible(true);
  };

  const handleSubmitButton = () => {
    console.log('Submit button pressed');
    setErrortext('');
    if (!userName) {
      showCustomAlert('Please provide your mobile number');
      return;
    }
    console.log('User Name: ', userName);
    // Validate mobile based on country code
    const validateMobile = (mobile, code) => {
      console.log('mobile.length = ', mobile.length);
      if (mobile.length !== 10) {
        showCustomAlert('Mobile number must be exactly 10 digits.');
        return false;
      }
      if (code === '+91') {
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
          showCustomAlert('Invalid Indian mobile number. Must be 10 digits and start with 6-9.');
          return false;
        }
      } else if (code === '+1') {
        const mobileRegex = /^[2-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
          showCustomAlert('Invalid US mobile number. Must be 10 digits and start with 2-9.');
          return false;
        }
      }
      return true;
    };
    console.log('Mobile Number: ', userName);
    if (!validateMobile(userName, countryCode)) return;
    console.log('Mobile Number Validated');
    if (!taxId) {
      showCustomAlert('Please provide your Tax Identification Number');
      return;
    }
    console.log('Tax ID: ', taxId);
    if (!nationalId) {
      showCustomAlert('Please provide your National Identification Number');
      return;
    }
    console.log('National ID: ', nationalId);
    if (!userEmail) {
      showCustomAlert('Please provide your email');
      return;
    }
    console.log('User Email: ', userEmail);
    const validateEmail = (email) => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        showCustomAlert('Invalid email format');
        return false;
      }
      return true;
    };
    if (!validateEmail(userEmail)) return;
    console.log('Email Validated');
    if (!userPassword || !userPassword2) {
      showCustomAlert('Please fill both password fields');
      return;
    }
    if (userPassword !== userPassword2) {
      showCustomAlert('Passwords do not match');
      return;
    }
    console.log('Passwords match');
    setLoading(true);
    const dataToSend = {
      name: userName,
      email: userEmail,
      password: userPassword,
      taxId: taxId,
      nationalId: nationalId,
      nationality: nationality,
      countryCode: countryCode,
    };

    const apiToCal = LINK + 'register';
    fetch(apiToCal, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        showCustomAlert('Account Creation Successful');
        setIsRegistraionSuccess(true);
        // props.navigation.navigate('Login', { Data: null });
      })
      .catch((error) => {
        setLoading(false);
        showCustomAlert('Something went wrong. Please try again.');
      });
  };

  if (isRegistraionSuccess) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successText}>Account Creation Successful</Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => props.navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image
            source={require('../Image/logo.jpeg')}
            style={[
              commonStyles.ImgStyle,
              { width: 120, height: 120, marginBottom: 10, resizeMode: 'contain' }
            ]}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Create an Account</Text>
        </View>
        <KeyboardAvoidingView enabled style={{ flex: 1 }}>
          <Card style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E Mail</Text>
              <TextInput
                style={styles.input}
                onChangeText={setUserEmail}
                placeholder="Enter Email"
                placeholderTextColor="#8b9cb5"
                keyboardType="email-address"
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                value={userEmail}
              />
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={setUserPassword}
                placeholder="Enter Password"
                placeholderTextColor="#8b9cb5"
                secureTextEntry={true}
                ref={passwordInputRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef2.current && passwordInputRef2.current.focus()}
                value={userPassword}
              />
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={setUserPassword2}
                placeholder="Confirm Password"
                placeholderTextColor="#8b9cb5"
                secureTextEntry={true}
                ref={passwordInputRef2}
                returnKeyType="next"
                onSubmitEditing={Keyboard.dismiss}
                value={userPassword2}
              />
              <Text style={styles.label}>Nationality</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={nationality}
                  style={styles.picker}
                  onValueChange={handleNationalityChange}
                >
                  <Picker.Item label="India" value="IN" />
                  <Picker.Item label="United States" value="US" />
                </Picker>
              </View>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                onChangeText={setUserName}
                placeholder="Enter Mobile Number"
                placeholderTextColor="#8b9cb5"
                keyboardType="phone-pad"
                returnKeyType="next"
                value={userName}
                maxLength={15}
              />
              <Text style={styles.label}>Country Code: {countryCode}</Text>
              <Text style={styles.label}>Tax Identification Number</Text>
              <TextInput
                style={styles.input}
                onChangeText={setTaxId}
                placeholder="Enter Tax Identification Number"
                placeholderTextColor="#8b9cb5"
                value={taxId}
                maxLength={20}
              />
              <Text style={styles.label}>National Identification Number</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNationalId}
                placeholder="Enter National Identification Number"
                placeholderTextColor="#8b9cb5"
                value={nationalId}
                maxLength={20}
              />
              {errortext != '' ? <Text style={styles.errorText}>{errortext}</Text> : null}
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={handleSubmitButton}
              >
                <Text style={styles.buttonText}>Create an Account</Text>
              </TouchableOpacity>
              {loading && <ActivityIndicator size="large" color="#0000ff" />}
            </View>
          </Card>
        </KeyboardAvoidingView>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            LyncVest{'\n'}Manage Portfolio{'\n'}www.LyncVest.com
          </Text>
        </View>
      </ScrollView>
      {/* Custom Alert Modal */}
      <Modal
        transparent={true}
        visible={customAlertVisible}
        animationType="fade"
        onRequestClose={() => setCustomAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{customAlertMsg}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setCustomAlertVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
    marginTop: 6,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 13,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  successText: {
    fontSize: 18,
    color: 'green',
    marginBottom: 18,
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
    minWidth: 220,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default RegisterScreen;

