import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from "firebase/auth";

export interface UserInterface {
  id: string;
  name: string | null;
  photo: string | null;
  email: string | null;
}

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


export const emailRegister = (email: string, password: string, repeatedPassword: string): Promise<UserInterface> => {
  return new Promise<UserInterface>((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        resolve({
          id: user.user.uid,
          name: user.user.displayName,
          email: user.user.email,
          photo: user.user.photoURL,
        });
      })
      .catch((e) => {
        console.log(e);
        reject(e.message);
      });
  });
};

export const googleLogin = () => {};

export const logout = () => {
  auth.signOut();
};
