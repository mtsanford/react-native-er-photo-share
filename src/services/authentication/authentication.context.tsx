import React, { useState, createContext, FC, useEffect } from "react";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  NextOrObserver,
  User as FirebaseUser,
  ErrorFn,
} from "firebase/auth";

export interface UserInterface {
  id: string;
  name: string | null;
  photo: string | null;
  email: string | null;
}

export interface AuthenticationContextInterface {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  user?: UserInterface;
  emailLogin: (email: string, password: string) => void;
  emailRegister: (email: string, password: string, repeatedPassword: string) => void;
  googleLogin: () => void;
  logout: () => void;
}

import { emailLogin, emailRegister, googleLogin, logout } from "./authentication.service";

const defaultAuthenticationContextInterface: AuthenticationContextInterface = {
  isAuthenticated: false,
  isLoading: false,
  emailLogin,
  emailRegister,
  googleLogin,
  logout,
};

export const AuthenticationContext = createContext<AuthenticationContextInterface>(
  defaultAuthenticationContextInterface
);

const auth = getAuth();

export const AuthenticationContextProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserInterface>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const onStateChanged: NextOrObserver<FirebaseUser> = (user: FirebaseUser | null) => {
      console.log('auth onStateChanged', user)
      setIsLoading(false);
      if (user) {
        setUser({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        });
        setError(undefined);
      } else {
        setUser(undefined);
      }
    };

    const onError: ErrorFn = (error: Error) => {
      setError(error.message);
    };

    const unsub = onAuthStateChanged(auth, onStateChanged, onError);
    return unsub;
  }, []);

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
