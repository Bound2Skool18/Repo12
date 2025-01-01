import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DuetScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Duet Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DuetScreen;
