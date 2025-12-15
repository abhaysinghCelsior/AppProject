import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView, Dimensions, Platform, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Config from '../config';

const LINK = Config.LINK;

const SCREEN_WIDTH = Dimensions.get('window').width;
const FIELD_WIDTH = SCREEN_WIDTH - 40;
const BUTTON_HEIGHT = 50;
const BUTTON_COLOR = '#4a90e2';
const BUTTON_TEXT_COLOR = '#fff';
const BUTTON_RADIUS = 8;

const transactionHeaderFields = [
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

const Forward = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summaryList, setSummaryList] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Transaction state
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [summaryApiError, setSummaryApiError] = useState('');
  const downloadLinkRef = useRef(null);

  // Search states
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
          Alert.alert('Error', 'Failed to fetch dates');
        });
    } else {
      setDates([]);
      setStartDate('');
      setEndDate('');
    }
  }, [selectedEmail]);

  // Fetch summary when button pressed
  const fetchSummary = () => {
    if (!selectedEmail || !startDate || !endDate) {
      Alert.alert('Error', 'Please select all fields');
      return;
    }
    setLoadingSummary(true);
    setSummaryApiError('');
    axios.get(`${LINK}/getFundSummary?Email=${encodeURIComponent(selectedEmail)}&start_date=${startDate}&end_date=${endDate}`)
      .then(res => {
        let data = res.data;
        if (data && data.error) {
          setSummaryApiError(data.error);
          setSummaryList([]);
        } else {
          if (data && !Array.isArray(data)) data = [data];
          setSummaryList(data);
        }
        setLoadingSummary(false);
      })
      .catch((err) => {
        setLoadingSummary(false);
        // Show API error message if available, else generic message
        const apiMsg = err?.response?.data?.error || err?.message || "Unknown error";
        setSummaryApiError(apiMsg);
      });
  };

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
      .catch(() => {
        setLoadingTransactions(false);
        setTransactions([]);
        setApiError('Failed to fetch transactions');
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
      const csvHeader = transactionHeaderFields.map(h => h.label).join(',') + '\n';
      const csvRows = transactions.map(txn =>
        transactionHeaderFields.map(h => {
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

  // Table header fields for summary
  const headerFields = [
    { label: 'Email', key: 'Email', flex: 2 },
    { label: 'Start Date', key: 'StartDate', flex: 1.2 },
    { label: 'Fund Value Start', key: 'FundValueStart', flex: 1.5 },
    { label: 'End Date', key: 'EndDate', flex: 1.2 },
    { label: 'Fund Value End', key: 'FundValueEnd', flex: 1.5 },
    { label: 'Profit', key: 'Profit', flex: 1 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fund Forward Summary</Text>

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
            placeholder="Search Start Date"
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
            placeholder="Search End Date"
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

      <TouchableOpacity
        style={[
          styles.button,
          (!selectedEmail || !startDate || !endDate || loadingSummary) && styles.buttonDisabled
        ]}
        onPress={fetchSummary}
        disabled={!selectedEmail || !startDate || !endDate || loadingSummary}
      >
        <Text style={styles.buttonText}>Show Summary</Text>
      </TouchableOpacity>

      {loadingSummary && <ActivityIndicator style={{ marginTop: 20 }} />}

      {/* Show Summary Table */}
      {summaryList && summaryList.length > 0 && (
        <>
          <View style={styles.tableBox}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              {headerFields.map((field, idx) => (
                <View key={field.key} style={[styles.tableCell, styles.headerCell, { flex: field.flex }]}>
                  <Text style={styles.headerText}>{field.label}</Text>
                </View>
              ))}
            </View>
            {/* Table Rows */}
            {summaryList.map((item, idx) => (
              <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                <View style={[styles.tableCell, { flex: headerFields[0].flex }]}>
                  <Text style={styles.cellText}>{item.Email}</Text>
                </View>
                <View style={[styles.tableCell, { flex: headerFields[1].flex }]}>
                  <Text style={styles.cellText}>{item.StartDate}</Text>
                </View>
                <View style={[styles.tableCell, { flex: headerFields[2].flex }]}>
                  <Text style={styles.cellText}>{item.FundValueStart}</Text>
                </View>
                <View style={[styles.tableCell, { flex: headerFields[3].flex }]}>
                  <Text style={styles.cellText}>{item.EndDate}</Text>
                </View>
                <View style={[styles.tableCell, { flex: headerFields[4].flex }]}>
                  <Text style={styles.cellText}>{item.FundValueEnd}</Text>
                </View>
                <View style={[styles.tableCell, { flex: headerFields[5].flex }]}>
                  <Text style={styles.cellText}>
                    {item.Profit !== null && item.Profit !== undefined
                      ? (item.Profit * 100).toFixed(2) + '%'
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Show Transactions Button - only after summary is shown */}
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
        </>
      )}

      {loadingTransactions && <ActivityIndicator style={{ marginTop: 20 }} />}

      {apiError !== '' && (
        <Text style={{ color: 'red', marginTop: 20, width: FIELD_WIDTH, textAlign: 'center', fontSize: 18 }}>
          {apiError}
        </Text>
      )}

      {summaryApiError !== '' && (
        <Text style={{ color: 'red', marginTop: 20, width: FIELD_WIDTH, textAlign: 'center', fontSize: 18 }}>
          {summaryApiError}
        </Text>
      )}

      {transactions && Array.isArray(transactions) && transactions.length > 0 && (
        <View style={{ width: FIELD_WIDTH }}>
          <View style={styles.downloadRow}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={downloadAsExcel} disabled={downloading}>
              <MaterialIcons name="file-download" size={28} color={downloading ? "#b0c4de" : "#4a90e2"} />
            </TouchableOpacity>
            {Platform.OS === 'web' && (
              <a ref={downloadLinkRef} style={{ display: 'none' }}>Download</a>
            )}
          </View>
          <ScrollView
            horizontal={false}
            style={[styles.tableBox, { width: FIELD_WIDTH, maxHeight: 400 }]}
            contentContainerStyle={{ width: '100%' }}
          >
            <View>
              <View style={styles.tableHeader}>
                {transactionHeaderFields.map((field) => (
                  <View key={field.key} style={[styles.tableCell, styles.headerCell, { flex: field.flex }]}>
                    <Text style={styles.headerText}>{field.label}</Text>
                  </View>
                ))}
              </View>
              {transactions.map((txn, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                  <View style={[styles.tableCell, { flex: transactionHeaderFields[0].flex }]}>
                    <Text style={styles.cellText}>{txn.FundName || '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: transactionHeaderFields[1].flex }]}>
                    <Text style={styles.cellText}>{txn.Units !== undefined ? formatDecimal(txn.Units) : '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: transactionHeaderFields[2].flex }]}>
                    <Text style={styles.cellText}>{txn.BUY_SELL || '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: transactionHeaderFields[3].flex }]}>
                    <Text style={styles.cellText}>{txn.TransInitiiationDate || '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: transactionHeaderFields[4].flex }]}>
                    <Text style={styles.cellText}>{txn.TransClosureDate || '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: transactionHeaderFields[5].flex }]}>
                    <Text style={styles.cellText}>{txn.TransInitialPrice !== undefined ? formatDecimal(txn.TransInitialPrice) : '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: transactionHeaderFields[6].flex }]}>
                    <Text style={styles.cellText}>{txn.TransClosurePrice !== undefined ? formatDecimal(txn.TransClosurePrice) : '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: transactionHeaderFields[7].flex }]}>
                    <Text style={styles.cellText}>{txn.ProfitLoss !== undefined ? formatDecimal(txn.ProfitLoss) : '-'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: transactionHeaderFields[8].flex }]}>
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
    width: FIELD_WIDTH,
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
    padding: 10,
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
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 5,
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

export default Forward;