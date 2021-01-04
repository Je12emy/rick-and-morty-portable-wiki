/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {StyleSheet, Dimensions, StatusBar} from 'react-native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  Appbar,
} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from 'react-query';

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import merge from 'deepmerge';

import {Home} from './views/Home';
import {ViewCharacter} from './views/ViewCharacter';
import {ViewLocation} from './views/ViewLocation';
import {ViewEpisode} from './views/ViewEpisode';

// Merge themes
const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

// Custom header

function CustomNavigationBar({navigation, previous}) {
  return (
    <Appbar.Header
      style={[
        !previous
          ? {
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              marginBottom: -1,
            }
          : null,
      ]}>
      {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="Rick and Morty Portable Wiki" />
    </Appbar.Header>
  );
}

const theme = {
  ...CombinedDefaultTheme,
  roundness: 2,
  colors: {
    ...CombinedDefaultTheme.colors,
    primary: '#2e7d32',
    accent: '#cfff95',
  },
};

const Stack = createStackNavigator();

const App = () => {
  // Create Client
  const queryClient = new QueryClient();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Stack.Navigator
            screenOptions={{
              header: (props) => <CustomNavigationBar {...props} />,
            }}>
            <Stack.Screen
              name="Home"
              options={{
                headerStyle: {
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                  marginBottom: -1,
                },
                headerTitleStyle: {
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                  marginBottom: -1,
                },
              }}>
              {(props) => <Home {...props} theme={theme} />}
            </Stack.Screen>
            <Stack.Screen name="Character" component={ViewCharacter} />
            <Stack.Screen name="Location" component={ViewLocation} />
            <Stack.Screen name="Episode" component={ViewEpisode} />
          </Stack.Navigator>
        </QueryClientProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default App;
