import 'react-native-reanimated';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
  Pressable
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'moti';
import { useAtom } from 'jotai';
import { role, ServerUrl, signedIn, userDirector } from '../../_helpers/constant';

const logo = require('../../img/logo.png')
const avatar = require('../../img/profileFalse.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default App = () => {
  const [currentInfo, setCurrentInfo] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRole, setRole] = useAtom(role)
  const [isSignedIn, setSignedIn] = useAtom(signedIn)
  const [isDirector, setIsDirector] = useAtom(userDirector);

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

  const ExitFromAccount = async () => {
    await AsyncStorage.removeItem('@access_token');
    setIsDirector(false)
    setSignedIn(false)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.container}>
        <View style={styles.headerLogo}>
          <Image source={logo} style={styles.logo} />
        </View>
        <ScrollView style={styles.main}>
          <View style={styles.header}>
            <View>
              <Text style={styles.textName}>
                {currentInfo.firstName}
              </Text>
              <Text style={styles.textName}>
                {currentInfo.lastName}
              </Text>
              <Text style={styles.roleInfo}>
                Employee
              </Text>
            </View>
            <Image source={avatar} style={styles.avatar} />
          </View>
        </ScrollView>
        <Pressable onPress={() => ExitFromAccount()}>
          <View style={styles.footer}>
            <Text style={styles.textClose}>
              Exit
            </Text>
          </View>
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1919',
    flex: 1,
  },
  headerLogo: {
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

  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1 / 3,
    marginHorizontal: 10,
    marginVertical: 15,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  textName: {
    marginHorizontal: 20,
    marginVertical: 5,
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },

  roleInfo: {
    marginHorizontal: 20,
    marginVertical: 10,
    fontSize: 14,
    color: 'white',
  },

  avatar: {
    width: 180,
    height: 200,
  },

  footer: {
    backgroundColor: 'rgb(235, 20, 5)',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 5,
  },

  textClose: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  }
})