import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Input, Button } from "react-native-elements";
import { auth } from '../firebase';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [password, setPassword] = useState('');
    const resgister = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                user.updateProfile({
                    displayName: name,
                    photoURL: imageUrl ? imageUrl : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Favatar&psig=AOvVaw2atZhGWI3hXX7si8WgLzy4&ust=1638527527615000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIDnuvb0xPQCFQAAAAAdAAAAABAU"
                }).then(() => {
                    // Update successful
                    // ...
                }).catch((error) => {
                    // An error occurred
                    // ...
                });
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
                // ..
            });
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
            <Input
                placeholder="Enter your image Url"
                label="Profile Picture"
                leftIcon={{ type: 'material', name: 'face' }}
                value={imageUrl}
                onChangeText={text => setImageUrl(text)}
            />
            <Button title="register" style={styles.buttons} onPress={resgister} />
        </View>
    )
}

export default RegisterScreen
const styles = StyleSheet.create({
    buttons: {
        width: 100,
        marginTop: 10,
    },
    container: {
        flex: 1,
        alignContent: "center",
        padding: 10
    }
})