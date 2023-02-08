import 'react-native-reanimated';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { Header } from '../resources/header';
import LinearGradient from 'react-native-linear-gradient';
import { useAtom } from 'jotai';
import { DepId, selectedDep, ServerUrl } from '../../_helpers/constant';
import { Text, View } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../img/logo.png')
const avatar = require('../img/profileDefault.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;



export default ShowTasks = () => {
  const [taskInfo, setTaskInfo] = useState([]);
  const [isDepId, setDepId] = useAtom(DepId)
  const [modalVisible, setModalVisible] = useState(false)
  const [employeesInfo, setEmployeesInfo] = useState([])
  const [selectedId, setSelectedId] = useState()
  const [taskId, setTaskId] = useState()

  useEffect(() => {
    getFreeTasks()
  }, [])

  const getToken = async () => {
    const value = await AsyncStorage.getItem('@access_token')
    return JSON.parse(value);
  };

  const getFreeTasks = async() => {
    let access_token = await getToken();
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    }
    url = ServerUrl + '/api/ToDoes/GetFreeTasks' 
    await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        setTaskInfo(response)
      })
      .catch((er) => console.log(er))
  }

  const getEmployees = async() => {
    let access_token = await getToken();
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    }
    url = ServerUrl + '/api/Departments/GetEmployees' 
    await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        setEmployeesInfo(response)
      })
      .catch((er) => console.log(er))
  }

  const onConfirmGetting = async () => {
    if (selectedId != null){
      let access_token = await getToken();
      console.log(access_token)
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        body: JSON.stringify({
          departmentId: isDepId,
          employeeId: selectedId,
          id: taskId,
        })
      }
      const url = ServerUrl + "/api/ToDoes/setEmployee";
      console.log(url)
      console.log(options.body)
      fetch(url, options)
        .then(() => {
          setModalVisible(false)
          getFreeTasks()
        })
        .catch((er) => console.log(er))
    }
  }

  const onPressGetTask = ({id}) => {
    console.log(id)
    setTaskId(id)
    getEmployees()
    setModalVisible(true)
  }

  const TaskList = ({task}) =>{
    let info = task.client
    return(
      <View style={styles.wrapElement}>
          <Text style={styles.textList}>
            {info.firstName}
          </Text>
          <View style={styles.wrapInfo}>
            <View>
              <Text style={styles.textInfo}>{task.name}</Text>
              <Text style={styles.textInfo}>{task.description}</Text>
            </View>
            <Pressable style={styles.btn} onPress={() => onPressGetTask(task)}>
              <Text style={{ color: '#fff', marginVertical: 5, fontSize: 16 }}>Get Task</Text>
            </Pressable>
          </View>
      </View>
    )
  }

  const EmployeeList = ({item, onPress, color, backgroundColor}) => {
    return(
      <Pressable onPress={onPress}>
        <View style={[styles.empListWrap, {backgroundColor: backgroundColor}]}>
          <Text style={{color: color, fontSize: 16}}>{item.firstName} {item.lastName}</Text>
        </View>
      </Pressable>
    )
  }

  const onPressEmployee = (item) => {
    selectedId ? setSelectedId() : setSelectedId(item.id)
  }

  const renderItem = ({item}) => {
    const color = item.id === selectedId ? 'black' : 'white';
    const backgroundColor = item.id === selectedId ? 'white' : '';

    return (
      <EmployeeList
        item={item}
        onPress={() => onPressEmployee(item)}
        color={color}
        backgroundColor={backgroundColor}
      />
    );
  };

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
              <Text style={styles.textStyle}>Set the Employee to Task</Text>
              <FlatList
                  data={employeesInfo}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  style={{marginVertical: 10}}
                />
              <View style={styles.buttonWrap}>
                <Pressable
                  style={[styles.buttonCreate]}
                  onPress={() => onConfirmGetting()}>
                  <Text style={styles.textStyle}>Get</Text>
                </Pressable>
                <Pressable
                  style={[styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Text style={styles.header}></Text>
          <Text style={styles.taskHeader}>Get new Tasks</Text>
          <View style={styles.wrapList}>
            <FlatList
              data={taskInfo}
              renderItem={({ item }) => <TaskList task={item}/>}
            />
          </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1919',
    flex: 1,
  },

  wrapList: {
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wrapElement: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 7,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  wrapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 280,
  },

  header: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },

  taskHeader: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },

  textList: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },

  textInfo: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
  },

  btn: {
    backgroundColor: '#05d2f2',
    paddingHorizontal: 20,
    borderRadius: 10,
    right: 0,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 100,
  },

  modalView: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
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

  empListWrap: {
    borderRadius: 7,
    padding: 10,
    paddingHorizontal: 40,
    marginVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }

})