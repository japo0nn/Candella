import React from 'react';
import { Navigator } from './_helpers/navigation';
import YaMap from 'react-native-yamap';
import { API_KEY } from './_helpers/constant';

YaMap.init(API_KEY);

export default function App() {
  return (
      <Navigator />
  );
}