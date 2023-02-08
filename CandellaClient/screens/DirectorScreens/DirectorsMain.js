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
import { role, ServerUrl, DepId, selectedDep } from '../../_helpers/constant';
import { MotiImage, MotiView, Text, View } from 'moti';
import { useNavigation } from '@react-navigation/native';
import { Tasks } from '../resources/tasklist';

const logo = require('../../img/logo.png')
const avatar = require('../../img/profileDefault.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const createDep = require('../../img/create.png')


export default App = () => {
  const [DepInfo, SetDepInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isRole, setRole] = useAtom(role)
  const [modalVisible, setModalVisible] = useState(false)
  const [isDepId, setDepId] = useAtom(DepId)
  const [isDep, setDep] = useState(true)
  const [taskInfo, setTaskInfo] = useState([]);

  const [depModel, setDepModel] = useState({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    dateCreated: "2023-01-25T09:52:38.578Z",
    name: "",
    directorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  });

  const changeLoginModel = (value, name) => {
    setDepModel((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    getDep()
    getTasks()
  }, [])


  const getToken = async () => {
    const value = await AsyncStorage.getItem('@access_token')
    return JSON.parse(value);
  };

  const getDep = async () => {
    let access_token = await getToken();
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    }
    url = ServerUrl + '/api/Departments/GetDepartment'
    await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        SetDepInfo(response)
        setIsLoading(false)
        setDep(false)
        setDepId(response.id)
      })
      .catch((er) => console.log(er))
  }


  const createDepartment = async () => {
    let access_token = await getToken();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify(depModel)
    }
    if (depModel.name != "") {
      console.log(options.body)
      const url = ServerUrl + '/api/Departments/Create';
      console.log(url)
      await fetch(url, options)
        .then((response) => response.json())
        .then((response) => {
          console.log(response)
          setModalVisible(!modalVisible)
          getDep()
        })
    }
  }

  const getTasks = async () => {
    let access_token = await getToken();
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    }
    url = ServerUrl + '/api/ToDoes/GetTasksByDepartmentId'
    await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        setTaskInfo(response)
        console.log(response)
        setIsLoading(false)
      })
      .catch((er) => console.log(er))
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.container}>
        <Header />
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.textStyle}>Name your Department</Text>
              <TextInput placeholder='Type Department name'
                style={styles.inputText}
                placeholderTextColor="#c2c2c2"
                maxLength={50}
                value={depModel.name}
                onChangeText={(e) => changeLoginModel(e, "name")}
              />
              <MotiView style={styles.buttonWrap}>
                <Pressable
                  style={[styles.buttonCreate]}
                  onPress={() => createDepartment()}>
                  <Text style={styles.textStyle}>Create</Text>
                </Pressable>
                <Pressable
                  style={[styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </MotiView>
            </View>
          </View>
        </Modal>
        {isDep ? (<Pressable onPress={() => setModalVisible(true)}>
          <View style={styles.wrap}>
            <Text style={styles.text}>
              Create new Department
            </Text>
            <MotiImage source={createDep} style={{ width: 25, height: 25 }} />
          </View>
        </Pressable>) : 
        (isLoading ? (<ActivityIndicator size="large" color="white" animating={true} />) : (
          <View>
            <Text style={styles.textDep}>{DepInfo.name}</Text>
          </View>
        ))}
        <FlatList 
          data={taskInfo}
          renderItem={({ item }) => <Tasks task={item}/>}
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

})