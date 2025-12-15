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
      'BS': 'BUY AFTER SELL'
    };
    const renderItem = ({ item }) => (
        <View style={commonStyles.inputStyle}>
          <Text style={commonStyles.titleStyle}>ISIN:            {item.ISIN}</Text>
          <Text style={commonStyles.titleStyle}>FundPrice:   {item.FundPrice}</Text>
          <Text style={commonStyles.titleStyle}>UNITS:         {item.Units}</Text>
          <Text style={commonStyles.titleStyle}>BUY/SELL:   {BuySelMap[item.BUY_SELL]}</Text>
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
          <ScrollView
            contentContainerStyle={commonStyles.scrollView}
            showsVerticalScrollIndicator={true}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../Image/logo.jpeg')}
                style={{ width: 180, height: 180, marginBottom: 10, resizeMode: 'contain' }}
              />
            </View>
            <View style={commonStyles.container}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, idx) => item.ISIN ? item.ISIN + idx : idx.toString()}
                showsVerticalScrollIndicator={true}
                style={{ maxHeight: 400 }}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
              <Button
                mode="contained"
                style={{ marginTop: 20, backgroundColor: '#007bff' }}
                onPress={handleImplementProposal}
              >
                Implement Proposal
              </Button>
            </View>
            <View style={commonStyles.SectionStyle}>
              <Text style={commonStyles.tailorStyle}>
                LyncVest{'\n'}Manage Portfolio{'\n'}www.LyncVest.com
              </Text>
            </View>
          </ScrollView>
        </View>
  )};

export default ProposalScreen;

