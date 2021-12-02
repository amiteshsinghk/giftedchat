import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Input,Button } from "react-native-elements";
import{auth} from '../firebase';

const LoginScreen =({navigation}) =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              var uid = user.uid;
              // ...
            //   navigation.navigate("ChatScreen")
            // navigation.navigate("LoginScreen")
            navigation.replace('Chat', { screen: 'ChatScreen' });
            } else {
              // User is signed out
              // ...
            }
          });
        //   return unsubscribe
    },[]);
    return(
        <View style={styles.container}>
            <Input
            placeholder ="Enter your Email"
            label="Email"
            leftIcon ={{type:'material', name:'email'}}
            value={email}
            onChangeText = {text => setEmail(text)}
            />
            <Input
            placeholder ="Enter your Password"
            label="Password"
            leftIcon ={{type:'material', name:'lock'}}
            value={password}
            onChangeText = {text => setPassword(text)}
            secureTextEntry
            />
            <Button title ="sign in" buttonStyle ={styles.buttons}
            />
            <Button title ="register" buttonStyle ={styles.buttons}
            onPress={() => navigation.navigate("Register")}/>
        </View>
    )
}

export default LoginScreen
const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignContent:"center",
        padding:10
    },
    buttons:{
        width:200,
        marginTop:10,
        
    },
   
})