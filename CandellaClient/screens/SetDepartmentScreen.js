import 'react-native-reanimated';
import React from 'react';
import { useState, setState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  Pressable,
  Dimensions,
  Switch,
  StatusBar,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { View, MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { ServerUrl, token } from '../_helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom, useAtom } from 'jotai';
import { role, signedIn , userDirector, userEmployee} from '../_helpers/constant';

const check = require('../img/check.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default App = () => {
  const navigation = useNavigation();
  const [IsLoading, setIsLoading] = useState();
  const [isSigned, setIsSigned] = useAtom(signedIn)
  const [isToken, setToken] = useAtom(token)
  const [userModel, setUserModel] = useState({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    dateCreated: "2023-01-23T12:44:36.695Z",
    email: "string",
    firstName: "",
    lastName: "",
    departmentId: "",
  });
  const [DepInfo, SetDepInfo] = useState([]);
  const [selectedId, setSelectedId] = useState()

  const changeModel = (value, name) => {
    setUserModel((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isRole, setRole] = useAtom(role)

  useEffect(() => {
    getDepList()
  }, [])

  const setData = () => {
    let access_token = isToken;
    console.log(access_token)
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify(userModel)
    }
    const url = ServerUrl + "/api/" + isRole + "/setDepartment";
    console.log(url)
    console.log(options.body)
    setIsLoading(true);
    fetch(url, options)
      .then((response) => {
        AsyncStorage.setItem('@access_token', JSON.stringify(access_token)).then((res) => {
          console.log(response)
          setIsSigned(true)
        });
      })
      .finally(() => setIsLoading(false));
  }

  const getDepList = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
    url = ServerUrl + '/api/Departments/GetDepartmentsList'
    await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        SetDepInfo(response)
        setIsLoading(false)
      })
      .catch((er) => console.log(er))
  }

  const onPressDepartment = (item) => {
    changeModel(item.id, 'departmentId')
    selectedId ? setSelectedId() : setSelectedId(item.id)
    console.log(item.id)
  }

  const ShowDepartments = ({item, onPress, opacity, backgroundColor}) => {
    return (
    <Pressable onPress={onPress}>
      <View style={[styles.wrapElement, {backgroundColor: backgroundColor}]}>
        <Text style={{fontSize: 16, color: 'white'}}>{item.name}</Text>
        <Image source={check} style={[styles.img, {opacity: opacity}]}/>
      </View>
    </Pressable>
    )
  }

  const renderItem = ({item}) => {
    const opacity = item.id === selectedId ? 1 : 0;
    const backgroundColor = item.id === selectedId ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';

    return (
      <ShowDepartments
        item={item}
        onPress={() => onPressDepartment(item)}
        opacity={opacity}
        backgroundColor={backgroundColor}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.viewer}>
        <MotiView style={styles.container}>
          <View style={styles.wrapList}>
            <Text style={{fontSize: 24, color: 'white'}}>Choose the Department</Text>
            <FlatList
              data={DepInfo}
              renderItem={renderItem}
              keyExtractor={item => item.id}  
              />
          </View>
          <Pressable onPress={setData} style={styles.btnStyle}>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Next</Text>
          </Pressable>
        </MotiView>
        <StatusBar
          translucent={false}
          backgroundColor="#545454"
          barStyle={"default"}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
    backgroundColor: 'yellow',
  },

  container: {
    padding: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  img: {
    width: 25,
    height: 25,
  },

  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },


  btnStyle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 200,
  },

  wrapElement: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 7,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  wrapList: {
    marginVertical: 10,
    padding: 10,
    justifyContent: 'center'
  },
  
})
