import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Text, TouchableOpacity } from "react-native";
import GlobalContext from "../context/Context";
import { Grid, Row, Col } from 'react-native-easy-grid'
import Avatar from "./Avatar";
import { theme } from "../utils";

const ListItem = ({ type, description, user, style, time, room, image, chats }) => {
    const navigation = useNavigation()
    const { theme: { colors } } = useContext(GlobalContext)
    return (
        
        <TouchableOpacity style={{ height: 50, margin:5, ...style }} onPress={() =>
           
            chats ? navigation.navigate("Chat", { user, room, image }) : navigation.replace("Chat", { user, room, image })
        }>
          
            <Grid style={{ maxHeight: 50,borderRadius:15, backgroundColor:theme.colors.white, padding:5 }}>
               
                                    {/* <Col style={{ width: 80, alignItems: "center", justifyContent: "center" }} >
                    <Avatar user={user} size={type == 'contacts' ? 40 : 65} />
                </Col> */}

                {
                    chats ? <Col style={{ width: 40, alignItems: "center" }} >
                        <Avatar user={user} size={40} />
                    </Col> :
                        <Col style={{ width: 40, alignItems: "center"}} >
                            <Avatar user={user} size={40} />
                        </Col>
                }
                <Col style={{ marginLeft: 10 }}>
                    <Row style={{ alignItems: "center" }}>
                        <Col>
                            <Text
                                style={{ fontWeight: "bold", fontSize: 16, color: colors.text }}
                            > {user.displayName ? user.displayName : user.contactName
                                    // user.contactName || user.displayName
                                }
                            </Text>
                        </Col>
                        {time && (
                            <Col style={{ alignItems: "flex-end" }}>
                                <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                                    {new Date(time.seconds * 1000).toLocaleDateString()}

                                </Text>

                            </Col>
                        )}
                    </Row>
                    {description && (
                        <Row style={{ marginTop: -5 }}>
                            <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                                {description}
                            </Text>
                        </Row>
                    )}
                </Col>
               

            </Grid>
            
        </TouchableOpacity>
    );
}

export default ListItem;