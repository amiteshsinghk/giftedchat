import { useRoute } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useCallback, useEffect, useContext } from "react";
import { View, Text, ImageBackground } from "react-native";
import { auth, db } from "../firebase";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import GlobalContext from "../context/Context";
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
    orderBy,
    query,
} from "@firebase/firestore";
import { Actions, Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { pickImage, uploadImage } from "../utils";
import { ScreenStackHeaderBackButtonImage } from "react-native-screens";

// const ChatScreen =({navigation})=>{
//     const [messages, setMessages] = useState([]);
//     useLayoutEffect(() => {
//        const unsubscribe = db.collection('chats').orderBy('createdAt','desc')
//         .onSnapshot(snapshot =>setMessages(
//             snapshot.docs.map(doc =>({
//                 _id:doc.data()._id,
//                 createdAt:doc.data().createdAt.toDate(),
//                 text:doc.data().text,
//                 user:doc.data().user
//             }))
//         ))
//             return unsubscribe;
//     },[])
  
//     const onSend = useCallback((messages = []) => {
//       setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
//         const{
//             _id,
//             createdAt,
//             text,
//             user
//         }= messages[0]
//         db.collection('chats').add({
//             _id,
//             createdAt,
//             text,
//             user
//         })
//     }, [])

//     useLayoutEffect(()=>{
//         navigation.setOptions({
//             headerLeft:() =>(
//                 <View style={{marginLeft:15}}>
//                     <Avatar
//                     rounded
//                     source ={{
//                         uri: auth?.currentUser?.photoURL
//                     }}
//                     />
//                 </View>
//             ),
//             headerRight:()=>(
//                 <TouchableOpacity style={{marginRight:15}}
//                 onPress={signOut}
//                 >
                
//                 <AntDesign name ="logout" size={24}
//                 color ="black"/>
//                 </TouchableOpacity>
//             )
//         })
//     })
//     const signOut =()=>{
//         auth.signOut().then(() => {
//             // Sign-out successful.
//             delay(500)
//             navigation.replace('Register', { screen: 'LoginScreen' });
//             // navigation.replace('LoginScreen')
//           }).catch((error) => {
//             // An error happened.
//           });
//     }
//     return(
//            <GiftedChat
//       messages={messages}
//       showAvatarForEveryMessage ={true}
//       onSend={messages => onSend(messages)}
//       user={{
//         _id: auth?.currentUser?.email,
//         name: auth?.currentUser?.displayName,
//         avatar : auth.currentUser.photoURL

//       }}
//     />
//     )
// }
// export default ChatScreen

const ChatScreen = ({ navigation }) => {
    const [roomHash, setRoomHash] = useState("");
    const [messages, setMessages] = useState([])
    const { theme: { colors } } = useContext(GlobalContext);
    const { currentUser } = auth;
    const route = useRoute();
    const room = route.params.room;
    // console.log("room", room)
    const selectImage = route.params.selectImage;
    const userB = route.params.user;
    const randomId = nanoid()
    const senderUser = currentUser.photoURL
        ? {
            name: currentUser.displayName,
            _id: currentUser.uid,
            avatar: currentUser.photoURL,
        } : { name: currentUser.displayName, _id: currentUser.uid };

    const roomId = room ? room.id : randomId
    const roomRef = doc(db, "rooms", roomId)
    const roomMessagesRef = collection(db, "rooms", roomId, "messages");

    useEffect(() => {
        (async () => {
            if (!room) {
                const currentUserData = {
                    displayName: currentUser.displayName,
                    email: currentUser.email
                }
                if (currentUser.photoURL) {
                    currentUserData.photoURL = currentUser.photoURL
                }
                const userBData = {
                    displayName: userB.contactName || userB.displayName || "",
                    email: userB.email
                }
                if (userB.photoURL) {
                    userBData.photoURL = userB.photoURL

                }
                const roomData = {
                    participants: [currentUserData, userBData],
                    participantsArray: [currentUser.email, userB.email]
                }
                try {
                    await setDoc(roomRef, roomData)
                } catch (error) {
                    console.log(error)
                }
            }
            const emailHash = `${currentUser.email} : ${userB.email}`
            setRoomHash(emailHash);
        })()
    }, []);

    useEffect(() => {
        // const ref= roomMessagesRef.orderBy('createdAt','desc');
        const q = query(roomMessagesRef, orderBy('createdAt','desc'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
            
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type === "added")
                .map(({ doc }) => {
                    const message = doc.data()
                    return { ...message, createdAt: message.createdAt.toDate() }
                    // let t = { ...message, createdAt: message.createdAt.toDate() }
                    // console.log("ttttt", t);
                    // return t

                }).sort((b,a) => a.createdAt.getTime() - b.createdAt.getTime() )

                // console.log("messagesFirestore", messagesFirestore);
                
            appendMessages(messagesFirestore)
        });
        return () => unsubscribe()
    }, []);

    const appendMessages = useCallback((messages) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    }, [messages]);

    async function onSend(messages = []) {
        // console.log("messages", messages)
        const writes = messages.map(m => addDoc(roomMessagesRef, m))
        const lastMessage = messages[messages.length - 1]
        console.log("lastMessage", lastMessage)
        writes.push(updateDoc(roomRef, { lastMessage }))
        await Promise.all(writes)
    }

    async function sendImage(uri, roomPath) {
        const { url, fileName } = await uploadImage(
          uri,
          `images/rooms/${roomPath || roomHash}`
        );
        const message = {
          _id: fileName,
          text: "",
          createdAt: new Date(),
          user: senderUser,
          image: url,
        };
        const lastMessage = { ...message, text: "Image" };
        await Promise.all([
          addDoc(roomMessagesRef, message),
          updateDoc(roomRef, { lastMessage }),
        ]);
      }

    async function handlePhotoPicker() {
        const result = await pickImage();
        if (!result.cancelled) {
          await sendImage(result.uri);
        }
        
    }
    
    console.log("messages", messages)
    return (
        <ImageBackground
            resizeMode="cover"
            source={require("../assets/chatbg.png")}
            style={{ flex: 1 }}
        >
            <GiftedChat
                onSend={onSend}
                messages={messages}
                user={senderUser}
                renderAvatar={null}
                renderActions ={(props) =>(
                    <Actions
                    {...props}
                    containerStyle={{
                        position:"absolute",
                        right:50,
                        bottom:5,
                        zIndex:9999,
                    }}
                    onPressActionButton={handlePhotoPicker}
                    icon={()=>(
                        <Ionicons name ="camera" size ={30} color={colors.iconGray}/>
                    )}
                    />
                )}
                timeTextStyle={{right:{color : colors.iconGray}}}
                renderSend={(props) =>{
                    const{text, messageIdGenerator, user, onSend} = props;
                    return(
                    <TouchableOpacity
                        style={{
                            height : 40,
                            width: 40,
                            borderRadius: 40,
                            backgroundColor : colors.primary,
                            alignItems:"center",
                            justifyContent:"center",
                            marginBottom:5,
                        }}
                        onPress={()=>{
                            if(text && onSend){
                                onSend({
                                    text : text.trim(),
                                    user,
                                    _id:messageIdGenerator(),
                                }, 
                                true
                                );
                            }
                        }}
                        >
                        <Ionicons name="send" size={20} color={colors.white}/>
                        </TouchableOpacity>
                    );
                }}
                renderInputToolbar ={(props)=>(
                   <InputToolbar
                   {...props}
                   containerStyle={{
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 2,
                    borderRadius: 20,
                    paddingTop: 5,
                   }} 
                   />
                )}
                renderBubble ={(props) =>(
                    <Bubble
                    {... props}
                    textStyle={{ right : {color: colors.text}}}
                    wrapperStyle={{
                        left:{
                            background : colors.white,
                        },
                        right:{
                            backgroundColor:colors.tertiary,
                        },
                    }}
                    />
                )}
                // renderMessageImage={(props) =>{
                //     return(
                //         <View>

                //         </View>
                //     );
                // }}


            />

        </ImageBackground>
    );
}
export default ChatScreen