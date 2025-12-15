import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, StyleSheet, Text, Button, FlatList, Dimensions } from 'react-native';
import { useTable } from 'react-table';
import Config from '../config';
const LINK = Config.LINK;

function BacktesttransactionsScreen(props) {
  // Get country code and start date from navigation params
  const countryCode = props.route.params.Country;
  const startDate = props.route.params.StartDate;
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(LINK + "getBTTransaction", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        CntryCode: countryCode,
        BTStrtDt: startDate
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        setTransactions(data || []);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, [countryCode, startDate]);

  const columns = useMemo(() => [
    { Header: 'Profit or Loss', accessor: 'ProfitLoss' },
    { Header: 'ISIN', accessor: 'ISIN' },
    { Header: 'Buy/Sell', accessor: 'BUY_SELL' },
    { Header: 'Units', accessor: 'Units', Cell: ({ value }) => Number(value).toFixed(0) },
    { Header: 'Trans Initial Price', accessor: 'TransInitialPrice', Cell: ({ value }) => Number(value).toFixed(1) },
    { Header: 'Trans Closure Price', accessor: 'TransClosurePrice', Cell: ({ value }) => Number(value).toFixed(1) },
    {
      Header: 'Trans Initiation Date',
      accessor: 'TransInitiiationDate',
      Cell: ({ value }) => value ? value.split('T')[0] : ''
    },
    {
      Header: 'Trans Closure Date',
      accessor: 'TransClosureDate',
      Cell: ({ value }) => value ? value.split('T')[0] : ''
    },
    { Header: 'Profit or Loss Amt', accessor: 'ProfitLossAmt' },
    { Header: 'Trans Status', accessor: 'TransStatus' },
  ], []);

  // Table rendering for React Native using FlatList for scrollable rows
  const renderHeader = () => (
    <View style={styles.tableRowHeader}>
      {columns.map((col, idx) => (
        <Text key={idx} style={styles.tableHeaderCell}>{col.Header}</Text>
      ))}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.ProfitLoss}</Text>
      <Text style={styles.tableCell}>{item.ISIN}</Text>
      <Text style={styles.tableCell}>{item.BUY_SELL}</Text>
      <Text style={styles.tableCell}>{Number(item.Units).toFixed(0)}</Text>
      <Text style={styles.tableCell}>{isNaN(Number(item.TransInitialPrice)) ? '' : Number(item.TransInitialPrice).toFixed(1)}</Text>
      <Text style={styles.tableCell}>{isNaN(Number(item.TransClosurePrice)) ? '' : Number(item.TransClosurePrice).toFixed(1)}</Text>
      <Text style={styles.tableCell}>{item.TransInitiiationDate ? item.TransInitiiationDate.split('T')[0] : ''}</Text>
      <Text style={styles.tableCell}>{item.TransClosureDate ? item.TransClosureDate.split('T')[0] : ''}</Text>
      <Text style={styles.tableCell}>{item.ProfitLossAmt}</Text>
      <Text style={styles.tableCell}>{item.TransStatus}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={styles.scrollView} horizontal>
        <View style={{ minWidth: Dimensions.get('window').width }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Backtest Transactions</Text>
          </View>
          <View style={styles.container}>
            {renderHeader()}
            <FlatList
              data={transactions}
              renderItem={renderItem}
              keyExtractor={(item, idx) => item.ISIN ? item.ISIN + idx : idx.toString()}
              style={{ maxHeight: 400 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={true}
            />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              LyncVest{'\n'}Manage Portfolio{'\n'}www.LyncVest.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
  container: {
    flex: 1,
    marginBottom: 20,
    width: '100%',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    paddingVertical: 8,
    marginBottom: 2,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    marginBottom: 2,
    elevation: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    justifyContent: 'center',
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

export default BacktesttransactionsScreen;
