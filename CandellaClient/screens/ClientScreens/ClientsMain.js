import 'react-native-reanimated';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Pressable,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { Header } from '../resources/header';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAtom } from 'jotai';
import { role, ServerUrl, DepId, selectedDep, initTask, taskInfo, taskId } from '../../_helpers/constant';
import { MotiImage, MotiView, Text, View } from 'moti';
import { combineTransition } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const logo = require('../../img/logo.png')
const avatar = require('../../img/profileDefault.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const createDep = require('../../img/create.png')

export default App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isTaskInfo, setTaskInfo] = useState([])
  const [isTaskId, setTaskId] = useAtom(taskId)

  const navigation = useNavigation()

  const onPressTask = (taskId) => {
    navigation.navigate("ShowTask")
    setTaskId(taskId)
  }


  const changeLoginModel = (value, name) => {
    setDepModel((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    getTasks()
  }, [])


  const getToken = async () => {
    const value = await AsyncStorage.getItem('@access_token')
    return JSON.parse(value);
  };

  const getTasks = async () => {
    let access_token = await getToken();
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      }
    }
    const taskUrl = ServerUrl + "/api/ToDoes/getTasksByClientId";

    await fetch(taskUrl, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        setTaskInfo(response)
        setIsLoading(false)
      })
      .catch((err) => console.log(err))
  }

  const GetActiveTasks = ({task, isAccepted, isStarted}) =>{
    return(
      <View style={styles.wrap}>
        <View>
          <Text style={styles.text}>
            {task.name}
          </Text>
          <Text style={[styles.text, {fontWeight: 'thin'}]}>
            {task.description}
          </Text>
        </View>
        { isStarted ? (<Pressable style={styles.btn} onPress={() => onPressTask(task.id)}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Show</Text>
        </Pressable>) : 
        isAccepted ? (<Text style={{color: 'green', fontWeight: 'bold'}}>Accepted</Text>)
           : (<Text style={{color: 'red'}}>Not Accepted yet</Text>)}
      </View>
    )
  }

  const renderItem = ({item}) => {
    const isAccepted = item.departmentId === null ? false : true;
    const isStarted = item.isStarted ? true : false;

    console.log(isAccepted)

    return(
      <GetActiveTasks 
        task={item} 
        isAccepted={isAccepted}
        isStarted={isStarted}/>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.container}>
        <Header />
          <View style={styles.header}>
            <Text style={styles.text}>
              Your Active Tasks
            </Text>
          </View>
          <FlatList
            data={isTaskInfo}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
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
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  wrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  text: {
    color: '#fff',
    marginVertical: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },

  wrapList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },

  textList: {
    color: '#fff',
    marginVertical: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },

  btn: {
    borderRadius: 5,
    backgroundColor: '#05d2f2',
    paddingHorizontal: 15,
    paddingVertical: 5,
    right: 0,
  }
})