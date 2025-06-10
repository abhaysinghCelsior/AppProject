// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Card } from 'react-native-paper';
import Config from '../config';
const LINK = Config.LINK;
import { commonStyles } from '../styles/commonStyles';

function RecommendScreen(props) {
  const [ISIN, setISIN] = useState('');
  const [dateOn, setDateOn] = useState('');
  const [recommendations, setRecommendations] = useState({
    Previous: { BuySellRecommend: '', Date: '' },
    Current: { BuySellRecommend: '', Date: '' },
    Next: { BuySellRecommend: '', Date: '' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!ISIN || !dateOn) {
      Alert.alert('Error', 'Please fill in both ISIN and Date');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${LINK}Recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ISIN, Date: dateOn }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Recommendation Finder</Text>
      </View>
      <KeyboardAvoidingView enabled>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setISIN(text)}
            placeholder="Enter ISIN"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="none"
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setDateOn(text)}
            placeholder="Enter Date (YYYY-MM-DD)"
            placeholderTextColor="#8b9cb5"
            keyboardType="default"
            returnKeyType="next"
          />
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Find Recommendations</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.resultContainer}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Previous Recommendation</Text>
          <Text style={styles.cardText}>
            Recommendation: {recommendations.Previous.BuySellRecommend}
          </Text>
          <Text style={styles.cardText}>Date: {recommendations.Previous.Date}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Current Recommendation</Text>
          <Text style={styles.cardText}>
            Recommendation: {recommendations.Current.BuySellRecommend}
          </Text>
          <Text style={styles.cardText}>Date: {recommendations.Current.Date}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Next Recommendation</Text>
          <Text style={styles.cardText}>
            Recommendation: {recommendations.Next.BuySellRecommend}
          </Text>
          <Text style={styles.cardText}>Date: {recommendations.Next.Date}</Text>
        </Card>
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  resultContainer: {
    marginTop: 20,
  },
  card: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
  },
});

export default RecommendScreen;