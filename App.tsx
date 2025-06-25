import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider, configureFonts, MD3LightTheme } from 'react-native-paper';


import Login from './src/authentication/Login';

const _fontConfig = {
 default: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: 'normal',
    }, 
  },
};

const Stack = createNativeStackNavigator();
const fontConfig = {
    ios: _fontConfig,
    android: _fontConfig,
};

const theme = {
  ...DefaultTheme,
    // fonts: configureFonts({config: fontConfig}),

  colors: {
    ...DefaultTheme.colors,
    primary: '#FF5400',
    background: '#f6f6f6',
  },
};
const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>

  );
};


export default App;
