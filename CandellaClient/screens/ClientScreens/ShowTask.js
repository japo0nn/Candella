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
  const [taskInfo, setTaskInfo] = useState()
  const [departmentInfo, setDepartmentInfo] = useState()
  const [employeeInfo, setEmployeeInfo] = useState()
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

  const getTaskInfo = () => {
    const result = requestLocationPermission();
    result.then(async (res) => {
      if (res) {
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
            setDepartmentInfo(response.department)
            setEmployeeInfo(response.employee)
            console.log(response)
            setLoading(false)
            FillPoints()
          })
          .catch((er) => console.log(er))
      }
    })

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

  const timer = useRef(null);

  useEffect(() => {
    getTaskInfo()
  }, []);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.container}>
        <Header />
        {isLoading ? (<ActivityIndicator size="large" color="white" animating={true} style={{ flex: 1 }} />) : (
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', marginHorizontal: 10, marginTop: 10, fontSize: 16 }}>Department: {departmentInfo.name}</Text>
            <Text style={{ color: 'white', fontWeight: 'bold', marginHorizontal: 10, fontSize: 16 }}>Task Name: {taskInfo.name}</Text>
            <Text style={{ color: 'white', fontWeight: 'bold', marginHorizontal: 10, fontSize: 16 }}>Description: {taskInfo.description}</Text>
            <Text style={{ color: 'white', fontWeight: 'bold', marginHorizontal: 10, marginBottom: 10, fontSize: 16 }}>Employee: {employeeInfo.firstName} {employeeInfo.lastName}</Text>
            <View style={{ flex: 1}}>
              <YaMap
                ref={this.map}
                rotateGesturesEnabled={false}
                mapType={'vector'}
                initialRegion={{
                  lat: employeeInfo.latitude,
                  lon: employeeInfo.longitude,
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
                  point={{ lat: employeeInfo.latitude, lon: employeeInfo.longitude }}
                  scale={2.5} 
                  children={<Image source={employee} style={{width: 20, height: 20}} />}
                  />
              </YaMap>
            </View>
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