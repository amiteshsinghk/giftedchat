
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import GroupScreen from './screens/GroupScreen';
// import AddGroupScreen from './screens/AddGroupScreen';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase';
import Profile from './screens/Profile';
import ChatsScreen from './screens/ChatsScreen';
import Contacts from './screens/Contacts';
import ChatHeader from './components/ChatHeader'


import ContextWrapper from "./context/ContextWrapper";


const Stack = createStackNavigator();

function loginNavigator() {



  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Add Group" component={AddGroupScreen} options={{
        headerShown: true,
        // headerLeft: () => null
      }} />
      <Stack.Screen name="Group" component={GroupScreen} options={{
        headerShown: true,
        // headerLeft: () => null
      }} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}

    </Stack.Navigator>
  );
}

function chatNavigator() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Add Group" component={AddGroupScreen} options={{
        headerShown:true,
        // headerLeft: () => null
      }} />
       <Stack.Screen name="Group" component={GroupScreen} options={{
        headerShown:true,
        // headerLeft: () => null
      }} /> */}
       <Stack.Screen name="Chats" component={ChatsScreen} options={{
        headerShown: true,
        // headerLeft: () => null
      }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{headerTitle: (props) => <ChatHeader {...props} />}}/>
      <Stack.Screen name="contacts" component={Contacts} options={{
        headerShown: true,
        title:"Select Contacts"
        // headerLeft: () => null
      }} />
     
    </Stack.Navigator>
  );
}

//  function App() {
const App = () => {
  const [currUser, setCurreUser] = useState(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log("AUth", auth)
      // if (user) {
        setCurreUser(user)
      // }
    })
    return () => unsubscribe();
  }, []);
  
  return (
    // <ContextWrapper>
    <NavigationContainer>

      {!currUser ? (
        <Stack.Navigator>
          <Stack.Screen name="Register" component={loginNavigator} options={{
            headerShown: false,
          }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
        {/* {!currUser.displayName && (
            <Stack.Screen name="profile" component={Profile} options={{
              headerShown: false,
            }} />
          )
          }  */}
          <Stack.Screen name="Chat" component={chatNavigator} options={{
            headerShown: false,
          }} />
        </Stack.Navigator>
      )
      }
      {/* <Stack.Navigator>
        <Stack.Screen name="Register" component={loginNavigator} options={{
          headerShown: false,
        }} />
        <Stack.Screen name="Chat" component={chatNavigator} options={{
          headerShown: false,
        }} />
      </Stack.Navigator> */}
    </NavigationContainer>
    // {/* </ContextWrapper> */}
  );
}
export default App;

