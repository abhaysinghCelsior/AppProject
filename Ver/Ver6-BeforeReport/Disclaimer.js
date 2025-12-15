// Disclaimer Screen

import React, {useState,useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Config from '../config';
import { commonStyles } from '../styles/commonStyles';


const DisclaimerScreen = (props) => {
  const Data = props.route.params.Data;
  const handleAccept = async () => {
    try {
      const apiToCal = Config.LINK + 'getriskassessment/' + Data.id;
      const response = await fetch(apiToCal, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const result = await response.json();
      console.log('Risk assessment API result:', result);
      if (result && result.ErrorCode === 1) {
        props.navigation.navigate('Home', { Data: Data });
      } else {
        props.navigation.navigate('RiskAssessmentQuestionnaire', { Data: Data });
      }
    } catch (error) {
      console.log('Error in handleAccept:', error);
    }
  };

  const handleDecline = () => {
    props.navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
   
      <View style={styles.header}>
        <Text style={styles.headerText}>Disclaimer - Please Read Before Proceeding</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.disclaimerText}>
          Welcome to LyncVest, your intelligent trading and investment recommendation platform.{"\n\n"}
          LyncVest is committed to providing research-based insights to support informed financial decisions.{"\n\n"}
          We hold the NISM Series XV - Research Analyst Certification from the National Institute of Securities Markets (NISM), a recognized certification under SEBI regulations.{"\n\n"}
          We are also a registered intermediary with:{"\n"}
          - The Association of Portfolio Managers in India (APMI){"\n"}
          - The Association of Mutual Funds in India (AMFI){"\n\n"}
          Please note:{"\n"}
          - All recommendations provided by LyncVest are for informational and research purposes only. They do not constitute investment advice, solicitation, or an offer to buy or sell any financial instrument.{"\n"}
          - Investing and trading in financial markets carry inherent risks. Past performance is not a guarantee of future returns. You are solely responsible for your financial decisions and should consider your personal risk tolerance and financial situation.{"\n"}
          - LyncVest and its affiliates accept no liability for any loss or damage resulting from reliance on the information provided through the platform.{"\n\n"}
          By logging in and using this platform, you acknowledge that you have read, understood, and agree to this disclaimer.
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonAccept} onPress={handleAccept}>
            <Text style={styles.buttonText}>I accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDecline} onPress={handleDecline}>
            <Text style={styles.buttonText}>I don't Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          LyncVest{'\n'}Disclaimer{'\n'}www.LyncVest.com
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
    padding: 16,
    backgroundColor: '#f5f5f5',
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
  disclaimerText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonAccept: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    marginRight: 8,
    alignItems: 'center',
  },
  buttonDecline: {
    flex: 1,
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 5,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DisclaimerScreen;