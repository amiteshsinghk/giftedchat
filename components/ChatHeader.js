import React, { useContext } from "react";
import {View,Text} from 'react-native'
import { useRoute } from "@react-navigation/native";
import GlobalContext from "../context/Context";
import Avatar from "./Avatar";

const  ChatHeader = ({size,user}) => {
    
    const route = useRoute();
    const {
      theme: { colors },
    } = useContext(GlobalContext);
    return (
      <View style={{ flexDirection: "row" }}>
        <View>
          <Avatar size={40} user={route.params.user} />
        </View>
        <View
          style={{
            marginLeft: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.white, fontSize: 18 }}>
            {route.params.user.contactName || route.params.user.displayName}
          </Text>
        </View>
      </View>
    );
}
export default ChatHeader