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
} from 'react-native';
import { View, MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { ServerUrl, token } from '../_helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom, useAtom } from 'jotai';
import { role, signedIn , userDirector, userEmployee} from '../_helpers/constant';

const icon = require('../img/favicon.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default App = () => {
  const navigation = useNavigation();
  const [IsLoading, setIsLoading] = useState();
  const [isSigned, setIsSigned] = useAtom(signedIn)
  const [isDirector, setIsDirector] = useAtom(userDirector);
	const [isEmployee, setIsEmpolyee] = useAtom(userEmployee);
  const [isToken, setToken] = useAtom(token)
  const [userModel, setUserModel] = useState({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    dateCreated: "2023-01-23T12:44:36.695Z",
    email: "string",
    firstName: "",
    lastName: "",
  });

  const changeLoginModel = (value, name) => {
    setUserModel((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isRole, setRole] = useAtom(role)

  const setData = async () => {
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
    const url = ServerUrl + "/api/" + isRole + "/setUserData";
    console.log(url)
    console.log(options.body)
    setIsLoading(true);
    fetch(url, options)
      .then((response) => {
        console.log(response.status)
        if(isRole === 'Employees'){
          navigation.navigate('SetDepartment')
        } else {
          AsyncStorage.setItem('@access_token', JSON.stringify(access_token)).then((res) => {
            setIsSigned(true)
          });
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.viewer}>
        <MotiView style={styles.container}>
          <TextInput
            placeholder='First Name'
            style={styles.inputText}
            placeholderTextColor="#c2c2c2"
            maxLength={50}
            value={userModel.firstName}
            onChangeText={(e) => changeLoginModel(e, "firstName")}
          />
          <TextInput
            placeholder='Last Name'
            style={styles.inputText}
            placeholderTextColor="#c2c2c2"
            maxLength={50}
            value={userModel.lastName}
            onChangeText={(e) => changeLoginModel(e, "lastName")}
          />

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
    width: 80,
    height: 80,
    marginTop: 50,
  },

  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },

  inputCont: {
    flexDirection: 'row',
  },

  inputView: {
    marginTop: 20,
    justifyContent: 'center',
  },

  inputText: {
    borderRadius: 10,
    width: 200,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  picker: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    width: 200,
    textAlign: 'center',
    marginTop: 20,
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
  }
})
