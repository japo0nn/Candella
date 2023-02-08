import 'react-native-reanimated';
import React from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  Text,
  Pressable,
} from 'react-native';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import { taskInfo } from '../../_helpers/constant';
import { taskId } from '../../_helpers/constant';
import { useAtom } from 'jotai';

const avatar = require('../../img/profileTrue.png')
const windowWidth = Dimensions.get('window').width;


export const Tasks = ({ task }) => {
  let client = task.client
  const [isTaskId, setTaskId] = useAtom(taskId)
  const navigation = useNavigation()

  const onPressTask = () => {
    navigation.navigate("ShowTask")
    setTaskId(task.id)
  }

  return (
    <MotiView>
      <MotiView style={styles.container}>
        <MotiView style={{ alignItems: 'center' }}>
          <Image source={avatar} style={styles.avatar} />
          <Text style={styles.text}>{client.firstName}</Text>
        </MotiView>
        <MotiView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 300 }}>
          <MotiView>
            <Text style={styles.text}>{task.name}</Text>
          </MotiView>
          {task.isStarted ? (<Pressable style={styles.btn} onPress={() => onPressTask()}>
            <Text style={{ color: '#fff', marginVertical: 5, fontSize: 16, fontWeight: 'bold' }}>Show</Text>
          </Pressable>) : (<Text style={{ color: '#fff' }}>Not Started Yet</Text>)}
        </MotiView>
      </MotiView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  avatar: {
    marginLeft: 15,
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    marginRight: 10,
  },

  img: {
    width: windowWidth - 20,
    height: windowWidth - 20,
    resizeMode: 'contain'
  },

  text: {
    color: '#fff',
    marginVertical: 5,
    fontWeight: 'bold',
  },

  btn: {
    backgroundColor: '#05d2f2',
    paddingHorizontal: 20,
    borderRadius: 10,
    right: 0,
  }
})