import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Input,Button } from "react-native-elements";
import{auth} from '../firebase';

const LoginScreen =({navigation}) =>{
    var userss
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signIn = () =>{
        console.log('SignIn')
        auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;

          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage)
        });
    }
    // useEffect(() => {
       
    //         // if ( auth().currentUser != null) {
    //         //     // User is signed in, see docs for a list of available properties
    //         //     // https://firebase.google.com/docs/reference/js/firebase.User
    //         //     // ...
    //         //     console.log('userSignedIn')
    //         //     } else {
    //         //     // No user is signed in.
    //         //     }
        
    //     auth.onAuthStateChanged((user) => {
    //         if (user) {
    //           // User is signed in, see docs for a list of available properties
    //           // https://firebase.google.com/docs/reference/js/firebase.User
    //           var uid = user.uid;
    //           userss = user
    //           // ...
    //         //   navigation.navigate("ChatScreen")
    //         // navigation.navigate("LoginScreen")

    //         navigation.replace('Chat', { screen: 'ChatScreen' });
    //         } else {
    //           // User is signed out
    //           // ...
    //           navigation.canGoBack() && navigation.popToTop();
    //         }
    //       });
    //     //   return unsubscribe
    // },[]);
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
            onPress ={()=> signIn()}
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
        alignItems:"center",
        justifyContent:"center",
        padding:10
    },
    buttons:{
        width:200,
        marginTop:10,
        
    },
   
})