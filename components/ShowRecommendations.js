import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView, Dimensions, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Config from '../config';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FIELD_WIDTH = SCREEN_WIDTH - 40; // 20 padding on each side
const BUTTON_HEIGHT = 50;
const BUTTON_COLOR = '#4a90e2';
const BUTTON_TEXT_COLOR = '#fff';
const BUTTON_RADIUS = 8;

const ShowRecommendations = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [apiError, setApiError] = useState('');
  const [dateSearch, setDateSearch] = useState('');

  // Fetch emails on mount
  useEffect(() => {
    setLoadingEmails(true);
    axios.get(`${Config.LINK}/getEMail`)
      .then(res => {
        const emailList = Array.isArray(res.data) ? res.data : [];
        setEmails(emailList);
        setLoadingEmails(false);
      })
      .catch(() => {
        setLoadingEmails(false);
        setEmails([]);
        Alert.alert('Error', 'Failed to fetch emails');
      });
  }, []);

  // Fetch dates when email changes
  useEffect(() => {
    if (selectedEmail) {
      setLoadingDates(true);
      axios.get(`${Config.LINK}/getFundDates?Email=${encodeURIComponent(selectedEmail)}`)
        .then(res => {
          setDates(res.data);
          setSelectedDate('');
          setLoadingDates(false);
        })
        .catch(() => {
          setLoadingDates(false);
          Alert.alert('Error', 'Failed to fetch dates');
        });
    } else {
      setDates([]);
      setSelectedDate('');
    }
  }, [selectedEmail]);

  // When setting selectedEmail, extract only the email part before making the API call
  const getPureEmail = (email) => {
    return email.split(' ')[0];
  };

  // Fetch recommendations when button pressed
  const fetchRecommendations = () => {
    if (!selectedEmail || !selectedDate) {
      Alert.alert('Error', 'Please select all fields');
      return;
    }
    setLoadingRecommendations(true);
    setApiError('');
    axios.get(`${Config.LINK}/showRecommendationHistory?Email=${encodeURIComponent(getPureEmail(selectedEmail))}&date=${selectedDate}`)
      .then(res => {
        if (res.data && res.data.error) {
          setApiError(res.data.error);
          setRecommendations([]);
        } else {
          setRecommendations(Array.isArray(res.data) ? res.data : []);
        }
        setLoadingRecommendations(false);
      })
      .catch((err) => {
        setLoadingRecommendations(false);
        const apiMsg = err?.response?.data?.error || err?.message || "Unknown error";
        setApiError(apiMsg);
        setRecommendations([]);
      });
  };

  // Helper to format decimals to 1 decimal place
  const formatDecimal = (value) => {
    if (typeof value === 'number') return value.toFixed(1);
    if (!isNaN(parseFloat(value))) return parseFloat(value).toFixed(1);
    return value;
  };

  // Table header fields
  const headerFields = [
    { label: 'Fund', key: 'FundName', flex: 2 },
    { label: 'Units', key: 'Units', flex: 1 },
    { label: 'BUY/SELL', key: 'BUY_SELL', flex: 1 },
    { label: 'StopLoss', key: 'StopLoss', flex: 1 },
    { label: 'TargetProfit', key: 'TargetProfit', flex: 1.2 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Show Recommendations</Text>

      <Text style={styles.label}>E Mail</Text>
      {loadingEmails ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedEmail}
            onValueChange={setSelectedEmail}
            style={styles.picker}
          >
            <Picker.Item label="Select Email" value="" />
            {emails.map(email => (
              <Picker.Item key={email} label={email} value={email} />
            ))}
          </Picker>
        </View>
      )}

      <Text style={styles.label}>Date</Text>
      {loadingDates ? (
        <ActivityIndicator />
      ) : (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Date (YYYY-DD)"
            value={dateSearch}
            onChangeText={setDateSearch}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDate}
              onValueChange={setSelectedDate}
              enabled={dates.length > 0}
              style={styles.picker}
            >
              <Picker.Item label="Select Date" value="" />
              {dates
                .filter(date => date.toLowerCase().includes(dateSearch.toLowerCase()))
                .map(date => (
                  <Picker.Item key={date} label={date} value={date} />
                ))}
            </Picker>
          </View>
        </>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          (!selectedEmail || !selectedDate || loadingRecommendations) && styles.buttonDisabled
        ]}
        onPress={fetchRecommendations}
        disabled={!selectedEmail || !selectedDate || loadingRecommendations}
      >
        <Text style={styles.buttonText}>Show Recommendations</Text>
      </TouchableOpacity>

      {loadingRecommendations && <ActivityIndicator style={{ marginTop: 20 }} />}

      {apiError !== '' && (
        <Text style={{ color: 'red', marginTop: 20, width: FIELD_WIDTH, textAlign: 'center', fontSize: 18 }}>
          {apiError}
        </Text>
      )}

      {recommendations && Array.isArray(recommendations) && recommendations.length > 0 && !apiError && (
        <View style={[styles.tableBox, { width: FIELD_WIDTH }]}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            {headerFields.map((field) => (
              <View key={field.key} style={[styles.tableCell, styles.headerCell, { flex: field.flex }]}>
                <Text style={styles.headerText}>{field.label}</Text>
              </View>
            ))}
          </View>
          {/* Table Rows */}
          {recommendations.map((rec, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
              <View style={[styles.tableCell, { flex: headerFields[0].flex }]}>
                <Text style={styles.cellText}>{rec.FundName || rec.Fund || '-'}</Text>
              </View>
              <View style={[styles.tableCell, { flex: headerFields[1].flex }]}>
                <Text style={styles.cellText}>
                  {rec.Units !== undefined && rec.Units !== null && rec.Units !== ''
                    ? formatDecimal(rec.Units)
                    : '-'}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: headerFields[2].flex }]}>
                <Text style={styles.cellText}>{rec.BUY_SELL || '-'}</Text>
              </View>
              <View style={[styles.tableCell, { flex: headerFields[3].flex }]}>
                <Text style={styles.cellText}>
                  {rec.StopLoss !== undefined && rec.StopLoss !== null && rec.StopLoss !== ''
                    ? formatDecimal(rec.StopLoss)
                    : '-'}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: headerFields[4].flex }]}>
                <Text style={styles.cellText}>
                  {rec.TargetProfit !== undefined && rec.TargetProfit !== null && rec.TargetProfit !== ''
                    ? formatDecimal(rec.TargetProfit)
                    : '-'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Do NOT show "No recommendations found" */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#eddfdf',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    letterSpacing: 1,
    width: FIELD_WIDTH,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
    alignSelf: 'flex-start',
    width: FIELD_WIDTH,
  },
  pickerContainer: {
    width: FIELD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: BUTTON_RADIUS,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 44,
  },
  button: {
    width: FIELD_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: BUTTON_COLOR,
    borderRadius: BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#b0c4de',
  },
  buttonText: {
    color: BUTTON_TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 0,
    elevation: 2,
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
  },
  tableRowAlt: {
    backgroundColor: '#f1f6fa',
  },
  tableCell: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  searchInput: {
    width: FIELD_WIDTH,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
});

export default ShowRecommendations;