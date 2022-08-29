import React, { useState, createContext, FC, useEffect } from "react";

import { User } from "../../infrastructure/types/user.types";
import { AuthenticationService } from "./authentication.service";

export interface AuthenticationContextInterface {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  user?: User;
  emailLogin: AuthenticationService["emailLogin"];
  emailRegister: (email: string, password: string, repeatedPassword: string) => void;
  googleLogin: AuthenticationService["googleLogin"];
  logout: AuthenticationService["logout"];
}

const defaultAuthenticationContextInterface: AuthenticationContextInterface = {
  isAuthenticated: false,
  isLoading: false,
  emailLogin: (email: string, password: string) => {},
  emailRegister: (email: string, password: string, repeatedPassword: string) => {} ,
  googleLogin: () => {},
  logout: () => {},
};

export const AuthenticationContext = createContext<AuthenticationContextInterface>(
  defaultAuthenticationContextInterface
);


type AuthenticationContextProviderProps = {
  service: AuthenticationService
}

export const AuthenticationContextProvider: FC<AuthenticationContextProviderProps> = ({ children, service }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>();

  const { emailLogin, emailRegister: emailRegisterService, googleLogin, logout, subscribeUserChange } = service;

  useEffect(() => {
    const onUserChanged = (user: User | null) => {
      setIsLoading(false);
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        setError(undefined);
      } else {
        setUser(undefined);
      }
    }

    const onError = (error: string) => {
      setError(error);
    };

    const unsub = subscribeUserChange(onUserChanged, onError);
    return unsub;
  }, []);

  const emailRegisterHandler = (email: string, password: string, repeatedPassword: string) => {
    setIsLoading(true);
    if (password !== repeatedPassword) {
      setError("Error: Passwords do not match");
      return;
    }
    
    emailRegisterService(email, password);
  }

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        emailLogin,
        emailRegister: emailRegisterHandler,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
