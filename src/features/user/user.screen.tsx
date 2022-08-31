import styled from "styled-components/native";
import { FC, useContext, useEffect, useState } from "react";
import { View, Button, Image } from "react-native";

import { User } from "../../infrastructure/types/user.types";

import { Text } from "../../components/typography/text.component"

const defaultUser = require("../../../assets/mock/users/default_user.jpg")
const defaultUserURL = Image.resolveAssetSource(defaultUser).uri;

const Wrapper = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const UserImage = styled.Image.attrs(props => ({
  width: 36,
  height: 36,
}))`
`;

type UserScreenProps = {
  uid: number;
}

export const UserScreen: FC<UserScreenProps> = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

  }, [])

  return (
    <Wrapper>
      <Image source={{ uri: defaultUserURL }} />
      <Text variant="body">User name</Text>
    </Wrapper>
  );
};
