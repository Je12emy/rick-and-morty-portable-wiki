import React from 'react';
import {StyleSheet, Dimensions, StatusBar, Text, View} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
const initialLayout = {width: Dimensions.get('window').width};

import {Characters} from './Characters';
import {Episodes} from './Episodes';
import {Locations} from './Locations';

export const Home = ({theme}) => {
  const RenderTabBar = (props) => (
    <View>
      <StatusBar backgroundColor="#005005"/>
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: theme.colors.accent}}
        style={{backgroundColor: theme.colors.primary}}
        renderLabel={({route, focused, color}) => (
          <Text
            style={{
              margin: 8,
              color: color,
            }}>
            {route.title}
          </Text>
        )}
      />
    </View>
  );

  // Set up tabs
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Characters'},
    {key: 'second', title: 'Locations'},
    {key: 'third', title: 'Episodes'},
  ]);
  const renderScene = SceneMap({
    first: Characters,
    second: Locations,
    third: Episodes,
  });
  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={(props) => <RenderTabBar {...props} />}
    />
  );
};
