// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './MapScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Google Maps">
        <Stack.Screen name="Google Maps" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
