import { User } from "../../infrastructure/types/user.types";
import { UsersService } from "./users.service";
import { mockUsers } from '../authentication/mock.users';


const getUserInfo = (uid: string): Promise<User> => {
  return new Promise<User>((resolve, reject) => {
    let foundUser: User | null = null;
    mockUsers.forEach((user) => {
      if (user.uid === uid) {
        foundUser = user;
      }
    });

    if (foundUser) {
      setTimeout(() => {
        resolve(foundUser as User);
      }, 5000)
    }
    else {
      reject("user not found!");
    }
  });
}

export const MockUsersService: UsersService = {
  getUserInfo
}