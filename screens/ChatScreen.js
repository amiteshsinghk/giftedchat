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
import { GiftedChat } from 'react-native-gifted-chat';

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
            />

        </ImageBackground>
    );
}
export default ChatScreen