import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const BUTTON_WIDTH = 250;
const BUTTON_HEIGHT = 50;
const BUTTON_COLOR = '#4a90e2';
const BUTTON_TEXT_COLOR = '#fff';
const BUTTON_RADIUS = 8;
const RecommendationMenuScreen = (props) => {
  const Data = props.route.params.Data;
  console.log('--------HOME---------');
  console.log(Data.email);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.navigation.navigate('Proposal', { Data: Data })}
      >
        <Text style={styles.buttonText}>Proposal</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.button}
      onPress={() => props.navigation.navigate('Recommend', { Data: Data })}
    >
      <Text style={styles.buttonText}>Recommend</Text>
    </TouchableOpacity>
  </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eddfdf',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: BUTTON_COLOR,
    borderRadius: BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  buttonText: {
    color: BUTTON_TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecommendationMenuScreen;