
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createStackNavigator();

function loginNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}

    </Stack.Navigator>
  );
}

function chatNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={ChatScreen} options={{
        headerShown:true,
        // headerLeft: () => null
      }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="Chat" component={ChatScreen}/> */}

        <Stack.Screen name="Register" component={loginNavigator} options={{
          headerShown: false,
        }} />
        <Stack.Screen name="Chat" component={chatNavigator} options={{
          headerShown:false,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

