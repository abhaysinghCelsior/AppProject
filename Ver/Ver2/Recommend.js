// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef,useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import Config from '../config';
LINK=Config.LINK

function RecommendScreen  (props) {
    const [ISIN, setISIN] = useState("");
    const [Date, setDate] = useState("");
    const [result, setResult] = useState({ long: "", short: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fetchTrigger, setFetchTrigger] = useState(false); // Trigger for useEffect
    apiToCal=LINK+"Recommend"
    var dataToSend = {ISIN: ISIN, Date: Date};
    useEffect(() => {
        const fetchData = async () => {
          if (!fetchTrigger) return; // Skip on initial render
          setLoading(true);
          setError("");
    
          try {
            const response = await fetch(apiToCal, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            });
    
            if (!response.ok) {
              throw new Error("Failed to fetch data from the server");
            }
    
            const data = await response.json();
            alert(data['BuySellRecommend'])
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
            setFetchTrigger(false); // Reset fetch trigger
          }
        };
    
        fetchData();
      }, [fetchTrigger, ISIN, Date]); // Dependencies to watch
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (ISIN && Date) {
          setFetchTrigger(true); // Trigger useEffect
        } else {
          setError("Both ISIN and Date are required");
        }
      };
  return (
    <View style={styles.mainBody}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(ISIN) =>
                  setISIN(ISIN)
                }
                placeholder="Enter ISIN" 
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                returnKeyType="next"
                underlineColorAndroid="#f000"
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(Date) =>
                  setDate(Date)
                }
                placeholder="Enter Date on Which want system to recommend" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                onSubmitEditing={Keyboard.dismiss}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmit}>
              <Text style={styles.buttonTextStyle}>Find</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default RecommendScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});