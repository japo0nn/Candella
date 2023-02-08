import 'react-native-reanimated';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { MotiView } from 'moti';
import { atom, useAtom } from 'jotai';
import { role } from '../../_helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServerUrl } from '../../_helpers/constant';

const logo = require('../../img/logo.png')
const avatar = require('../../img/profileFalse.png')
const windowWidth = Dimensions.get('window').width;

export const Header = () => {
  const [currentInfo, setCurrentInfo] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRole, setRole] = useAtom(role)

  useEffect(() => {
    getData()
  }, [])


  const getToken = async () => {
    const value = await AsyncStorage.getItem('@access_token')
    return JSON.parse(value);
  };

  const getData = async () => {
    let access_token = await getToken();
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      }
    }

    const url = ServerUrl + "/api/" + isRole + "/Current";
    fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        setCurrentInfo(response)
        setLoading(false)
      })
      .catch((err) => console.log(err))
  }

  return (
    <MotiView style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <MotiView style={{ flexDirection: 'row', alignItems: 'center', }}>
        <Text style={{ color: '#fff' }}>{currentInfo.firstName}</Text>
        <Image source={avatar} style={styles.avatar} />
      </MotiView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth,
    paddingHorizontal: 30,
  },

  logo: {
    width: 150,
    height: 70,
  },

  avatar: {
    marginLeft: 15,
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
  },
})