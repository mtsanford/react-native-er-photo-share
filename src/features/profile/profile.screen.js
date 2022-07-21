import styled from "styled-components/native";
import { View, Text } from "react-native";

export const PlaceHolder = styled(View)`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

export const ProfileScreen = () => {
    return (
        <PlaceHolder>
            <Text>PROFILE</Text>
        </PlaceHolder>
    );
}