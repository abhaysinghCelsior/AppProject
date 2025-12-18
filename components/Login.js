// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Card } from 'react-native-paper';
import Config from '../config';
const LINK = Config.LINK;
import { commonStyles } from '../styles/commonStyles';

function LoginScreen(props) {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      Alert.alert('Error', 'Please fill Email');
      return;
    }
    if (!userPassword) {
      Alert.alert('Error', 'Please fill Password');
      return;
    }
    setLoading(true);
    const dataToSend = { email: userEmail, password: userPassword };

    const apiToCal = LINK + 'login';
    console.log(apiToCal);
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
        console.log('--------------Return--------------');
        console.log(responseJson['FRM_API']['RETURN_CODE']);
        const id_ret = responseJson['FRM_API']['RETURN_CODE'];
        if (id_ret > 0) {
          console.log('Move to Home---');
          const Data = { email: userEmail, id: id_ret };
          props.navigation.navigate('Disclaimer', { Data: Data });
        } else {
          setErrortext(responseJson.msg);
          console.log('Login failed, showing alert');
          if (
            responseJson.msg &&
            responseJson.msg.toLowerCase().includes('password')
          ) {
            Alert.alert('Login Failed', 'Incorrect password. Please try again.');
          } else {
            Alert.alert('Login Failed', responseJson.msg || 'Please check your email id or password');
          }
          console.log('Please check your email id or password');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('Error:', error);
        Alert.alert('Error', 'Network error or server not reachable.');
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <KeyboardAvoidingView enabled style={{ flex: 1 }}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../Image/logo.jpeg')}
            style={[commonStyles.ImgStyle, { width: 180, height: 180, marginBottom: 10, resizeMode: 'contain' }]}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hello Abhay - How are you!{"\n"}This is time to build mobile app is coming</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              underlineColorAndroid="#f000"
            />
            <TextInput
              style={styles.input}
              onChangeText={(UserPassword) => setUserPassword(UserPassword)}
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              keyboardType="default"
              ref={passwordInputRef}
              onSubmitEditing={Keyboard.dismiss}
              secureTextEntry={true}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
            {errortext != '' ? (
              <Text style={styles.errorText}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleSubmitPress}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </View>
        </View>
        <Text
          style={styles.registerText}
          onPress={() => props.navigation.navigate('Register')}
        >
          New Here? Create an Account
        </Text>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            LyncVest{'\n'}Manage Portfolio{'\n'}www.LyncVest.com
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
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
    flex: 1,
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
  registerText: {
    textAlign: 'center',
    color: '#007bff',
    marginTop: 20,
    fontSize: 16,
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

export default LoginScreen;
