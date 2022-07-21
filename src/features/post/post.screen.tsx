import styled from "styled-components/native";
import { View, Text } from "react-native";

export const PostPlaceHolder = styled(View)`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

export const PostScreen = () => {
    return (
        <PostPlaceHolder>
            <Text>POST IMAGE</Text>
        </PostPlaceHolder>
    );
}