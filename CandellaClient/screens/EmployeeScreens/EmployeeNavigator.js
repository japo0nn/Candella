import 'react-native-reanimated';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployeeMain from './EmployeeMain';
import TaskScreen from './TaskScreen';


const Stack = createNativeStackNavigator();

export default App = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllTasksScreen"
        component={EmployeeMain}
        options={{
          headerShown: false,
        }} />
      <Stack.Screen
        name="TaskScreen"
        component={TaskScreen}
        options={{
          headerShown: false,
        }} />

    </Stack.Navigator>
  );
}
