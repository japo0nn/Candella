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
  Pressable,
  TextInput,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';
import { Header } from '../resources/header';
import LinearGradient from 'react-native-linear-gradient';
import { useAtom } from 'jotai';
import { taskId } from '../../_helpers/constant';
import { Text, View } from 'moti';
import { ServerUrl } from '../../_helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { YaMap } from 'react-native-yamap';
import GetLocation from 'react-native-get-location';

const logo = require('../img/logo.png')
const avatar = require('../img/profileDefault.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default CreateTask = () => {
  const navigation = useNavigation()
  const [isTaskId, setTaskId] = useAtom(taskId)
  const [taskModel, setTaskModel] = useState({
    name: "",
    description: "",
    isComplete: false,
    isStarted: false,
    latitude: 0,
    longitude: 0,
  });

  const changeLoginModel = (value, name) => {
    setTaskModel((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getToken = async () => {
    const value = await AsyncStorage.getItem('@access_token')
    return JSON.parse(value);
  };

  const onPressBtn = async () => {
    if (taskModel.name != '' && taskModel.description != '') {
      let access_token = await getToken();
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        body: JSON.stringify(taskModel),
      }
      const url = ServerUrl + '/api/ToDoes/Create';
      console.log(url)
      console.log(options.body)
      await fetch(url, options)
        .then((response) => {
          navigation.navigate('ClientsMain')
          changeLoginModel('', "name")
          changeLoginModel('', "description")
          setTaskId(response.json())
        })
        .catch((response) => console.log(response.status))
    }
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getLocation = async () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then(location => {
            console.log(location);
            changeLoginModel(location.latitude, 'latitude')
            changeLoginModel(location.longitude, 'longitude')
          })
          .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
          })
      }
    })
  }

  useEffect(() => {
    getLocation()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.container}>
        <Header />
        <Text style={styles.header}>Create Task</Text>
        <ScrollView>
          <TextInput
            placeholder='Task Name'
            style={styles.inputText}
            placeholderTextColor="#c2c2c2"
            maxLength={100}
            value={taskModel.name}
            onChangeText={(e) => changeLoginModel(e, "name")}
          />
          <TextInput
            placeholder='Description'
            style={[styles.inputText, styles.descInput]}
            placeholderTextColor="#c2c2c2"
            maxLength={100}
            value={taskModel.description}
            onChangeText={(e) => changeLoginModel(e, "description")}
          />
        </ScrollView>
        <Pressable onPress={onPressBtn}>
          <View style={styles.publishBtn}>
            <Text style={styles.publishText}>Set Location</Text>
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

  header: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 7,
  },

  inputText: {
    borderRadius: 10,
    width: windowWidth - 60,
    marginTop: 20,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 30,
    padding: 10
  },

  descInput: {
    height: 300,
    textAlignVertical: 'top',
  },

  publishBtn: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 60,
    marginHorizontal: 30,
    bottom: 5,
  },

  publishText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

})