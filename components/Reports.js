// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-paper';
import { commonStyles } from '../styles/commonStyles';

const ReportsScreen = (props) => {
  const Data = props.route.params.Data;
  console.log('--------HOME---------');
  console.log(Data.email);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to LyncVest</Text>
        <Text style={styles.subHeaderText}>Link to Success</Text>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../Image/logo.jpeg')}
          style={styles.logo}
        />
      </View>
      <Card style={styles.card}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('Forward', { Data: Data });
          }}
        >
        <Text style={styles.buttonText}>Forward Testing Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('Transactions', { Data: Data });
          }}
        >
        <Text style={styles.buttonText}>Show Transactions</Text>
        </TouchableOpacity>
          <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('ShowRecommendations', { Data: Data });
          }}
        >
        <Text style={styles.buttonText}>Show Recommendations</Text>
        </TouchableOpacity>
          <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('ShortLongForOneSeq', { Data: Data });
          }}
        >
        <Text style={styles.buttonText}>Security Recommendations Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate('RuntimeProcess', { Data: Data });
          }}
        >
        <Text style={styles.buttonText}>Runtime Processing</Text>
        </TouchableOpacity>
        
      </Card>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          LyncVest{'\n'}Manage Portfolio{'\n'}www.LyncVest.com
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: 'gray',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  card: {
    width: '90%',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: 'gray',
  },
});

export default ReportsScreen;