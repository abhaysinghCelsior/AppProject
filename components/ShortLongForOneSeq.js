import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Config from '../config';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FIELD_WIDTH = SCREEN_WIDTH - 40;
const BUTTON_HEIGHT = 50;
const BUTTON_COLOR = '#4a90e2';
const BUTTON_TEXT_COLOR = '#fff';
const BUTTON_RADIUS = 8;

const ShortLongForOneSeq = () => {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState('');
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loadingFunds, setLoadingFunds] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [apiError, setApiError] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  // Fetch all active funds
  useEffect(() => {
    setLoadingFunds(true);
    axios.get(`${Config.LINK}/getAllActiveFund`)
      .then(res => {
        setFunds(Array.isArray(res.data) ? res.data : []);
        setLoadingFunds(false);
      })
      .catch(() => {
        setFunds([]);
        setLoadingFunds(false);
        Alert.alert('Error', 'Failed to fetch funds');
      });
  }, []);

  // Fetch all dates for selected fund
  useEffect(() => {
    if (selectedFund) {
      setLoadingDates(true);
      axios.get(`${Config.LINK}/getAllDatesOfFund?Fund=${encodeURIComponent(selectedFund)}`)
        .then(res => {
          setDates(Array.isArray(res.data) ? res.data : []);
          setStartDate('');
          setEndDate('');
          setLoadingDates(false);
        })
        .catch(() => {
          setDates([]);
          setLoadingDates(false);
          Alert.alert('Error', 'Failed to fetch dates');
        });
    } else {
      setDates([]);
      setStartDate('');
      setEndDate('');
    }
  }, [selectedFund]);

  // Fetch recommendations and reasons
  const fetchRecommendations = () => {
    if (!selectedFund || !startDate || !endDate) {
      Alert.alert('Error', 'Please select all fields');
      return;
    }
    setLoadingList(true);
    setApiError('');
    axios.get(`${Config.LINK}/getShortLongHistoryWitReason?Fund=${encodeURIComponent(selectedFund)}&start_date=${startDate}&end_date=${endDate}`)
      .then(res => {
        if (res.data && res.data.error) {
          setApiError(res.data.error);
          setRecommendations([]);
        } else {
          setRecommendations(Array.isArray(res.data) ? res.data : []);
        }
        setLoadingList(false);
      })
      .catch((err) => {
        setLoadingList(false);
        const apiMsg = err?.response?.data?.error || err?.message || "Unknown error";
        setApiError(apiMsg);
        setRecommendations([]);
      });
  };

  // Table header fields (updated as per your instruction)
  const headerFields = [
    { label: 'Fund Price', key: 'FundPrice', flex: 1.2 },
    { label: 'On', key: 'FundPriceAsOnDate', flex: 1.2 },
    { label: 'Recommendation', key: 'BuySellRecommend', flex: 1.2 },
    { label: 'Recommendation Reason', key: 'Reason', flex: 2 },
  ];

  // Helper to format decimals to 1 decimal place
  const formatDecimal = (value) => {
    if (typeof value === 'number') return value.toFixed(1);
    if (!isNaN(parseFloat(value))) return parseFloat(value).toFixed(1);
    return value;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Short/Long Recommendation & Reason</Text>

      <Text style={styles.label}>Fund</Text>
      {loadingFunds ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedFund}
            onValueChange={setSelectedFund}
            style={styles.picker}
          >
            <Picker.Item label="Select Fund" value="" />
            {funds.map(fund => (
              <Picker.Item key={fund} label={fund} value={fund} />
            ))}
          </Picker>
        </View>
      )}

      <Text style={styles.label}>Start Date</Text>
      {loadingDates ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={startDate}
            onValueChange={setStartDate}
            enabled={dates.length > 0}
            style={styles.picker}
          >
            <Picker.Item label="Select Start Date" value="" />
            {dates.map(date => (
              <Picker.Item key={date} label={date} value={date} />
            ))}
          </Picker>
        </View>
      )}

      <Text style={styles.label}>End Date</Text>
      {loadingDates ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={endDate}
            onValueChange={setEndDate}
            enabled={dates.length > 0}
            style={styles.picker}
          >
            <Picker.Item label="Select End Date" value="" />
            {dates.map(date => (
              <Picker.Item key={date} label={date} value={date} />
            ))}
          </Picker>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          (!selectedFund || !startDate || !endDate || loadingList) && styles.buttonDisabled
        ]}
        onPress={fetchRecommendations}
        disabled={!selectedFund || !startDate || !endDate || loadingList}
      >
        <Text style={styles.buttonText}>Show Recommendation & Reason</Text>
      </TouchableOpacity>

      {loadingList && <ActivityIndicator style={{ marginTop: 20 }} />}

      {apiError !== '' && (
        <Text style={{ color: 'red', marginTop: 20, width: FIELD_WIDTH, textAlign: 'center', fontSize: 18 }}>
          {apiError}
        </Text>
      )}

      {recommendations && Array.isArray(recommendations) && recommendations.length > 0 && !apiError && (
        <View style={[styles.tableBox, { width: FIELD_WIDTH }]}>
          <View className="tableHeader" style={styles.tableHeader}>
            {headerFields.map((field) => (
              <View key={field.key} style={[styles.tableCell, styles.headerCell, { flex: field.flex }]}>
                <Text style={styles.headerText}>{field.label}</Text>
              </View>
            ))}
          </View>
          {recommendations.map((rec, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
              <View style={[styles.tableCell, { flex: headerFields[0].flex }]}>
                <Text style={styles.cellText}>
                  {rec.FundPrice !== undefined && rec.FundPrice !== null && rec.FundPrice !== ''
                    ? formatDecimal(rec.FundPrice)
                    : '-'}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: headerFields[1].flex }]}>
                <Text style={styles.cellText}>{rec.FundPriceAsOnDate || '-'}</Text>
              </View>
              <View style={[styles.tableCell, { flex: headerFields[2].flex }]}>
                <Text style={styles.cellText}>{rec.BuySellRecommend || '-'}</Text>
              </View>
              <View style={[styles.tableCell, { flex: headerFields[3].flex }]}>
                <Text style={styles.cellText}>{rec.Reason || '-'}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {recommendations && Array.isArray(recommendations) && recommendations.length === 0 && !apiError && !loadingList && (
        <Text style={{ color: '#333', marginTop: 20, width: FIELD_WIDTH, textAlign: 'center', fontSize: 16 }}>
          No Recommendations
        </Text>
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
});

export default ShortLongForOneSeq;