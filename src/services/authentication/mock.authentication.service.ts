import { AuthenticationService, UserChangeCallback, UserChangeErrorCallback } from "./authentication.service";
import { mockUsers } from "./mock.users";
import { User } from "../../infrastructure/types/user.types"

let userChangeCallback: UserChangeCallback | null = null;
let userChangeErrorCallback: UserChangeErrorCallback | null = null;

const initialUser = mockUsers[0];


const emailLogin = (email: string, password: string) => {
  let foundUser: any = null;
  let error: string | null = null;

  mockUsers.forEach((user: any) => {
    if (user.email === email) {
      foundUser = user;
    }
  });

  if (foundUser) {
    if (foundUser.password !== password) {
      error = "Incorrect Password";
    }
  }
  else {
    error = "No user with that email";
  }
  
  setTimeout(() => {
    if (error) {
      if (userChangeErrorCallback) {
        userChangeErrorCallback(error as string);
      }
    }
    else {
      if (userChangeCallback && foundUser) {
        const { password, ...user } = foundUser;
        userChangeCallback(user);
      }
    }
  }, 1000)

}

const emailRegister = (email: string, password: string) => {

}

const googleLogin = () => {}

const logout =  () => {
  setTimeout(() => {
      if (userChangeCallback) {
        userChangeCallback(null);
      }
  }, 1000);
}

const subscribeUserChange = (callback:  UserChangeCallback, errorCallback: UserChangeErrorCallback) => {
  userChangeCallback = callback;
  userChangeErrorCallback = errorCallback;

  setTimeout(() => {
    if (initialUser && userChangeCallback) {
      const { password, ...user } = initialUser;
      userChangeCallback(user);
    }
  }, 1000)
  
  return () => {
    userChangeCallback = null;
    userChangeErrorCallback = null;
  }
}

export const MockAuthenticationService: AuthenticationService = {
    emailLogin,
    emailRegister,
    googleLogin,
    logout,
    subscribeUserChange
}