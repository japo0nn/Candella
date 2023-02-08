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
import { ServerUrl, role, signedIn, userDirector, userEmployee, token } from '../_helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom, useAtom } from 'jotai';
import { Picker } from '@react-native-picker/picker';
import { Navigator } from '../_helpers/navigation';

const icon = require('../img/favicon.png')
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default App = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isToken, setToken] = useAtom(token)
  const [isRole, setRole] = useAtom(role)
  const [isSigned, setIsSigned] = useAtom(signedIn)
  const [loginModel, setLoginModel] = useState({
    username: "",
    password: "",
  });
  const [signModel, setSignModel] = useState({
    email: "",
    username: "",
    password: "",
  });

  const navigation = useNavigation();

  const changeLoginModel = (value, name) => {
    setLoginModel((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const changeSignModel = (value, name) => {
    setSignModel((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const logInUser = () => {
    if (loginModel.username != "" && loginModel != ""){
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginModel)
      }
      url = ServerUrl + '/api/' + isRole + '/Login';
      console.log(url)
      console.log(options.body)
      fetch(url, options)
        .then((response) => response.json())
        .then((response) => {
          let token = response.access_token;
          console.log(token)
          AsyncStorage.setItem('@access_token', JSON.stringify(token)).then(() => {
            setIsSigned(true)
          });
        })
        .catch((response) => console.log(response.status))
    }
  }

  const signUpUser = () => {
    if (signModel.email != "" && signModel.username != "" && signModel.password != ""){
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signModel)
      }
      const url = ServerUrl + '/api/' + isRole + '/Register';
      console.log(url)
      console.log(options.body)
      fetch(url, options)
        .then((response) => response.json())
        .then((response) => {
          let token = response.access_token;
          console.log(token)
          setToken(token)
          navigation.navigate('SetData')
        })
        .catch((response) => console.log(response.status))
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0f0f0f', '#545454']} style={styles.viewer}>
        <MotiView style={styles.container}>
          <Switch
            trackColor={{ false: "#fff", true: "#1a1919" }}
            thumbColor={isEnabled ? "#fff" : "#1a1919"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Image source={icon} style={styles.img} />

          <MotiView style={styles.inputCont}>
            <MotiView style={styles.inputView}
              animate={{
                opacity: isEnabled ? 1 : 0,
                translateX: isEnabled ? windowWidth / 4 : -windowWidth,
              }}
              transition={{
                type: 'timing',
              }}>
              <TextInput placeholder='Username'
                style={styles.inputText}
                placeholderTextColor="#c2c2c2"
                maxLength={50}
                value={loginModel.username}
                onChangeText={(e) => changeLoginModel(e, "username")}
              />
              <TextInput
                placeholder='Password'
                style={styles.inputText}
                placeholderTextColor="#c2c2c2"
                maxLength={50} secureTextEntry={true}
                value={loginModel.password}
                onChangeText={(e) => changeLoginModel(e, "password")}
              />
              <Picker
                style={styles.inputText}
                selectedValue={isRole}
                onValueChange={(itemValue, itemIndex) =>
                  setRole(itemValue)
                }>
                <Picker.Item label="Client" value="Clients" />
                <Picker.Item label="Employee" value="Employees" />
                <Picker.Item label="Director" value="Directors" />
              </Picker>

              <Pressable onPress={logInUser} style={styles.btnStyle}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Log in</Text>
              </Pressable>
            </MotiView>

            <MotiView style={styles.inputView}
              animate={{
                opacity: isEnabled ? 0 : 1,
                translateX: isEnabled ? windowWidth : -windowWidth / 4,
              }}
              transition={{
                type: 'timing',
              }}>
              <TextInput placeholder='Email'
                style={styles.inputText}
                placeholderTextColor="#c2c2c2"
                maxLength={100}
                value={signModel.email}
                onChangeText={(e) => changeSignModel(e, "email")} />
              <TextInput
                placeholder='Username'
                style={styles.inputText}
                placeholderTextColor="#c2c2c2"
                maxLength={50}
                value={signModel.username}
                onChangeText={(e) => changeSignModel(e, "username")} />
              <TextInput
                placeholder='Password'
                style={styles.inputText}
                placeholderTextColor="#c2c2c2"
                maxLength={50} secureTextEntry={true}
                value={signModel.password}
                onChangeText={(e) => changeSignModel(e, "password")} />

              <Picker
                style={styles.inputText}
                selectedValue={isRole}
                onValueChange={(itemValue, itemIndex) =>
                  setRole(itemValue)
                }>
                <Picker.Item label="Client" value="Clients" />
                <Picker.Item label="Employee" value="Employees" />
                <Picker.Item label="Director" value="Directors" />
              </Picker>

              <Pressable onPress={signUpUser} style={styles.btnStyle}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Sign Up</Text>
              </Pressable>
            </MotiView>
          </MotiView>
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
  }
})
