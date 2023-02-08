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
  ActivityIndicator,
} from 'react-native';
import { Header } from '../resources/header';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAtom } from 'jotai';
import { role, ServerUrl, DepId, selectedDep, taskId } from '../../_helpers/constant';
import { MotiImage, MotiView, Text, View } from 'moti';
import { useNavigation } from '@react-navigation/native';
import { Tasks } from '../resources/tasklist';

const logo = require('../../img/logo.png')
const avatar = require('../../img/profileDefault.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const createDep = require('../../img/create.png')


export default App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [taskInfo, setTaskInfo] = useState([]);
  const [isTaskId, setTaskId] = useAtom(taskId)
  const navigation = useNavigation()

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
      },
    }
    url = ServerUrl + '/api/ToDoes/GetTasksByEmployeeId'
    await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        setTaskInfo(response)
        console.log(response)
        setIsLoading(true)
      })
      .catch((er) => console.log(er))
  }

  const TaskContainer = ({task}) => {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={styles.text}>
            {task.name}
          </Text>
          <Text style={[styles.text, {fontWeight: 'thin'}]}>
            {task.description}
          </Text>
        </View>
        <Pressable style={styles.btn} onPress={() => {
          setTaskId(task.id)
          navigation.navigate('TaskScreen')}}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Show</Text>
        </Pressable>
      </View>
    )
  }

  const renderItem = ({item}) => {

    return(
      <TaskContainer 
        task={item}/>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.container}>
        <Header />
        {isLoading ? (
        <View>
          <FlatList
            data={taskInfo}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>) : (<ActivityIndicator size="large" color="white" animating={true} style={{flex: 1}}/>)}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1919',
    flex: 1,
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

  textDep: {
    color: 'white',
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 7,
    textAlign: 'center',
  },  

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  modalView: {
    margin: 30,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 25,
    padding: 40,
    alignItems: 'center',
  },

  buttonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  buttonCreate: {
    borderRadius: 10,
    padding: 10,
    marginRight: 50,
  },

  buttonClose: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'red',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  inputText: {
    borderRadius: 10,
    width: 200,
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  btn: {
    backgroundColor: '#05d2f2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    right: 0,
  }

})