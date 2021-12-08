import { useRoute } from "@react-navigation/native";
import React, { useLayoutEffect,useState, useCallback, useEffect, useContext } from "react";
import { View,Text } from "react-native";
import { auth, db } from "../firebase";
import "react-native-get-random-values";
import {nanoid} from "nanoid";
import GlobalContext from "../context/Context";
import {doc,collection,} from "@firebase/firestore";


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

const ChatScreen =({navigation})=>{
    const{ theme : {colors}} = useContext(GlobalContext)
const {currentUser} = auth;
const route= useRoute();
const room = route.params.room;
const selectImage = route.params.selectImage;
const userB = route.params.user;
const randomId = nanoid()
const senderUser = currentUser.photoURL 
? {
    name : currentUser.displayName,
    _id: currentUser.uid,
    avatar: currentUser.photoURL,
} :{ name : currentUser.displayName, _id:currentUser.uid};
    
const roomId = room ? room.id : randomId
const roomRef = doc(db,"rooms", roomId)
const roomMessagesRef = collection(db,"rooms",roomId,"messages");

useEffect(() => {
    (async() => {
        if (!room) {
            const currentUserData={
                displayName : currentUser.displayName,
                email : currentUser.email
            }
            if (currentUser.photoURL) {
                currentUserData.photoURL = currentUser.photoURL
            }
            const userBData ={
                displayName : userB.contactName || userB.displayName || "",
                email : currentUser.email
            }
            if (userB.photoURL) {
                userBData.photoURL =userB.photoURL
                
            }
            try {
                setDoc
            } catch (error) {
                
            }
        }
    })()
},[])

return(
        <View>


        </View>
    );
}
export default ChatScreen