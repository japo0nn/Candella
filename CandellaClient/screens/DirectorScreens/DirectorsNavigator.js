import 'react-native-reanimated';
import React from 'react';
import DirectorsMain from './DirectorsMain';
import ShowTask from './ShowTask'

import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default App = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllTasksScreen"
        component={DirectorsMain}
        options={{
          headerShown: false,
        }} />
      <Stack.Screen
        name='ShowTask'
        component={ShowTask}
        options={{
          headerShown: false,
        }} />
    </Stack.Navigator>
  );
}
