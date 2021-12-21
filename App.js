
import React, { useContext, useEffect, useState } from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import GroupScreen from './screens/GroupScreen';
import { useAssets } from "expo-asset";
// import AddGroupScreen from './screens/AddGroupScreen';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase';
import Profile from './screens/Profile';
import ChatsScreen from './screens/ChatsScreen';
import Contacts from './screens/Contacts';
import ChatHeader from './components/ChatHeader'
import Context from "./context/Context";
import ContextWrapper from "./context/ContextWrapper";
import { color } from 'react-native-reanimated';
import { theme } from './utils';


const Stack = createStackNavigator();
LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
]);
let photoUrlUser = null;

function loginNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary
        },
        headerTitleStyle: {
          color: theme.colors.white
        },
        headerTintColor: theme.colors.white
      }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          color: theme.colors.white
        },
        headerTintColor: theme.colors.white
      }} />
    </Stack.Navigator>
  );
}

function chatNavigator() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Profile" component={Profile} options={{
        headerShown: true,
        headerStyle :{
          backgroundColor : theme.colors.primary
        },
        headerTitleStyle:{
          color: theme.colors.white
        },
        headerTintColor: theme.colors.white
      }} /> */}

      {/* {!currUser.photoURL && (
            <Stack.Screen name="Profile" component={Profile} options={{
              headerShown: true,
              headerStyle :{
                backgroundColor : theme.colors.primary
              },
              headerTitleStyle:{
                color: theme.colors.white
              },
              headerTintColor: theme.colors.white
            }} />
          )} */}
   //   {photoUrlUser && console.log("photoUrlUser", photoUrlUser.photoURL)

      }
      <Stack.Screen name="Chats" component={ChatsScreen} options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary
        },
        headerTitleStyle: {
          color: theme.colors.white
        },
        headerTintColor: theme.colors.white
      }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{
        headerTitle: (props) => <ChatHeader {...props} />,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          color: theme.colors.white
        },
        headerTintColor: theme.colors.white
      }} />
      <Stack.Screen name="contacts" component={Contacts} options={{
        headerShown: true,
        title: "Select Contacts",
        headerStyle: {
          backgroundColor: theme.colors.primary
        },
        headerTitleStyle: {
          color: theme.colors.white
        },
        headerTintColor: theme.colors.white

      }} />

    </Stack.Navigator>
  );
}
const App = () => {
  const [loading, setLoading] = useState(true);
  const { theme: { colors }, } = useContext(Context);
  const [currUser, setCurreUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(false);
      if (user) {
        setCurreUser(user);
      }
    })
    return () => unsubscribe();
  }, []);
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <NavigationContainer>
      {/* {console.log("photoURLgvgvgggg",currUser.photoURL)} */}
      {!currUser ? (
        <Stack.Navigator>
          <Stack.Screen name="Register" component={loginNavigator} options={{
            headerShown: false,
            color: theme.colors.primary
          }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          {console.log("currUser.photoURL", currUser)}
          {!currUser.photoURL && (
            <Stack.Screen name="Profile" component={Profile} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: theme.colors.primary
              },
              headerTitleStyle: {
                color: theme.colors.white
              },
              headerTintColor: theme.colors.white
            }} />
          )}

          <Stack.Screen name="Chats" component={ChatsScreen} options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.colors.primary
            },
            headerTitleStyle: {
              color: theme.colors.white
            },
            headerTintColor: theme.colors.white
          }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{
            headerTitle: (props) => <ChatHeader {...props} />,
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTitleStyle: {
              color: theme.colors.white
            },
            headerTintColor: theme.colors.white
          }} />
          <Stack.Screen name="contacts" component={Contacts} options={{
            headerShown: true,
            title: "Select Contacts",
            headerStyle: {
              backgroundColor: theme.colors.primary
            },
            headerTitleStyle: {
              color: theme.colors.white
            },
            headerTintColor: theme.colors.white

          }} />

        </Stack.Navigator>
      )
      }

    </NavigationContainer>
  );
}
function Main() {
  const [assets] = useAssets(
    require("./assets/icon-square.png"),
    require("./assets/chatbg.png"),
    require("./assets/user-icon.png"),
    require("./assets/welcome-img.png")
  );
  if (!assets) {
    return <Text>Loading ..</Text>;
  }
  return (
    <ContextWrapper>
      <App />
    </ContextWrapper>
  );
}

export default Main;

