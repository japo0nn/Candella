import { React, useEffect, useState } from 'react';
import {
	StyleSheet,
	Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { signedIn, userDirector, userClient, userEmployee, role, selectedDep, initTask, ServerUrl } from './constant';
import { useAtom } from 'jotai';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from '../screens/AuthScreen';
import SetDataScreen from '../screens/SetDataScreen';
import DirectorsNavigator from '../screens/DirectorScreens/DirectorsNavigator';
import GetFreeTasks from '../screens/DirectorScreens/GetFreeTasks';
import DirectorsProfile from '../screens/DirectorScreens/DirectorsProfile';
import { Image } from 'moti';
import ClientsMain from '../screens/ClientScreens/ClientsMain';
import ClientsProfile from '../screens/ClientScreens/ClientsProfile';
import SetDepartmentScreen from '../screens/SetDepartmentScreen';
import EmployeesProfile from '../screens/EmployeeScreens/EmployeesProfile';
import EmployeeNavigator from '../screens/EmployeeScreens/EmployeeNavigator';
import CreateTask from '../screens/ClientScreens/CreateTask';
import ClientNavigator from '../screens/ClientScreens/ClientNavigator';

const homeTrue = require('../img/homeTrue.png')
const homeFalse = require('../img/homeFalse.png')
const profileTrue = require('../img/settingsTrue.png')
const profileFalse = require('../img/settingsFalse.png')
const taskTrue = require('../img/taskTrue.png')
const taskFalse = require('../img/taskFalse.png')

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const Navigator = () => {
	const [isSigned, setIsSigned] = useAtom(signedIn)
	const [isDirector, setIsDirector] = useAtom(userDirector);
	const [isEmployee, setIsEmpolyee] = useAtom(userEmployee);
	const [isRole, setRole] = useAtom(role)
  const roleList = ['Clients', 'Employees', 'Directors']
	const Stack = createNativeStackNavigator();
	const Tab = createBottomTabNavigator();

	useEffect(() => {
		getData()
	})

	const getToken = async() => {
		const value = await AsyncStorage.getItem('@access_token');
    return JSON.parse(value);
	}

  const getData = async() => {
    let access_token = await getToken()
    for (var i = 0; i < 3; i++){
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        }
      }
      url = ServerUrl + '/api/' + roleList[i] + '/Current';
      await fetch(url, options)
        .then((response) => {
          console.log(url + response.status)
          if (response.status === 200){
            setRole(roleList[i])
            setIsSigned(true)
          }
        })
    }

    if (isRole === 'Directors') {
        setIsDirector(true)
        setIsEmpolyee(false)
    } else if (isRole === 'Employees') {
        setIsDirector(false)
        setIsEmpolyee(true)
    } else if (isRole === 'Clients') {
        setIsDirector(false)
        setIsEmpolyee(false)
    }
    console.log(access_token)
  }


	const getDirectorPages = () => {
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						if (route.name === 'DirectorsMain') {
							iconName = focused ? homeTrue : homeFalse;
						} else if (route.name === 'DirectorsProfile') {
							iconName = focused ? profileTrue : profileFalse;
						} else if (route.name === 'GetFreeTasks') {
							iconName = focused ? taskTrue : taskFalse;
						}
						return <Image source={iconName} style={styles.icons} size={size} />;
					},
					tabBarActiveTintColor: 'tomato',
					tabBarInactiveTintColor: 'gray',
					tabBarShowLabel: false,
					tabBarStyle: { backgroundColor: "#1a1a1a", borderTopWidth: 0 },
				})}>
				<Tab.Screen
					name="DirectorsMain"
					component={DirectorsNavigator}
					options={{
						headerShown: false,
					}}
				/>
        <Tab.Screen
					name="GetFreeTasks"
					component={GetFreeTasks}
					options={{
						headerShown: false,
					}}
				/>
				<Tab.Screen
					name="DirectorsProfile"
					component={DirectorsProfile}
					options={{
						headerShown: false,
					}}
				/>
        
			</Tab.Navigator>
		)
	}

	const getClientPages = () => {
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						if (route.name === 'ClientsMain') {
							iconName = focused ? homeTrue : homeFalse;
						} else if (route.name === 'ClientsProfile') {
							iconName = focused ? profileTrue : profileFalse;
						} else if (route.name === 'CreateTask') {
							iconName = focused ? taskTrue : taskFalse;
						}
						// You can return any component that you like here!
						return <Image source={iconName} style={styles.icons} size={size} />;
					},
					tabBarActiveTintColor: 'tomato',
					tabBarInactiveTintColor: 'gray',
					tabBarShowLabel: false,
					tabBarStyle: { backgroundColor: "#1a1a1a", borderTopWidth: 0 },
				})}>
				<Tab.Screen
					name="ClientsMain"
					component={ClientNavigator}
					options={{
						headerShown: false,
					}}
				/>
				<Tab.Screen
					name="CreateTask"
					component={CreateTask}
					options={{
						headerShown: false,
					}}
				/>
				<Tab.Screen
					name="ClientsProfile"
					component={ClientsProfile}
					options={{
						headerShown: false,
					}}
				/>
			</Tab.Navigator>
		)

	}

  const getEmployeePages = () => {
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						if (route.name === 'EmployeesProfile') {
							iconName = focused ? profileTrue : profileFalse;
						} else if (route.name === 'EmployeeMain') {
							iconName = focused ? homeTrue : homeFalse;
						}
						
						return <Image source={iconName} style={styles.icons} size={size} />;
					},
					tabBarActiveTintColor: 'tomato',
					tabBarInactiveTintColor: 'gray',
					tabBarShowLabel: false,
					tabBarStyle: { backgroundColor: "#1a1a1a", borderTopWidth: 0 },
				})}>
          <Tab.Screen
					name="EmployeeMain"
					component={EmployeeNavigator}
					options={{
						headerShown: false,
					}}
				/>
				<Tab.Screen
					name="EmployeesProfile"
					component={EmployeesProfile}
					options={{
						headerShown: false,
					}}
				/>
			</Tab.Navigator>
		)

	}

	return (
		<NavigationContainer>
			{isSigned ? (
				isDirector ? (getDirectorPages()) : (isEmployee ? getEmployeePages() : getClientPages())
			)
				: (<Stack.Navigator>
					<Stack.Screen
						name="Auth"
						component={AuthScreen}
						options={{
							headerShown: false,
						}} />
					<Stack.Screen
						name="SetData"
						component={SetDataScreen}
						options={{
							headerShown: false,
						}} />
          <Stack.Screen
						name="SetDepartment"
						component={SetDepartmentScreen}
						options={{
							headerShown: false,
						}} />
				</Stack.Navigator>)
			}
		</NavigationContainer>
	);
}


const styles = StyleSheet.create({

	icons: {
		width: 25,
		height: 25,
		margin: 10,
	}
})