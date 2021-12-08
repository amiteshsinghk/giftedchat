import React, { useContext, useEffect } from "react";
import { View, StyleSheet,Text } from "react-native";
import {collection, query, where, onSnapshot} from "@firebase/firestore"
import { auth, db } from "../firebase";
import GlobalContext from "../context/Context";
import ContactsFloatingIcon from "../components/ContactsFloatingIcons";
import useContacts from "../hooks/useHooks";

const ChatsScreen =()=>{
    const{ currentUser} = auth;
    const{rooms, setRooms} = useContext(GlobalContext);
    const contacts = useContacts();
    const chatsQuery = query(collection(db,"rooms"),
            where("participantsArray", "array-contains",currentUser.email)
    );
    useEffect(()=>{
            const unsubscribe = onSnapshot(chatsQuery,(querySnapshot) =>{
                const parsedCharts = querySnapshot.docs.filter((doc) => doc.data().lastMessage
                ).map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    userB: doc
                      .data()
                      .participants.find((p) => p.email !== currentUser.email),

                }));
                setRooms(parsedCharts)
            });
            return () => unsubscribe();
          
    },[]);
    function getUserB(user, contacts) {
        const userContact = contacts.find((c) => c.email == user.email);
        if (userContact && userContact.contactName) {
            return{...user, contactName : userContact.contactName};
            
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
            />
             ))}   
            <ContactsFloatingIcon></ContactsFloatingIcon>
        </View>
    );
}

export default ChatsScreen;