
// @refresh reset
import React, { useContext, useEffect } from "react";
import { View, StyleSheet,Text } from "react-native";
import {collection, query, where, onSnapshot} from "@firebase/firestore"
import { auth, db } from "../firebase";
import GlobalContext from "../context/Context";
import ContactsFloatingIcon from "../components/ContactsFloatingIcons";
import useContacts from "../hooks/useHooks";
import ListItem from "../components/ListItem";

const ChatsScreen =()=>{
    // const{ currentUser} = auth;
    // const{rooms, setRooms} = useContext(GlobalContext);
    // const contacts = useContacts();
    // const chatsQuery = query(collection(db,"rooms"),
    //         where("participantsArray", "array-contains",currentUser.email)
    // );
    // useEffect(()=>{
    //         const unsubscribe = onSnapshot(chatsQuery,(querySnapshot) =>{
    //             const parsedCharts = querySnapshot.docs.map((doc) => ({
    //                 ...doc.data(),
    //                 id: doc.id,
    //                 userB: doc
    //                   .data()
    //                   .participants.find((p) => p.email != currentUser.email),

    //             }));
    //             setUnfilteredRooms(parsedCharts);
    //             setRooms(parsedCharts.filter((doc) => doc.data().lastMessage))
    //         });
    //         return () => unsubscribe();
          
    // },[]);
    // function getUserB(user, contacts) {
    //     const userContact = contacts.find((c) => c.email == user.email);
    //     if (userContact && userContact.contactName) {
    //         return{...user, contactName : userContact.contactName};
            
    //     }
    //     return user;
    // }

//     const { currentUser } = auth;
//   const { rooms, setRooms, setUnfilteredRooms } = useContext(GlobalContext);
//   const contacts = useContacts();
//   const chatsQuery = query(
//     collection(db, "rooms"),
//     where("participantsArray", "array-contains", currentUser.email)
//   );
//   useEffect(() => {
//     const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
//       const parsedChats = querySnapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//         userB: doc
//           .data()
//           .participants.find((p) => p.email !== currentUser.email),
//       }));
//       setUnfilteredRooms(parsedChats);
//       setRooms(parsedChats.filter((doc) => doc.lastMessage));
//     });
//     return () => unsubscribe();
//   }, []);

//   function getUserB(user, contacts) {
//     const userContact = contacts.find((c) => c.email === user.email);
//     if (userContact && userContact.contactName) {
//       return { ...user, contactName: userContact.contactName };
//     }
//     return user;
//   }


const { currentUser } = auth;
const { rooms, setRooms, setUnfilteredRooms } = useContext(GlobalContext);
const contacts = useContacts();
const chatsQuery = query(
  collection(db, "rooms"),
  where("participantsArray", "array-contains", currentUser.email)
);
useEffect(() => {
  const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
    const parsedChats = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      userB: doc
        .data()
        .participants.find((p) => p.email !== currentUser.email),
    }));
    setUnfilteredRooms(parsedChats);
    setRooms(parsedChats.filter((doc) => doc.lastMessage));
  });
  return () => unsubscribe();
}, []);

function getUserB(user, contacts) {
  const userContact = contacts.find((c) => c.email === user.email);
  if (userContact && userContact.contactName) {
    return { ...user, contactName: userContact.contactName };
  }
  return user;
}
    return(
        
        <View style ={{flex: 1, padding:5, paddingRight: 10}}>
            {rooms.map((room)=> (
            <ListItem type="chat" 
            description={room.lastMessage.text} 
            key={room.id} 
            room={room} 
            time ={room.lastMessage.createdAt}
            user ={getUserB(room.userB,contacts)}
            chats = {true}
            />
             ))}   
            <ContactsFloatingIcon></ContactsFloatingIcon>
        </View>
    );
}

export default ChatsScreen;