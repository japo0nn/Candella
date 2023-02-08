import 'react-native-reanimated';
import React from 'react';
import ClientsMain from './ClientsMain';
import ShowTask from './ShowTask';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default App = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllTasksScreen"
        component={ClientsMain}
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
