// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef } from 'react';
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
  Alert,
} from 'react-native';
import { Card } from 'react-native-paper';
import { commonStyles } from '../styles/commonStyles';
import Config from '../config';
const LINK = Config.LINK;

function RegisterScreen(props) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPassword2, setUserPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const passwordInputRef2 = createRef();

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) {
      Alert.alert('Error', 'Please provide your mobile number');
      return;
    }
    const validateMobile = (mobile) => {
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobile)) {
        Alert.alert('Error', 'Invalid mobile number. Must be 10 digits and start with 6-9.');
        return false;
      }
      return true;
    };
    if (!validateMobile(userName)) return;

    if (!userEmail) {
      Alert.alert('Error', 'Please provide your email');
      return;
    }
    const validateEmail = (email) => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Invalid email format');
        return false;
      }
      return true;
    };
    if (!validateEmail(userEmail)) return;

    if (!userPassword || !userPassword2) {
      Alert.alert('Error', 'Please fill both password fields');
      return;
    }
    if (userPassword !== userPassword2) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    const dataToSend = {
      name: userName,
      email: userEmail,
      password: userPassword,
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
        window.alert('Account Creation Successful');
        console.log('Account Creation Successful:', responseJson.userEmail);
        props.navigation.navigate('Login', { Data: None });
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Error', 'Something went wrong. Please try again.');
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
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.logoContainer}>
          <Image
            source={require('../Image/logo.jpeg')}
            style={[commonStyles.ImgStyle, { width: 3 * (commonStyles.ImgStyle?.width || 60), height: 3 * (commonStyles.ImgStyle?.height || 60) }]}
          />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create an Account</Text>
      </View>
      <KeyboardAvoidingView enabled>
        <Card style={styles.card}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(UserName) => setUserName(UserName)}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#8b9cb5"
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current && emailInputRef.current.focus()}
            />
            <TextInput
              style={styles.input}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
            />
            <TextInput
              style={styles.input}
              onChangeText={(UserPassword) => setUserPassword(UserPassword)}
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              secureTextEntry={true}
              ref={passwordInputRef}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef2.current && passwordInputRef2.current.focus()}
            />
            <TextInput
              style={styles.input}
              onChangeText={(UserPassword2) => setUserPassword2(UserPassword2)}
              placeholder="Confirm Password"
              placeholderTextColor="#8b9cb5"
              secureTextEntry={true}
              ref={passwordInputRef2}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  successText: {
    fontSize: 20,
    color: 'green',
    marginBottom: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
});

export default RegisterScreen;

