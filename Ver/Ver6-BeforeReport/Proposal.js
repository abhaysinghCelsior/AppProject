import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import Config from '../config';
const LINK = Config.LINK;
import { commonStyles } from '../styles/commonStyles';

function ProposalScreen(props) {
  const inp_fr_par = props.route.params.Data;
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState({}); // Track checked items by ISIN

  const apiToCal = LINK + "getProposedFund/" + inp_fr_par.id;

  useEffect(() => {
    fetch(apiToCal, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(resp => resp.json())
      .then(Proposed => {
        setData(Proposed);
        // Initialize selected state based on RecommendedStatus
        const initialSelected = {};
        Proposed.forEach(item => {
          initialSelected[item.ISIN] = item.RecommendedStatus === 'I';
        });
        setSelected(initialSelected);
      });
  }, []);

  let BuySelMap = {
    'B': "BUY",
    'S': 'SELL',
    'SB': 'SELL BUY BEFORE',
    'BS': 'BUY AFTER SELL',
    'HOLD': 'HOLD'
  };

  const handleCheckboxToggle = (isin) => {
    setSelected(prev => ({
      ...prev,
      [isin]: !prev[isin]
    }));
  };

  const BOX_MARGIN = 4;
  const NUM_COLUMNS = 4;

  const renderItem = ({ item }) => (
    <View
      style={{
        flex: 1,
        margin: BOX_MARGIN,
        minHeight: 90,
        maxHeight: 110,
        backgroundColor: '#f7faff',
        borderWidth: 1,
        borderColor: '#e3e7ed',
        borderRadius: 10,
        padding: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      <Checkbox
        status={selected[item.ISIN] ? 'checked' : 'unchecked'}
        onPress={() => handleCheckboxToggle(item.ISIN)}
      />
      <View style={{ flex: 1, marginLeft: 2 }}>
        <Text style={[commonStyles.titleStyle, { fontWeight: 'bold', fontSize: 13 }]}>
          {item.FundName}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={[commonStyles.titleStyle, { flex: 1, fontSize: 11 }]}>
            ISIN: <Text style={{ fontWeight: 'normal' }}>{item.ISIN}</Text>
          </Text>
          <Text style={[commonStyles.titleStyle, { flex: 1, fontSize: 11 }]}>
            FundPrice: <Text style={{ fontWeight: 'normal' }}>
              {item.FundPrice !== undefined && item.FundPrice !== null
                ? Number(item.FundPrice).toFixed(1)
                : ''}
            </Text>
          </Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={[commonStyles.titleStyle, { flex: 1, fontSize: 11 }]}>
            Units: <Text style={{ fontWeight: 'normal' }}>{item.Units}</Text>
          </Text>
          <Text style={[commonStyles.titleStyle, { flex: 1, fontSize: 11 }]}>
            Buy/Sell: <Text style={{ fontWeight: 'normal' }}>{BuySelMap[item.BUY_SELL]}</Text>
          </Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={[commonStyles.titleStyle, { flex: 1, fontSize: 11 }]}>
            Stoploss: <Text style={{ fontWeight: 'normal' }}>
              {item.StopLoss !== undefined && item.StopLoss !== null
                ? Number(item.StopLoss).toFixed(1)
                : ''}
            </Text>
          </Text>
          <Text style={[commonStyles.titleStyle, { flex: 1, fontSize: 11 }]}>
            Target: <Text style={{ fontWeight: 'normal' }}>
              {item.TargetProfit !== undefined && item.TargetProfit !== null
                ? Number(item.TargetProfit).toFixed(1)
                : ''}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );

  const handleImplementProposal = async () => {
    try {
      // Collect all items with their RecommendationStatus value (true if checked, false if not)
      const selectedItems = data.map(item => ({
        ISIN: item.ISIN,
        BUY_SELL: item.BUY_SELL,
        RecommendationStatus: selected[item.ISIN] ? 'I' : '' // 'I' if checked, '' if not
      }));

      const response = await fetch(LINK + "implementRecommendations", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: inp_fr_par.email,
          SelectedItems: selectedItems
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to implement recommendations');
      }

      showAlert('Success', 'Proposal Implemented Successfully');
    } catch (err) {
      showAlert('Error', err.message);
    }
  };

  const showAlert = (title, message) => {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, idx) => item.ISIN ? item.ISIN + idx : idx.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingVertical: 6,
          paddingHorizontal: BOX_MARGIN,
          flexGrow: 1, // <-- ensures FlatList fills available space and footer is reachable
        }}
        style={{ flex: 1 }}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={{
          flex: 1,
          justifyContent: 'space-between',
        }}
        ListHeaderComponent={
          <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
            <Image
              source={require('../Image/logo.jpeg')}
              style={{
                width: 90,
                height: 90,
                resizeMode: 'contain',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                backgroundColor: '#fff',
              }}
            />
          </View>
        }
        ListFooterComponent={
          <View style={{ minHeight: 120, justifyContent: 'center', alignItems: 'center' }}>
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
            <View style={{ marginTop: 12, alignItems: 'center', width: '100%' }}>
              <Text style={[commonStyles.tailorStyle, { fontSize: 13, color: '#888', textAlign: 'center' }]}>
                LyncVest{'\n'}Manage Portfolio{'\n'}www.LyncVest.com
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}

export default ProposalScreen;

