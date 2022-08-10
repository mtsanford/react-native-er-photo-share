import styled from "styled-components/native";
import { useContext } from "react";
import { View, Text, Button } from "react-native";

import { AuthenticationContext } from "../../services/authentication/authentication.context";


export const PlaceHolder = styled(View)`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

export const ProfileScreen = () => {
    const { logout }  = useContext(AuthenticationContext)
    return (
        <PlaceHolder>
            <Text>PROFILE</Text>
            <Button title="Logout" onPress={logout}>Logout</Button>
        </PlaceHolder>
    );
}