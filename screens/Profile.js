import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Button,
    StyleSheet
} from "react-native";
import Constants from "expo-constants";
import GlobalContext from "../context/Context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { pickImage, askForPermission, uploadImage } from "../utils";
import { auth, db } from "../firebase";
import { updateProfile } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../utils";
import { updateCurrentUser } from "firebase/auth";


const Profile = () => {
    const [permissionStatus, setPermissionStatus] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation();
    const user = auth.currentUser;
    var imageFlag = false;
    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            setPermissionStatus(status);
        })();
    }, []);
    useEffect(() =>{
        if (user.photoURL) {
            setSelectedImage( user.photoURL);
            
        }
    },[]);
    // if (!permissionStatus) {
    //     return <Text>Loading</Text>;
    //   }
    //   if (permissionStatus !== "granted") {
    //     return <Text>You need to allow this permission</Text>;
    //   }
    async function handleProfilePicture() {
        // console.log("permissionStatus", permissionStatus)
        if (permissionStatus == "granted") {
            const result = await pickImage();
            if (!result.cancelled) {
                setSelectedImage(result.uri);
                imageFlag = true
                // console.log("selectedImage", result.uri);
            }
        } else {
            const status = await askForPermission();
            setPermissionStatus(status);
        }
    }

    async function submitData() {
        
        let photoURL;
        if (selectedImage) {
            const {url} = await uploadImage(
                selectedImage,`images/${user.uid}`,
                "profilePicture"
            );
            photoURL = url;
            // console.log("photoURLphoto===>",photoURL);
        //     user.photoURL = photoURL;
        //  await updateCurrentUser(auth, user );
        };
        const userData = {
            displayName : user.displayName,
            email: user.email,
        };
        if (photoURL) {
            userData.photoURL = photoURL;
        }
        <Text>Uploading Image</Text>
        // console.log("flag", imageFlag )
        // if (imageFlag) {
            console.log("userData===>", userData)
            await Promise.all([
                updateProfile(user,userData),
                setDoc(doc(db,"users",user.uid),{...userData, uid: user.uid}),
            ]);
        // }else {
            // console.log("imageFlagElse", imageFlag)
            // navigation.navigate("Chats");
            navigation.replace("Chats");
        // }
        
        
    }
    return (
        <View style={styles.viewStyle}>
            <Text style={styles.textHeaderStyle}>
                Profile Picture
            </Text>
            <Text style={styles.textSecondaryStyle}>
                Please select your profile picture
            </Text>
            <TouchableOpacity style={styles.touchableOptacityStyle}
                onPress={handleProfilePicture}>
                {!selectedImage ? (
                    <MaterialCommunityIcons
                        name="camera-plus"
                        color={theme.colors.iconGray}
                        size={45} />
                ) : (
                    <Image style={styles.imageStyle}
                        source={{ uri: selectedImage }}
                    />
                )

                }
            </TouchableOpacity>
            <View style={styles.viewButton}>
                <Button title="Next"
                    color={theme.colors.secondary}
                    disabled={!selectedImage}
                    onPress={submitData}

                />
            </View>
        </View>
    );
}

export default Profile;
const styles = StyleSheet.create({
    viewStyle: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        flex: 1,
        paddingTop: Constants.statusBarHeight + 20,
    },

    textHeaderStyle: {
        fontSize: 20,
        color: theme.colors.foreground
    },
    textSecondaryStyle: {
        fontSize: 15,
        color: theme.colors.secondaryText,
        paddingTop: 10
    },
    imageStyle: {
        width: "100%", height: "100%", borderRadius: 100
    },
    touchableOptacityStyle: {
        backgroundColor: theme.colors.background,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 120,
        height: 120,
        width: 120,
        marginTop: 15,

    },
    viewButton: {
        marginTop: "auto",
    }


});