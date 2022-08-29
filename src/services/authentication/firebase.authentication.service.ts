import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser, onAuthStateChanged, NextOrObserver, ErrorFn } from "firebase/auth";


import { User } from "../../infrastructure/types/user.types";
import { AuthenticationService, UserChangeCallback, UserChangeErrorCallback } from "./authentication.service";

const auth = getAuth();

// Fire and forget.  Subscribe to onAuthStateChanged for results.
export const emailLogin = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("emailLogin success", userCredential);
    })
    .catch((error) => {
      console.log("emailLogin", error);
      // const errorCode = error.code;
      // const errorMessage = error.message;
    });
};

export const emailRegister = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password);
  //     .then((user) => {
  //       resolve({
  //         uid: user.user.uid,
  //         displayName: user.user.displayName,
  //         email: user.user.email,
  //         photoURL: user.user.photoURL,
  //       });
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       reject(e.message);
  //     });
  // });
};

export const googleLogin = () => {};

export const logout = () => {
  auth.signOut();
};

export const subscribeUserChange = (callback: UserChangeCallback, errorCallback: UserChangeErrorCallback) => {
  const onStateChanged: NextOrObserver<FirebaseUser> = (firebaseUser) => {
    console.log('auth onStateChanged', firebaseUser);
    let user: User | null = null;
    if (firebaseUser) {
      user = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      }
    }
    callback(user);
  };

  const onError: ErrorFn = (error: Error) => {
    errorCallback(error.message);
  };

  const unsub = onAuthStateChanged(auth, onStateChanged, onError);
  return unsub as () => void;
}

export const FirebaseAuthenticationService: AuthenticationService = {
    emailLogin,
    emailRegister,
    googleLogin,
    logout,
    subscribeUserChange,
}
