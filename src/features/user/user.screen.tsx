import styled from "styled-components/native";
import { FC, useEffect, useState } from "react";
import { View, Image } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { User } from "../../infrastructure/types/user.types";
import { Text } from "../../components/typography/text.component"

import { MockUsersService as UsersService } from "../../services/users/mock.users.service"
import { AppStackParamList } from "../../infrastructure/navigation/params";


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
  width: 72px;
  height: 72px;
`;

type UserScreenProps = StackScreenProps<AppStackParamList, 'UserInfo'>;

export const UserScreen: FC<UserScreenProps> = ({ route }) => {
  const uid = route.params.uid;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getInfo = () => {
      UsersService.getUserInfo(uid)
        .then((foundUser: User) => {
          setUser(foundUser);
        })
        .catch((e) => {
          console.log(e);
        })
    }
    getInfo();
  }, [])

  return (
    <Wrapper>
      <UserImage source={{ uri: user?.photoURL || defaultUserURL }} />
      <Text variant="body">{user?.displayName || '....'}</Text>
    </Wrapper>
  );
};

