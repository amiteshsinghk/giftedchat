import React  from "react";
import {Image} from 'react-native';

const  Avatar = ({size,user}) => {
    
    return(
<Image style={{
    width:size,
    height:size,
    borderRadius:size
}}
source = {user.photoURL ? {uri:user.photoURL} :require('../assets/icon-square.png') }
resizeMode ="cover"
/>

    );
}
export default Avatar