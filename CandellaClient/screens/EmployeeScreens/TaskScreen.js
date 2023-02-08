import 'react-native-reanimated';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
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
import { Marker, YaMap } from 'react-native-yamap';
import GetLocation from 'react-native-get-location';

const employee = require('../../img/employee.png')
const client = require('../../img/client.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

map = React.createRef();

export default CreateTask = () => {
  const navigation = useNavigation()
  const [isTaskId, setTaskId] = useAtom(taskId)
  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()
  const [taskInfo, setTaskInfo] = useState();
  const [clientInfo, setClientInfo] = useState()
  const [isLoading, setLoading] = useState(true)

  const getCamera = () => {
    return new Promise((resolve, reject) => {
      if (this.map.current) {
        this.map.current.getCameraPosition((position) => {
          resolve(position);
          console.log(position)
        });
      } else {
        reject('ERROR');
      }
    })
  }

  const FillPoints = async () => {
    const camera = await getCamera();
    if (camera != 'ERROR') {
      this.map.current.fitAllMarkers()
    }
  }

  const getToken = async () => {
    const value = await AsyncStorage.getItem('@access_token')
    return JSON.parse(value);
  };

  const getTaskInfo = async () => {
    const access_token = await getToken()
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    }
    url = ServerUrl + '/api/ToDoes/getTaskById?TaskId=' + isTaskId;
    await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        setTaskInfo(response)
        console.log(response)
        setClientInfo(response.client)
        console.log(response.client)
      })
      .catch((er) => console.log(er))

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
      if (res) {
        GetLocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 15000,
        })
          .then(async (location) => {
            let access_token = await getToken();
            const options = {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token,
              },
              body: JSON.stringify({
                latitude: location.latitude,
                longitude: location.longitude,
              })
            }
            const url = ServerUrl + "/api/Employees/setLocation";
            console.log(url)
            console.log(options.body)
            await fetch(url, options)
              .then((response) => {
                console.log(response.status)
              })
              .catch((er) => console.log(er))
            setLatitude(location.latitude)
            setLongitude(location.longitude)
            setLoading(false)
            FillPoints()
          })
          .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
          })
      }
    })
  }

  const setTaskStatusToStarted = async () => {
    let access_token = await getToken();
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify({
        id: taskInfo.id,
        isStarted: true,
      })
    }
    const url = ServerUrl + "/api/ToDoes/updateStartStatus";
    console.log(url)
    console.log(options.body)
    fetch(url, options)
      .then((response) => {
        console.log(response.status)
        getTaskInfo()
      })
      .catch((er) => console.log(er))
  }

  const setTaskStatusToComplete = async () => {
    let access_token = await getToken();
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify({
        id: taskInfo.id,
        isComplete: true,
      })
    }
    const url = ServerUrl + "/api/ToDoes/updateCompleteStatus";
    console.log(url)
    console.log(options.body)
    await fetch(url, options)
      .then((response) => {
        console.log(response.status)
        getTaskInfo()
      })
      .catch((er) => console.log(er))
  }

  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => getLocation(), 5000);
    getTaskInfo()
    return () => {
      clearInterval(timer.current);
    };
  }, []);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.container}>
        <Header />
        {isLoading ? (<ActivityIndicator size="large" color="white" animating={true} style={{ flex: 1 }} />) : (
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', marginHorizontal: 10, marginTop: 10, fontSize: 16 }}>Client: {clientInfo.firstName} {clientInfo.lastName}</Text>
            <Text style={{ color: 'white', fontWeight: 'bold', marginHorizontal: 10, fontSize: 16 }}>Task Name: {taskInfo.name}</Text>
            <Text style={{ color: 'white', fontWeight: 'bold', marginHorizontal: 10, marginBottom: 10, fontSize: 16 }}>Description: {taskInfo.description}</Text>
            <View style={{ flex: 1, marginBottom: 60 }}>
              <YaMap
                ref={this.map}
                rotateGesturesEnabled={false}
                mapType={'vector'}
                initialRegion={{
                  lat: latitude,
                  lon: longitude,
                  zoom: 16,
                }}
                showUserPosition={false}
                style={{ flex: 1 }}>

                <Marker
                  point={{ lat: taskInfo.latitude, lon: taskInfo.longitude }}
                  scale={2.5}
                  children={<Image source={client} style={{width: 20, height: 20}} />}
                />
                <Marker
                  point={{ lat: latitude, lon: longitude }}
                  scale={2.5} 
                  children={<Image source={employee} style={{width: 20, height: 20}} />}
                  />
                  
              </YaMap>
            </View>
            {taskInfo.isStarted ?
              taskInfo.isComplete ? (
                <View style={styles.footer}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Task Completed</Text>
                </View>
              ) :
                (<Pressable style={[styles.footer, { backgroundColor: '#0fff70' }]}
                  onPress={() => setTaskStatusToComplete()}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Complete Task</Text>
                </Pressable>) : (
                <Pressable style={[styles.footer, { backgroundColor: '#05d2f2' }]}
                  onPress={() => setTaskStatusToStarted()}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Start Task</Text>
                </Pressable>
              )}
          </View>)}
      </LinearGradient>
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1919',
    flex: 1,
  },

  footer: {
    position: 'absolute',
    flex: 1,
    bottom: 1,
    width: windowWidth,
    justifyContent: 'center',
    height: 60,
  },


})