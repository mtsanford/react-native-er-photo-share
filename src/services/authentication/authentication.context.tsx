import React, {
  useState,
  createContext,
  FC,
} from "react";

export interface UserInterface {
  id: string;
  name: string;
  photo?: string;
  email: string;
}

export interface AuthenticationContextInterface {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  user?: UserInterface;
  emailLogin: (email: string, password: string) => void;
  emailRegister: (
    email: string,
    password: string,
    repeatedPassword: string
  ) => void;
  googleLogin: () => void;
  logout: () => void;
}

import {
  emailLogin,
  emailRegister,
  googleLogin,
  logout,
} from "./authentication.service";

const defaultAuthenticationContextInterface: AuthenticationContextInterface = {
  isAuthenticated: false,
  isLoading: false,
  emailLogin,
  emailRegister,
  googleLogin,
  logout,
};

export const AuthenticationContext =
  createContext<AuthenticationContextInterface>(
    defaultAuthenticationContextInterface
  );

export const AuthenticationContextProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserInterface>();
  const [error, setError] = useState<string>();

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        emailLogin,
        emailRegister,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
