import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, StyleSheet, Text, Button } from 'react-native';
import { useTable } from 'react-table';
import Config from '../config';
const LINK = Config.LINK;

function BacktestsummaryScreen(props) {
  const inp_fr_par = props.route.params.Data;
  const [summary, setsummary] = useState([]);

  useEffect(() => {
    fetch(LINK + "getBTSummary/" + inp_fr_par.CntryCode, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(resp => resp.json())
      .then(data => {
        setsummary(data || []);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const columns = useMemo(() => [
    { Header: 'Country', accessor: 'CntryCode' },
    { Header: 'Start Date', accessor: 'BTStrtDt' },
    { Header: 'End Date', accessor: 'BTEndDt' },
    { Header: 'Start Value', accessor: 'BTStrtVal', Cell: ({ value }) => Number(value).toFixed(0) },
    { Header: 'End Value', accessor: 'BTEndVal', Cell: ({ value }) => Number(value).toFixed(0) },
    { Header: '% Change', accessor: 'BTPerChng', Cell: ({ value }) => Number(value).toFixed(0) },
    { Header: 'Profit', accessor: 'ProfitCount', Cell: ({ value }) => Number(value).toFixed(0) },
    { Header: 'Loss', accessor: 'LossCount', Cell: ({ value }) => Number(value).toFixed(0) },
    {
      Header: 'Details',
      accessor: 'details',
      Cell: ({ row }) => (
        <Button
          title="Details"
          color="#007bff"
          onPress={() => handleDetails(row.original)}
        />
      ),
    },
  ], []);

  const handleDetails = (rowData) => {
    // Navigate to BacktesttransactionsScreen with Country and Start Date
    props.navigation.navigate('Backtesttransactions', {
      Country: rowData.CntryCode,
      StartDate: rowData.BTStrtDt,
    });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: summary });

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Backtest Transactions</Text>
      </View>
      <View style={styles.container}>
        <View {...getTableProps()} style={styles.table}>
          {headerGroups.map(headerGroup => (
            <View {...headerGroup.getHeaderGroupProps()} style={styles.tableRowHeader}>
              {headerGroup.headers.map(column => (
                <Text {...column.getHeaderProps()} style={styles.tableHeaderCell}>
                  {column.render('Header')}
                </Text>
              ))}
            </View>
          ))}
          <View {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <View {...row.getRowProps()} style={styles.tableRow}>
                  {row.cells.map(cell => (
                    <View {...cell.getCellProps()} style={styles.tableCell}>
                      {cell.render('Cell')}
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          LyncVest{'\n'}Manage Portfolio{'\n'}www.LyncVest.com
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
  container: {
    flex: 1,
    marginBottom: 20,
    width: '100%',
  },
  table: {
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

export default BacktestsummaryScreen;
