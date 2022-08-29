import { User } from "../../infrastructure/types/user.types";

export type UserChangeCallback = (user: User | null) => void;
export type UserChangeErrorCallback = (error: string) => void;

export interface AuthenticationService {
  emailLogin: (email: string, password: string) => void;
  emailRegister: (email: string, password: string) => void;
  googleLogin: () => void;
  logout: () => void;
  subscribeUserChange: (callback:  UserChangeCallback, errorCallback: UserChangeErrorCallback) => (() => void)
};
