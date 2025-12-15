import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView, Dimensions, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MultiSelect } from 'react-native-element-dropdown';
import axios from 'axios';
import Config from '../config';

const LINK = Config.LINK;
const SCREEN_WIDTH = Dimensions.get('window').width;
const FIELD_WIDTH = SCREEN_WIDTH - 40;
const BUTTON_HEIGHT = 50;
const BUTTON_COLOR = '#4a90e2';
const BUTTON_TEXT_COLOR = '#fff';
const BUTTON_RADIUS = 8;

const RuntimeProcess = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [funds, setFunds] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialValue, setInitialValue] = useState('');
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [loadingFunds, setLoadingFunds] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [startDateSearch, setStartDateSearch] = useState('');
  const [endDateSearch, setEndDateSearch] = useState('');
  const [fundSearch, setFundSearch] = useState('');
  const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);

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

  // Fetch all funds on mount
  useEffect(() => {
    setLoadingFunds(true);
    axios.get(`${LINK}/getAllFund`)
      .then(res => {
        console.log('Fund API response:', res.data); // Add this for debugging
        const fundList = Array.isArray(res.data) ? res.data : [];
        // Add "ALL" as first option
        const fundsWithAll = [{ label: 'ALL', value: 'ALL' }];
        fundList.forEach(fund => {
          fundsWithAll.push({ label: fund, value: fund });
        });
        setFunds(fundsWithAll);
        setLoadingFunds(false);
      })
      .catch((err) => {
        console.error('Fund API error:', err); // Add this for debugging
        setLoadingFunds(false);
        setFunds([{ label: 'ALL', value: 'ALL' }]); // Set at least ALL option even on error
        Alert.alert('Error', 'Failed to fetch funds');
      });
  }, []);

  // Fetch dates when email changes
  useEffect(() => {
    if (selectedEmail) {
      setLoadingDates(true);
      axios.get(`${LINK}/getProcessingDates?Email=${encodeURIComponent(selectedEmail)}`)
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

  // Validate decimal input
  const validateDecimalInput = (text) => {
    // Allow empty string, numbers, and decimal point
    const regex = /^\d*\.?\d*$/;
    return regex.test(text);
  };

  // Handle initial value change
  const handleInitialValueChange = (text) => {
    if (validateDecimalInput(text)) {
      setInitialValue(text);
    }
  };

  // Process runtime - Change to POST API
  const processRuntime = () => {
    console.log('processRuntime called');
    console.log('Selected values:', { selectedEmail, selectedFunds, startDate, endDate, initialValue });
    
    if (!selectedEmail || selectedFunds.length === 0 || !startDate || !endDate || !initialValue) {
      console.log('Validation failed - missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Validate initial value is a valid decimal
    const initialValueNum = parseFloat(initialValue);
    if (isNaN(initialValueNum) || initialValueNum <= 0) {
      console.log('Validation failed - invalid initial value');
      Alert.alert('Error', 'Please enter a valid initial value');
      return;
    }
    
    console.log('Starting API call...');
    setLoadingProcess(true);
    setApiError('');
    
    const fundParam = selectedFunds.join(',');
    
    // Prepare POST request data
    const postData = {
      Email: selectedEmail,
      Fund: fundParam,
      start_date: startDate,
      end_date: endDate,
      initial_value: initialValue
    };
    
    console.log('POST Data:', postData);
    
    axios.post(`${LINK}/processRuntime`, postData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        console.log('API Response:', res.data);
        setLoadingProcess(false);
        if (res.data && res.data.error) {
          setApiError(res.data.error);
        } else {
          Alert.alert('Success', 'Runtime processing completed successfully');
        }
      })
      .catch((err) => {
        console.error('API Error:', err);
        setLoadingProcess(false);
        
        // Show more specific error message
        if (err.response?.status === 404) {
          setApiError('API endpoint not found. Please check if the server supports processRuntime endpoint.');
        } else if (err.response?.status === 400) {
          setApiError('Bad Request: Please check your input data.');
        } else if (err.response?.status === 500) {
          setApiError('Server Error: Please try again later.');
        } else {
          const apiMsg = err?.response?.data?.error || err?.message || "Unknown error";
          setApiError(apiMsg);
        }
      });
  };

  // Filter funds based on search (by ticker initials) - preserve selected values
  const getFilteredFunds = () => {
    if (!fundSearch) return funds;
    
    // Always include selected funds in the filtered list even if they don't match search
    const selectedFundObjects = funds.filter(fund => selectedFunds.includes(fund.value));
    const searchFilteredFunds = funds.filter(fund => 
      fund.label.toLowerCase().includes(fundSearch.toLowerCase()) ||
      fund.value.toLowerCase().includes(fundSearch.toLowerCase())
    );
    
    // Combine selected and search results, remove duplicates
    const combinedFunds = [...selectedFundObjects];
    searchFilteredFunds.forEach(fund => {
      if (!combinedFunds.find(f => f.value === fund.value)) {
        combinedFunds.push(fund);
      }
    });
    
    return combinedFunds;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Runtime Process</Text>
      <Text style={styles.subtitle}>Run maximum for 1 month</Text>

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

      <Text style={styles.label}>Fund</Text>
      {loadingFunds ? (
        <ActivityIndicator />
      ) : (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Fund by Ticker"
            value={fundSearch}
            onChangeText={setFundSearch}
          />
          <View style={styles.multiSelectContainer}>
            <MultiSelect
              style={styles.multiSelect}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={getFilteredFunds()}
              labelField="label"
              valueField="value"
              placeholder={funds.length > 0 ? "Select Funds" : "No funds available"}
              value={selectedFunds}
              onChange={item => {
                setSelectedFunds(item);
                // Auto-minimize dropdown after selection
                setIsMultiSelectOpen(false);
              }}
              selectedStyle={styles.selectedStyle}
              disable={funds.length === 0}
              search
              searchPlaceholder="Search funds..."
              onFocus={() => setIsMultiSelectOpen(true)}
              onBlur={() => setIsMultiSelectOpen(false)}
              // Prevent clearing selected values when searching
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{item.label}</Text>
                    <Text style={styles.removeIcon}>×</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </>
      )}

      <Text style={styles.label}>Initial Value</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter initial value (e.g., 1000.50)"
        value={initialValue}
        onChangeText={handleInitialValueChange}
        keyboardType="decimal-pad"
      />

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
                .filter(date => {
                  if (!startDateSearch.trim()) return true;
                  
                  // Try multiple search approaches
                  const dateStr = String(date);
                  const searchTerm = startDateSearch.trim();
                  
                  return (
                    dateStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    dateStr.includes(searchTerm) ||
                    dateStr.indexOf(searchTerm) !== -1
                  );
                })
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

      <TouchableOpacity
        style={[
          styles.button,
          (!selectedEmail || selectedFunds.length === 0 || !startDate || !endDate || !initialValue || loadingProcess) && styles.buttonDisabled
        ]}
        onPress={() => {
          console.log('Run button pressed'); // Add this for debugging
          processRuntime();
        }}
        disabled={!selectedEmail || selectedFunds.length === 0 || !startDate || !endDate || !initialValue || loadingProcess}
      >
        <Text style={styles.buttonText}>Run</Text>
      </TouchableOpacity>

      {loadingProcess && <ActivityIndicator style={{ marginTop: 20 }} />}

      {apiError !== '' && (
        <Text style={{ color: 'red', marginTop: 20, width: FIELD_WIDTH, textAlign: 'center', fontSize: 18 }}>
          {apiError}
        </Text>
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
    marginBottom: 10,
    letterSpacing: 1,
    width: FIELD_WIDTH,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    width: FIELD_WIDTH,
    fontStyle: 'italic',
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
  multiSelectContainer: {
    width: FIELD_WIDTH,
    marginBottom: 10,
  },
  multiSelect: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  selectedStyle: {
    borderRadius: 12,
    backgroundColor: '#4a90e2',
    marginRight: 5,
    marginTop: 5,
  },
  textInput: {
    width: FIELD_WIDTH,
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: BUTTON_RADIUS,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
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
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 2,
    marginVertical: 2,
    backgroundColor: '#4a90e2',
    borderRadius: 12,
    maxWidth: 120,
  },
  selectedItemText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default RuntimeProcess;