
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

function loginNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function chatNavigator() {
  return (
    <Stack.Navigator>
       <Stack.Screen name="Chats" component={ChatsScreen} options={{
        headerShown: true,
      }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{headerTitle: (props) => <ChatHeader {...props} />}}/>
      <Stack.Screen name="contacts" component={Contacts} options={{
        headerShown: true,
        title:"Select Contacts"
      }} />
     
    </Stack.Navigator>
  );
}
const App = () => {
  const [currUser, setCurreUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const { theme: { colors }, } = useContext(Context);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(false);
      console.log("AUth", auth)
      if (user) {
        setCurreUser(user)
      }
    })
    return () => unsubscribe();
  }, []);
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <NavigationContainer>
      {!currUser ? (
        <Stack.Navigator>
          <Stack.Screen name="Register" component={loginNavigator} options={{
            headerShown: false,
            color: theme.colors.primary
          }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Chat" component={chatNavigator} options={{
            headerShown: false,
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

