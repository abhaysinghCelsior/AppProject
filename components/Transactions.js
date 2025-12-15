import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView, Dimensions, Platform, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons'; // npm install @expo/vector-icons
import Config from '../config';
const LINK = Config.LINK;

const SCREEN_WIDTH = Dimensions.get('window').width;
const FIELD_WIDTH = SCREEN_WIDTH - 40; // 20 padding on each side
const BUTTON_HEIGHT = 50;
const BUTTON_COLOR = '#4a90e2';
const BUTTON_TEXT_COLOR = '#fff';
const BUTTON_RADIUS = 8;

const headerFields = [
  { label: 'Fund', key: 'FundName', flex: 1.5 },
  { label: 'Units', key: 'Units', flex: 1 },
  { label: 'BUY/SELL', key: 'BUY_SELL', flex: 1 },
  { label: 'Init Date', key: 'TransInitiiationDate', flex: 1.2 },
  { label: 'Close Date', key: 'TransClosureDate', flex: 1.2 },
  { label: 'Init Price', key: 'TransInitialPrice', flex: 1.2 },
  { label: 'Close Price', key: 'TransClosurePrice', flex: 1.2 },
  { label: 'P/L %', key: 'ProfitLoss', flex: 1 },
  { label: 'P/L Amt', key: 'ProfitLossAmt', flex: 1.2 },
];

const Transactions = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [apiError, setApiError] = useState('');
  const downloadLinkRef = useRef(null);
  const [startDateSearch, setStartDateSearch] = useState('');
  const [endDateSearch, setEndDateSearch] = useState('');

  // Helper to format decimals to 1 decimal place
  const formatDecimal = (value) => {
    if (typeof value === 'number') return value.toFixed(1);
    if (!isNaN(parseFloat(value))) return parseFloat(value).toFixed(1);
    return value;
  };

  // Fetch emails on mount
  useEffect(() => {
    setLoadingEmails(true);
    axios.get(`${LINK}/getEMail`)
      .then(res => {
        setEmails(Array.isArray(res.data) ? res.data : []);
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
      axios.get(`${LINK}/getFundDates?Email=${encodeURIComponent(selectedEmail)}`)
        .then(res => {
          setDates(res.data);
          setStartDate('');
          setEndDate('');
          setLoadingDates(false);
        })
        .catch(() => {
          setLoadingDates(false);
          setDates([]);
          Alert.alert('Error', 'Failed to fetch dates');
        });
    } else {
      setDates([]);
      setStartDate('');
      setEndDate('');
    }
  }, [selectedEmail]);

  // Fetch transactions when button pressed
  const fetchTransactions = () => {
    if (!selectedEmail || !startDate || !endDate) {
      Alert.alert('Error', 'Please select all fields');
      return;
    }
    setLoadingTransactions(true);
    setApiError('');
    axios.get(`${LINK}/getTransactions?Email=${encodeURIComponent(selectedEmail)}&start_date=${startDate}&end_date=${endDate}`)
      .then(res => {
        if (res.data && res.data.error) {
          setApiError(res.data.error);
          setTransactions([]);
        } else {
          setTransactions(Array.isArray(res.data) ? res.data : []);
        }
        setLoadingTransactions(false);
      })
      .catch((err) => {
        setLoadingTransactions(false);
        setTransactions([]);
        // Show API error message if available, else generic message
        const apiMsg = err?.response?.data?.error || err?.message || "Unknown error";
        setApiError(apiMsg);
      });
  };

  // Download as Excel (CSV)
  const downloadAsExcel = async () => {
    if (!transactions.length) {
      Alert.alert('No Data', 'No transactions to download.');
      return;
    }
    setDownloading(true);
    try {
      const csvHeader = headerFields.map(h => h.label).join(',') + '\n';
      const csvRows = transactions.map(txn =>
        headerFields.map(h => {
          let val = txn[h.key];
          if (['Units', 'TransInitialPrice', 'TransClosurePrice', 'ProfitLoss', 'ProfitLossAmt'].includes(h.key)) {
            val = formatDecimal(val);
          }
          return `"${val !== undefined && val !== null ? val : ''}"`;
        }).join(',')
      ).join('\n');
      const csvString = csvHeader + csvRows;

      if (Platform.OS === 'web') {
        // Web: Use Blob and a hidden <a> to download
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        if (downloadLinkRef.current) {
          downloadLinkRef.current.href = url;
          downloadLinkRef.current.download = 'transactions.csv';
          downloadLinkRef.current.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
      } else {
        // Native: Use expo-file-system and expo-sharing
        const fileUri = FileSystem.cacheDirectory + 'transactions.csv';
        await FileSystem.writeAsStringAsync(fileUri, csvString, { encoding: FileSystem.EncodingType.UTF8 });
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Download Transactions as CSV' });
        } else {
          Alert.alert('Sharing not available', 'File saved to: ' + fileUri);
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to download file.');
    }
    setDownloading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Transaction History</Text>

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

      <Text style={styles.label}>Start Date</Text>
      {loadingDates ? (
        <ActivityIndicator />
      ) : (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Start Date (YYYY-DD)"
            value={startDateSearch}
            onChangeText={setStartDateSearch}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={startDate}
              onValueChange={setStartDate}
              enabled={dates.length > 0}
              style={styles.picker}
            >
              <Picker.Item label="Select Start Date" value="" />
              {dates
                .filter(date => date.toLowerCase().includes(startDateSearch.toLowerCase()))
                .map(date => (
                  <Picker.Item key={date} label={date} value={date} />
                ))}
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>End Date</Text>
      {loadingDates ? (
        <ActivityIndicator />
      ) : (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search End Date (YYYY-DD)"
            value={endDateSearch}
            onChangeText={setEndDateSearch}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={endDate}
              onValueChange={setEndDate}
              enabled={dates.length > 0}
              style={styles.picker}
            >
              <Picker.Item label="Select End Date" value="" />
              {dates
                .filter(date => date.toLowerCase().includes(endDateSearch.toLowerCase()))
                .map(date => (
                  <Picker.Item key={date} label={date} value={date} />
                ))}
            </Picker>
          </View>
        </>
      )}

      {/* REMOVE Show Transactions Button */}
      {/* 
      <TouchableOpacity
        style={[
          styles.button,
          (!selectedEmail || !startDate || !endDate || loadingTransactions) && styles.buttonDisabled
        ]}
        onPress={fetchTransactions}
        disabled={!selectedEmail || !startDate || !endDate || loadingTransactions}
      >
        <Text style={styles.buttonText}>Show Transactions</Text>
      </TouchableOpacity>
      */}

      {/* Instead, fetch transactions and download directly when all fields are selected */}
      {(!loadingTransactions && selectedEmail && startDate && endDate) && (
        <TouchableOpacity
          style={[
            styles.button,
            downloading && styles.buttonDisabled
          ]}
          onPress={async () => {
            await fetchTransactions();
            setTimeout(() => {
              if (
                transactions &&
                Array.isArray(transactions) &&
                transactions.length > 0 &&
                !apiError
              ) {
                downloadAsExcel();
                setTransactions([]); // Hide table after download
              }
            }, 500); // Wait for fetchTransactions to complete
          }}
          disabled={downloading}
        >
          <Text style={styles.buttonText}>Download Transaction</Text>
        </TouchableOpacity>
      )}

      {loadingTransactions && <ActivityIndicator style={{ marginTop: 20 }} />}

      {apiError !== '' && (
        <Text style={{ color: 'red', marginTop: 20, width: FIELD_WIDTH, textAlign: 'center', fontSize: 18 }}>
          {apiError}
        </Text>
      )}

      {/* Download Transaction Table */}
      {transactions && Array.isArray(transactions) && transactions.length > 0 && !apiError && (
        <View style={{ width: FIELD_WIDTH }}>
          {Platform.OS === 'web' && (
            <a ref={downloadLinkRef} style={{ display: 'none' }}>Download</a>
          )}
          <ScrollView
            horizontal={false}
            style={[styles.tableBox, { width: FIELD_WIDTH, maxHeight: 400 }]}
            contentContainerStyle={{ width: '100%' }}
          >
            <View>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                {headerFields.map((field) => (
                  <View key={field.key} style={[styles.tableCell, styles.headerCell, { flex: field.flex }]}>
                    <Text style={styles.headerText}>{field.label}</Text>
                  </View>
                ))}
              </View>
              {/* Table Rows */}
              {transactions.map((txn, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                  <View style={[styles.tableCell, { flex: headerFields[0].flex }]}>
                    <Text style={styles.cellText}>{txn.FundName || '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: headerFields[1].flex }]}>
                    <Text style={styles.cellText}>{txn.Units !== undefined ? formatDecimal(txn.Units) : '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: headerFields[2].flex }]}>
                    <Text style={styles.cellText}>{txn.BUY_SELL || '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: headerFields[3].flex }]}>
                    <Text style={styles.cellText}>{txn.TransInitiiationDate || '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: headerFields[4].flex }]}>
                    <Text style={styles.cellText}>{txn.TransClosureDate || '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: headerFields[5].flex }]}>
                    <Text style={styles.cellText}>{txn.TransInitialPrice !== undefined ? formatDecimal(txn.TransInitialPrice) : '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: headerFields[6].flex }]}>
                    <Text style={styles.cellText}>{txn.TransClosurePrice !== undefined ? formatDecimal(txn.TransClosurePrice) : '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: headerFields[7].flex }]}>
                    <Text style={styles.cellText}>{txn.ProfitLoss !== undefined ? formatDecimal(txn.ProfitLoss) : '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: headerFields[8].flex }]}>
                    <Text style={styles.cellText}>{txn.ProfitLossAmt !== undefined ? formatDecimal(txn.ProfitLossAmt) : '-'}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
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
    marginVertical: 10,
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
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 5,
  },
  tableBox: {
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 0,
    elevation: 2,
    // REMOVE alignItems from here!
    overflow: 'hidden',
    minHeight: 60,
    maxHeight: 400,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
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
    minWidth: 70,
  },
  cellText: {
    fontSize: 13,
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

export default Transactions;