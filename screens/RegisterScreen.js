import { NavigationContainer } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Input, Button } from "react-native-elements";
import { auth } from '../firebase';
import { theme } from "../utils";
import Context from '../context/Context';
import { pickImage, askForPermission, uploadImage } from "../utils";

const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [password, setPassword] = useState('');
    const {theme :{colors}} = useContext(Context);
    const [selectedImage, setSelectedImage] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState(null);
    useEffect(() => {
        (async () => {
          const status = await askForPermission();
          setPermissionStatus(status);
        })();
      }, []);
    const resgister = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                user.updateProfile({
                    displayName: name,
                    // photoURL: imageUrl ? imageUrl : "https://image.shutterstock.com/shutterstock/photos/149083895/display_1500/stock-vector-male-avatar-profile-picture-vector-149083895.jpg"
                }).then(() => {
                    // Update successful
                    // ...
                }).catch((error) => {
                    // An error occurred
                    // ...
                });
                // ...
               navigation.popToTop();
                // navigation.replace('Chat', { screen: 'ChatScreen' });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
                // ..
            });
    }

    async function handleProfilePicture() {
        const result = await pickImage();
        if (!result.cancelled) {
          setSelectedImage(result.uri);
        }
      }
    return (
        <View style={styles.container}>
            <Input
                placeholder="Enter your Name"
                label="Name"
                leftIcon={{ type: 'material', name: 'badge' }}
                value={name}
                onChangeText={text => setName(text)}
            />
            <Input
                placeholder="Enter your Email"
                label="Email"
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                placeholder="Enter your Password"
                label="Password"
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            {/* <Input
                placeholder="Enter your image Url"
                label="Profile Picture"
                leftIcon={{ type: 'material', name: 'face' }}
                value={imageUrl}
                onChangeText={text => setImageUrl(text)}
            /> */}
            {/* <Button title="Select Profile Picture" buttonStyle={styles.buttons} onPress={resgister} /> */}
            <Button title="Register" buttonStyle={styles.buttons} onPress={resgister} />
        </View>
    )
}

export default RegisterScreen
const styles = StyleSheet.create({
    buttons: {
        marginTop: 10,
        backgroundColor :theme.colors.secondary,
    },
    container: {
        flex: 1,
        alignContent: "center",
        padding: 10,
        backgroundColor: theme.colors.background
    }
})