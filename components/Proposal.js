import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Card } from 'react-native-paper';
import Config from '../config';
const LINK = Config.LINK;
import { commonStyles } from '../styles/commonStyles';

function PortfolioScreen(props) {
  const inp_fr_par = props.route.params.Data;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiToCal = `${LINK}getPortfolio/${inp_fr_par.id}`;
  console.log(apiToCal);

  useEffect(() => {
    fetch(apiToCal, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((Portfolio) => {
        setData(Portfolio);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching portfolio:', error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>ISIN: {item.ISIN}</Text>
        <Text style={styles.cardText}>Fund Price: {item.FundPrice}</Text>
        <Text style={styles.cardText}>Units: {item.Units}</Text>
      </View>
    </Card>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Portfolio</Text>
      </View>
      <KeyboardAvoidingView enabled>
        <View style={styles.logoContainer}>
          <Image
            source={require('../Image/logo.png')}
            style={commonStyles.ImgStyle}
          />
        </View>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.ISIN}
            />
          )}
        </View>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Ahyaasena Yoga{'\n'}Manage Portfolio{'\n'}www.abhyaasenayoga.com
        </Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    padding: 15,
  },
  cardContent: {
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
});

export default PortfolioScreen;

