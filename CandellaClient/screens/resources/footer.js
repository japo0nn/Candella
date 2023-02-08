import 'react-native-reanimated';
import React from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  View,
} from 'react-native';
import { MotiView } from 'moti';

// const home = require('../../img/homeTrue.png')
// const settings = require('../../img/settingsFalse.png')
// const chat = require('../../img/chatFalse.png')
// const notifyFalse = require('../../img/notifyOffFalse.png')

const size = 25;

const windowWidth = Dimensions.get('window').width;

export const Footer = () => {
  return (
    <MotiView style={styles.footer}>
      <View style={styles.wrap}>
        <Image source={home} style={styles.icons} />
      </View>
      <Image source={chat} style={styles.icons} />
      <Image source={notifyFalse} style={styles.icons} />
      <Image source={settings} style={styles.icons} />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    width: windowWidth,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },

  wrap: {
    width: size * 2,
    height: size * 2,
    borderRadius: size,
    backgroundColor: '#09f205',
    justifyContent: 'center',
    alignItems: 'center',

  },

  icons: {
    width: size,
    height: size,
    margin: 10,
  }
})