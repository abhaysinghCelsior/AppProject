import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { Button } from 'react-native-paper';
import Config from '../config';
const LINK = Config.LINK;
import { commonStyles } from '../styles/commonStyles';

function ProposalScreen (props) {
    const inp_fr_par = props.route.params.Data;
    const [data,setData] = useState([])
    const apiToCal = LINK+"getProposedFund/"+inp_fr_par.id

    useEffect(() => 
      {
        fetch(apiToCal, {
          method: 'GET',
          headers: {
            'Content-Type':'application/json'
          },
        })
        .then(resp => resp.json())
        .then(
          Proposed =>{setData(Proposed)
        })
      },[]  );
    let BuySelMap= {
      'B': "BUY",
      'S': 'SELL',
      'SB': 'SELL BUY BEFORE',
      'BS': 'BUY AFTER SELL',
      'HOLD': 'HOLD'
    };
    const renderItem = ({ item }) => (
        <View style={commonStyles.inputStyle}>
          <Text style={commonStyles.titleStyle}>ISIN:            {item.ISIN}</Text>
          <Text style={commonStyles.titleStyle}>Fund Name:   {item.FundName}</Text>
          <Text style={commonStyles.titleStyle}>FundPrice:   {item.FundPrice}</Text>
          <Text style={commonStyles.titleStyle}>UNITS:         {item.Units}</Text>
          <Text style={commonStyles.titleStyle}>BUY/SELL:   {BuySelMap[item.BUY_SELL]}</Text>
          <Text style={commonStyles.titleStyle}>Stoploss:    {item.StopLoss}</Text>
          <Text style={commonStyles.titleStyle}>Target:      {item.TargetProfit}</Text>
        </View>
      );
    
      const handleImplementProposal = async () => {
        try {
          const response = await fetch(LINK + "implementRecommendations", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Email: inp_fr_par.email }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to implement recommendations');
          }
  
          Alert.alert('Success', 'Proposal Implemented Successfully');
          // You can navigate or refresh as needed here
        } catch (err) {
          Alert.alert('Error', err.message);
        }
      };
    
      return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Image
              source={require('../Image/logo.jpeg')}
              style={{
                width: 90,
                height: 90,
                marginBottom: 8,
                resizeMode: 'contain',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                backgroundColor: '#fff',
              }}
            />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 12, paddingBottom: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 18,
                padding: 0,
                elevation: 4,
                marginBottom: 10,
                overflow: 'hidden',
              }}
            >
              <FlatList
                data={data}
                renderItem={({ item }) => (
                  <View
                    style={{
                      marginHorizontal: 10,
                      marginVertical: 8,
                      padding: 14,
                      borderRadius: 12,
                      backgroundColor: '#f7faff',
                      borderWidth: 1,
                      borderColor: '#e3e7ed',
                      shadowColor: '#000',
                      shadowOpacity: 0.06,
                      shadowRadius: 2,
                      shadowOffset: { width: 0, height: 1 },
                    }}
                  >
                    <Text style={[commonStyles.titleStyle, { fontWeight: 'bold', fontSize: 16, marginBottom: 2 }]}>
                      {item.FundName}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                      <Text style={[commonStyles.titleStyle, { flex: 1 }]}>ISIN: <Text style={{ fontWeight: 'normal' }}>{item.ISIN}</Text></Text>
                      <Text style={[commonStyles.titleStyle, { flex: 1 }]}>FundPrice: <Text style={{ fontWeight: 'normal' }}>{item.FundPrice}</Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                      <Text style={[commonStyles.titleStyle, { flex: 1 }]}>Units: <Text style={{ fontWeight: 'normal' }}>{item.Units}</Text></Text>
                      <Text style={[commonStyles.titleStyle, { flex: 1 }]}>Buy/Sell: <Text style={{ fontWeight: 'normal' }}>{BuySelMap[item.BUY_SELL]}</Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                      <Text style={[commonStyles.titleStyle, { flex: 1 }]}>Stoploss: <Text style={{ fontWeight: 'normal' }}>{item.StopLoss}</Text></Text>
                      <Text style={[commonStyles.titleStyle, { flex: 1 }]}>Target: <Text style={{ fontWeight: 'normal' }}>{item.TargetProfit}</Text></Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item, idx) => item.ISIN ? item.ISIN + idx : idx.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 8 }}
                style={{ flex: 1 }}
              />
            </View>
            <Button
              mode="contained"
              style={{
                marginTop: 10,
                backgroundColor: '#007bff',
                borderRadius: 10,
                paddingVertical: 10,
              }}
              onPress={handleImplementProposal}
              labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
            >
              Implement Proposal
            </Button>
            <View style={[commonStyles.SectionStyle, { marginTop: 12, alignItems: 'center' }]}>
              <Text style={[commonStyles.tailorStyle, { fontSize: 13, color: '#888' }]}>
                LyncVest{'\n'}Manage Portfolio{'\n'}www.LyncVest.com
              </Text>
            </View>
          </View>
        </View>
  )};

export default ProposalScreen;

